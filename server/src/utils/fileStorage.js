const fs = require('fs').promises;
const path = require('path');
const { DATA_DIR } = require('../config/env');

let dataLayoutReady = false;

const LEGACY_TO_NEW_STATIC_FILES = {
    'users.json': path.join('users', 'index.json'),
    'global_map.json': path.join('map', 'global_map.json'),
    'active_players.json': path.join('map', 'active_players.json')
};

const LEGACY_USER_FILE_PATTERNS = [
    { regex: /^character_(.+)\.json$/, newName: 'character.json' },
    { regex: /^userdata_(.+)\.json$/, newName: 'userdata.json' },
    { regex: /^session_(.+)\.json$/, newName: 'session.json' },
    { regex: /^map_current_(.+)\.json$/, newName: 'map_current.json' },
    { regex: /^maps_(.+)\.json$/, newName: 'maps.json' }
];

async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function moveIfNeeded(oldRelativePath, newRelativePath) {
    const oldPath = path.join(DATA_DIR, oldRelativePath);
    const newPath = path.join(DATA_DIR, newRelativePath);

    const oldExists = await fileExists(oldPath);
    if (!oldExists) {
        return;
    }

    const newExists = await fileExists(newPath);
    if (newExists) {
        return;
    }

    await ensureDir(path.dirname(newPath));
    await fs.rename(oldPath, newPath);
}

async function migrateLegacyFiles() {
    for (const [legacyName, newPath] of Object.entries(LEGACY_TO_NEW_STATIC_FILES)) {
        await moveIfNeeded(legacyName, newPath);
    }

    const files = await fs.readdir(DATA_DIR);

    for (const filename of files) {
        for (const pattern of LEGACY_USER_FILE_PATTERNS) {
            const match = filename.match(pattern.regex);
            if (!match) {
                continue;
            }

            const userId = match[1];
            const targetPath = path.join('users', userId, pattern.newName);
            await moveIfNeeded(filename, targetPath);
            break;
        }
    }
}

async function ensureDataDir() {
    if (dataLayoutReady) {
        return;
    }

    await ensureDir(DATA_DIR);
    await ensureDir(path.join(DATA_DIR, 'users'));
    await ensureDir(path.join(DATA_DIR, 'map'));
    await migrateLegacyFiles();

    dataLayoutReady = true;
}

async function readJSON(filename) {
    await ensureDataDir();

    try {
        const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}

async function writeJSON(filename, data) {
    await ensureDataDir();

    const fullPath = path.join(DATA_DIR, filename);
    await ensureDir(path.dirname(fullPath));

    await fs.writeFile(
        fullPath,
        JSON.stringify(data, null, 2),
        'utf8'
    );
}

module.exports = {
    ensureDataDir,
    readJSON,
    writeJSON
};
