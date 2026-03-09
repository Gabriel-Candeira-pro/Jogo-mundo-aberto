const express = require('express');
const authenticate = require('../middlewares/authenticate');
const {
    saveCharacter,
    getCharacter,
    saveUserData,
    getUserData
} = require('../services/profileService');

const router = express.Router();

router.post('/character', authenticate, async (req, res) => {
    try {
        const result = await saveCharacter(req.userId, req.body);
        return res.json(result);
    } catch (error) {
        console.error('Erro ao salvar personagem:', error);
        return res.status(500).json({ error: 'Erro ao salvar personagem' });
    }
});

router.get('/character', authenticate, async (req, res) => {
    try {
        const result = await getCharacter(req.userId);

        if (result.error) {
            return res.status(result.error.status).json(result.error.body);
        }

        return res.json(result);
    } catch (error) {
        console.error('Erro ao carregar personagem:', error);
        return res.status(500).json({ error: 'Erro ao carregar personagem' });
    }
});

router.post('/user', authenticate, async (req, res) => {
    try {
        const result = await saveUserData(req.userId, req.body);
        return res.json(result);
    } catch (error) {
        console.error('Erro ao salvar dados do usuário:', error);
        return res.status(500).json({ error: 'Erro ao salvar dados do usuário' });
    }
});

router.get('/user', authenticate, async (req, res) => {
    try {
        const result = await getUserData(req.userId);

        if (result.error) {
            return res.status(result.error.status).json(result.error.body);
        }

        return res.json(result);
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        return res.status(500).json({ error: 'Erro ao carregar dados do usuário' });
    }
});

module.exports = router;
