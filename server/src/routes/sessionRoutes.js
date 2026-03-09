const express = require('express');
const authenticate = require('../middlewares/authenticate');
const { saveSession, getSession } = require('../services/sessionService');

const router = express.Router();

router.post('/session', authenticate, async (req, res) => {
    try {
        const result = await saveSession(req.userId, req.body);
        return res.json(result);
    } catch (error) {
        console.error('Erro ao salvar sessão:', error);
        return res.status(500).json({ error: 'Erro ao salvar sessão' });
    }
});

router.get('/session', authenticate, async (req, res) => {
    try {
        const result = await getSession(req.userId);
        return res.json(result);
    } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        return res.status(500).json({ error: 'Erro ao carregar sessão' });
    }
});

module.exports = router;
