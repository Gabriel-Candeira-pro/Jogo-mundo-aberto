const express = require('express');
const authenticate = require('../middlewares/authenticate');
const { registerUser, loginUser } = require('../services/authService');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const result = await registerUser(req.body);

        if (result.error) {
            return res.status(result.error.status).json(result.error.body);
        }

        return res.status(result.status).json(result.body);
    } catch (error) {
        console.error('Erro no registro:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const result = await loginUser(req.body);

        if (result.error) {
            return res.status(result.error.status).json(result.error.body);
        }

        return res.status(result.status).json(result.body);
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/verify', authenticate, (req, res) => {
    res.json({ success: true, userId: req.userId });
});

module.exports = router;
