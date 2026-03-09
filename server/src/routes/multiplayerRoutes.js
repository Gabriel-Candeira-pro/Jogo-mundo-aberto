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

const router = express.Router();

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

module.exports = router;
