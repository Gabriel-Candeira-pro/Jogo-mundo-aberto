const express = require('express');
const authenticate = require('../middlewares/authenticate');
const { exportAllData, importAllData } = require('../services/backupService');

const router = express.Router();

router.get('/export', authenticate, async (req, res) => {
    try {
        const result = await exportAllData(req.userId);
        return res.json(result);
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        return res.status(500).json({ error: 'Erro ao exportar dados' });
    }
});

router.post('/import', authenticate, async (req, res) => {
    try {
        const { data } = req.body;
        const result = await importAllData(req.userId, data);
        return res.json(result);
    } catch (error) {
        console.error('Erro ao importar dados:', error);
        return res.status(500).json({ error: 'Erro ao importar dados' });
    }
});

module.exports = router;
