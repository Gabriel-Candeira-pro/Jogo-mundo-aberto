const path = require('path');
const { readJSON, writeJSON } = require('../utils/fileStorage');

const LEGACY_GLOBAL_MAP_FILE = 'map/global_map.json';
const GLOBAL_MAP_DIR = 'map/global_map';
const ACTIVE_PLAYERS_FILE = 'map/active_players.json';

const MAP_CHUNK_DEFINITIONS = [
    {
        file: 'meta.json',
        fields: [
            'id',
            'name',
            'level',
            'difficulty',
            'width',
            'height',
            'gameType',
            'playerSpawn',
            'terrain',
            'skyColor',
            'completions',
            'bestTime',
            'highScore',
            'createdAt',
            'updatedAt'
        ]
    },
    {
        file: 'layout.json',
        fields: ['platforms', 'stars']
    },
    {
        file: 'world.json',
        fields: ['buildings', 'roads', 'obstacles', 'water']
    },
    {
        file: 'entities.json',
        fields: ['npcs', 'collectibles']
    }
];

const MAP_EXTRA_CHUNK_FILE = 'extras.json';
const FIELD_TO_CHUNK = buildFieldToChunkIndex(MAP_CHUNK_DEFINITIONS);

function buildFieldToChunkIndex(definitions) {
    const index = {};

    for (const definition of definitions) {
        for (const field of definition.fields) {
            index[field] = definition.file;
        }
    }

    return index;
}

function splitGlobalMapData(mapData) {
    const chunks = {};

    for (const definition of MAP_CHUNK_DEFINITIONS) {
        chunks[definition.file] = {};
    }
    chunks[MAP_EXTRA_CHUNK_FILE] = {};

    for (const [key, value] of Object.entries(mapData || {})) {
        const chunkFile = FIELD_TO_CHUNK[key] || MAP_EXTRA_CHUNK_FILE;
        chunks[chunkFile][key] = value;
    }

    return chunks;
}

async function writeGlobalMapChunks(mapData) {
    const chunks = splitGlobalMapData(mapData);

    for (const [chunkFile, chunkData] of Object.entries(chunks)) {
        if (Object.keys(chunkData).length === 0 && chunkFile === MAP_EXTRA_CHUNK_FILE) {
            continue;
        }

        await writeJSON(path.join(GLOBAL_MAP_DIR, chunkFile), chunkData);
    }
}

async function readGlobalMapChunks() {
    let hasAtLeastOneChunk = false;
    const mergedMap = {};

    for (const definition of MAP_CHUNK_DEFINITIONS) {
        const chunk = await readJSON(path.join(GLOBAL_MAP_DIR, definition.file));
        if (chunk) {
            Object.assign(mergedMap, chunk);
            hasAtLeastOneChunk = true;
        }
    }

    const extraChunk = await readJSON(path.join(GLOBAL_MAP_DIR, MAP_EXTRA_CHUNK_FILE));
    if (extraChunk) {
        Object.assign(mergedMap, extraChunk);
        hasAtLeastOneChunk = true;
    }

    if (!hasAtLeastOneChunk) {
        return null;
    }

    return mergedMap;
}

async function getOrMigrateGlobalMap() {
    const chunkedMap = await readGlobalMapChunks();
    if (chunkedMap) {
        return chunkedMap;
    }

    const legacyMap = await readJSON(LEGACY_GLOBAL_MAP_FILE);
    if (!legacyMap) {
        return null;
    }

    await writeGlobalMapChunks(legacyMap);
    return legacyMap;
}

function createDefaultGlobalMap() {
    const timestamp = new Date().toISOString();

    return {
        id: 'global_map_1',
        name: 'Village Medieval',
        level: 1,
        difficulty: 1,
        width: 1200,
        height: 800,
        gameType: 'topdown',
        playerSpawn: { x: 600, y: 400 },
        buildings: [
            {
                id: 'house_1',
                name: 'Casa Esquerda',
                x: 80,
                y: 150,
                width: 120,
                height: 100,
                type: 'house',
                collision: true
            },
            {
                id: 'tower',
                name: 'Torre',
                x: 820,
                y: 80,
                width: 100,
                height: 160,
                type: 'tower',
                collision: true
            }
        ],
        roads: [
            {
                id: 'road_main',
                name: 'Estrada Principal',
                x: 0,
                y: 360,
                width: 1200,
                height: 80,
                type: 'dirt_road',
                walkable: true
            }
        ],
        obstacles: [
            {
                id: 'tree_1',
                x: 200,
                y: 300,
                width: 50,
                height: 80,
                type: 'tree',
                collision: true
            }
        ],
        water: [],
        npcs: [],
        collectibles: [],
        terrain: {
            type: 'grass',
            textColor: '#228B22'
        },
        skyColor: '#87CEEB',
        completions: 0,
        bestTime: 0,
        highScore: 0,
        createdAt: timestamp,
        updatedAt: timestamp
    };
}

async function getGlobalMap() {
    let mapData = await getOrMigrateGlobalMap();

    if (!mapData) {
        mapData = createDefaultGlobalMap();
        await writeGlobalMapChunks(mapData);
    }

    return { success: true, data: mapData };
}

async function updateGlobalMap(mapData) {
    const currentMap = (await getOrMigrateGlobalMap()) || createDefaultGlobalMap();
    const updatedMap = {
        ...currentMap,
        ...mapData,
        updatedAt: new Date().toISOString()
    };

    await writeGlobalMapChunks(updatedMap);
    return { success: true, message: 'Mapa global atualizado com sucesso' };
}

async function joinPlayer(userId, { username, characterName }) {
    let players = (await readJSON(ACTIVE_PLAYERS_FILE)) || [];

    const now = new Date().toISOString();
    const playerInfo = {
        userId,
        username: username || 'Player',
        characterName: characterName || 'Hero',
        joinedAt: now,
        lastActivity: now
    };

    players = players.filter(p => p.userId !== userId);
    players.push(playerInfo);

    await writeJSON(ACTIVE_PLAYERS_FILE, players);

    return {
        success: true,
        message: 'Jogador entrou no mapa',
        players: players.length
    };
}

async function leavePlayer(userId) {
    let players = (await readJSON(ACTIVE_PLAYERS_FILE)) || [];
    players = players.filter(p => p.userId !== userId);

    await writeJSON(ACTIVE_PLAYERS_FILE, players);

    return { success: true, message: 'Jogador saiu do mapa' };
}

async function getOnlinePlayers() {
    let players = (await readJSON(ACTIVE_PLAYERS_FILE)) || [];

    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    players = players.filter(p => {
        const lastActivity = new Date(p.lastActivity).getTime();
        return lastActivity > fiveMinutesAgo;
    });

    await writeJSON(ACTIVE_PLAYERS_FILE, players);

    return {
        success: true,
        players: players.map(p => ({
            username: p.username,
            characterName: p.characterName,
            joinedAt: p.joinedAt
        }))
    };
}

async function heartbeatPlayer(userId) {
    const players = (await readJSON(ACTIVE_PLAYERS_FILE)) || [];

    const player = players.find(p => p.userId === userId);
    if (player) {
        player.lastActivity = new Date().toISOString();
        await writeJSON(ACTIVE_PLAYERS_FILE, players);
    }

    return { success: true };
}

module.exports = {
    getGlobalMap,
    updateGlobalMap,
    joinPlayer,
    leavePlayer,
    getOnlinePlayers,
    heartbeatPlayer
};
