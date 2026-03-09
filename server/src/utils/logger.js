function requestLogger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
}

function logServerStart(port) {
    console.log('');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║       🎮 GAYME MULTIPLAYER SERVER 🎮          ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║  Servidor rodando em: http://localhost:${port}    ║`);
    console.log('║  Diretório de dados: server/data              ║');
    console.log('║                                                ║');
    console.log('║  🌍 MODO MULTIPLAYER ATIVADO                   ║');
    console.log('║  • Mapa global compartilhado                   ║');
    console.log('║  • Todos os jogadores no mesmo mapa            ║');
    console.log('║                                                ║');
    console.log('║  Endpoints disponíveis:                        ║');
    console.log('║  • POST /api/auth/register                     ║');
    console.log('║  • POST /api/auth/login                        ║');
    console.log('║  • GET  /api/character                         ║');
    console.log('║  • POST /api/character                         ║');
    console.log('║  • GET  /api/user                              ║');
    console.log('║  • POST /api/user                              ║');
    console.log('║  • GET  /api/map/global (multiplayer)          ║');
    console.log('║  • POST /api/map/global (atualizar)            ║');
    console.log('║  • GET  /api/players/online                    ║');
    console.log('║  • POST /api/players/join                      ║');
    console.log('║  • POST /api/players/leave                     ║');
    console.log('║  • POST /api/players/heartbeat                 ║');
    console.log('║                                                ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
}

module.exports = {
    requestLogger,
    logServerStart
};
