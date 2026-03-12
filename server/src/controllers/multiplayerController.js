const {
    getGlobalMap: getGlobalMapService,
    updateGlobalMap: updateGlobalMapService,
    joinPlayer: joinPlayerService,
    leavePlayer: leavePlayerService,
    getOnlinePlayers: getOnlinePlayersService,
    heartbeatPlayer: heartbeatPlayerService
} = require('../services/multiplayerService');

module.exports = {
    async getGlobalMap(req, res) {
        try {
            const result = await getGlobalMapService();
            return res.json(result);
        } catch (error) {
            console.error('Erro ao carregar mapa global:', error);
            return res.status(500).json({ error: 'Erro ao carregar mapa global' });
        }
    },

    async updateGlobalMap(req, res) {
        try {
            const result = await updateGlobalMapService(req.body);
            return res.json(result);
        } catch (error) {
            console.error('Erro ao salvar mapa global:', error);
            return res.status(500).json({ error: 'Erro ao salvar mapa global' });
        }
    },

    async joinPlayer(req, res) {
        try {
            const result = await joinPlayerService(req.userId, req.body);
            return res.json(result);
        } catch (error) {
            console.error('Erro ao registrar jogador:', error);
            return res.status(500).json({ error: 'Erro ao registrar jogador' });
        }
    },

    async leavePlayer(req, res) {
        try {
            const result = await leavePlayerService(req.userId);
            return res.json(result);
        } catch (error) {
            console.error('Erro ao remover jogador:', error);
            return res.status(500).json({ error: 'Erro ao remover jogador' });
        }
    },

    async getOnlinePlayers(req, res) {
        try {
            const result = await getOnlinePlayersService();
            return res.json(result);
        } catch (error) {
            console.error('Erro ao listar jogadores:', error);
            return res.status(500).json({ error: 'Erro ao listar jogadores' });
        }
    },

    async heartbeatPlayer(req, res) {
        try {
            const result = await heartbeatPlayerService(req.userId);
            return res.json(result);
        } catch (error) {
            console.error('Erro no heartbeat:', error);
            return res.status(500).json({ error: 'Erro no heartbeat' });
        }
    }
};
