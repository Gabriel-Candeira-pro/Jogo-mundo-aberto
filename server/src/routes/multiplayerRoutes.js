const express = require('express');
const authenticate = require('../middlewares/authenticate');
const {
    getGlobalMap,
    updateGlobalMap,
    joinPlayer,
    leavePlayer,
    getOnlinePlayers,
    heartbeatPlayer
} = require('../services/multiplayerService');
const { generateChunk } = require('../services/chunkGeneratorService');
const { DATA_DIR } = require('../config/env');

const router = express.Router();
// Endpoint para buscar chunk por posição
router.get('/map/chunk', authenticate, async (req, res) => {
    try {
        const { x, y } = req.query;
        // Definir seed do mundo (pode ser fixo ou vindo de config/env)
        const worldSeed = 12345; // Ajuste conforme necessário
        const chunkX = parseInt(x, 10);
        const chunkY = parseInt(y, 10);
        const chunk = require('../services/chunkGeneratorService').generateChunk(worldSeed, chunkX, chunkY);
        return res.json(chunk);
    } catch (error) {
        console.error('Erro ao gerar chunk:', error);
        return res.status(500).json({ error: 'Erro ao gerar chunk' });
    }
});

router.get('/map/global', authenticate, async (req, res) => {
    try {
        const result = await getGlobalMap();
        return res.json(result);
    } catch (error) {
        console.error('Erro ao carregar mapa global:', error);
        return res.status(500).json({ error: 'Erro ao carregar mapa global' });
    }
});

router.post('/map/global', authenticate, async (req, res) => {
    try {
        const result = await updateGlobalMap(req.body);
        return res.json(result);
    } catch (error) {
        console.error('Erro ao salvar mapa global:', error);
        return res.status(500).json({ error: 'Erro ao salvar mapa global' });
    }
});

router.post('/players/join', authenticate, async (req, res) => {
    try {
        const result = await joinPlayer(req.userId, req.body);
        return res.json(result);
    } catch (error) {
        console.error('Erro ao registrar jogador:', error);
        return res.status(500).json({ error: 'Erro ao registrar jogador' });
    }
});

router.post('/players/leave', authenticate, async (req, res) => {
    try {
        const result = await leavePlayer(req.userId);
        return res.json(result);
    } catch (error) {
        console.error('Erro ao remover jogador:', error);
        return res.status(500).json({ error: 'Erro ao remover jogador' });
    }
});

router.get('/players/online', authenticate, async (req, res) => {
    try {
        const result = await getOnlinePlayers();
        return res.json(result);
    } catch (error) {
        console.error('Erro ao listar jogadores:', error);
        return res.status(500).json({ error: 'Erro ao listar jogadores' });
    }
});

router.post('/players/heartbeat', authenticate, async (req, res) => {
    try {
        const result = await heartbeatPlayer(req.userId);
        return res.json(result);
    } catch (error) {
        console.error('Erro no heartbeat:', error);
        return res.status(500).json({ error: 'Erro no heartbeat' });
    }
});

// Endpoint GET /api/map/chunk?x=&y=
router.get('/map/chunk', authenticate, async (req, res) => {
    try {
        // Coordenadas do chunk
        const chunkX = parseInt(req.query.x, 10);
        const chunkY = parseInt(req.query.y, 10);
        if (isNaN(chunkX) || isNaN(chunkY)) {
            return res.status(400).json({ error: 'Coordenadas chunkX e chunkY inválidas' });
        }

        // Seed global (pode ser fixa ou vinda de config)
        const worldSeed = 'gayme-world-seed'; // TODO: tornar configurável

        // Gera chunk procedural
        const chunk = generateChunk(worldSeed, chunkX, chunkY);


        // Aplica deltas persistidos
        const { readJSON } = require('../utils/fileStorage');
        const chunkDeltas = await readJSON('chunk_deltas.json');
        const key = `${chunkX}:${chunkY}`;
        let deltas = [];
        if (chunkDeltas && chunkDeltas.chunk_deltas && chunkDeltas.chunk_deltas[key]) {
            deltas = chunkDeltas.chunk_deltas[key];
        }
        // Aplica cada delta sobre o chunk
        for (const delta of deltas) {
            // Exemplo: delta = { op: 'remove', type: 'obstacle', id: 'tree_1' }
            if (delta.op === 'remove' && delta.type && delta.id) {
                if (Array.isArray(chunk[delta.type])) {
                    chunk[delta.type] = chunk[delta.type].filter(obj => obj.id !== delta.id);
                }
            }
            // Exemplo: delta = { op: 'add', type: 'obstacle', data: {...} }
            if (delta.op === 'add' && delta.type && delta.data) {
                if (Array.isArray(chunk[delta.type])) {
                    chunk[delta.type].push(delta.data);
                }
            }
            // Outros tipos de delta podem ser implementados
        }
        return res.json({ success: true, chunk, deltas });
    } catch (error) {
        console.error('Erro ao gerar chunk:', error);
        return res.status(500).json({ error: 'Erro ao gerar chunk' });
    }
});

module.exports = router;
