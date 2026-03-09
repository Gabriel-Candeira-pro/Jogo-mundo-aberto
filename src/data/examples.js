/**
 * Exemplos de Uso do DataManager
 * 
 * Este arquivo contém exemplos práticos de como usar o sistema de dados.
 * Copie e cole esses exemplos no console do navegador (F12) para testá-los.
 */

// ==================== EXEMPLOS DE PERSONAGEM ====================

/**
 * Exemplo 1: Criar um personagem super rápido
 */
function criarPersonagemRapido() {
    dataManager.updateCharacter({
        name: 'Sonic',
        speed: 300,
        jumpPower: 450,
        color: 0x0066FF  // Azul
    });
    console.log('✅ Personagem "Sonic" criado! Recarregue a página.');
}

/**
 * Exemplo 2: Criar um personagem tanque (lento mas forte)
 */
function criarPersonagemTanque() {
    dataManager.updateCharacter({
        name: 'Tank',
        speed: 100,
        jumpPower: 250,
        maxHealth: 200,
        health: 200,
        color: 0x888888  // Cinza
    });
    console.log('✅ Personagem "Tank" criado! Recarregue a página.');
}

/**
 * Exemplo 3: Uppar personagem ao máximo
 */
function maxLevelPersonagem() {
    const char = dataManager.getCharacter();
    for (let i = 0; i < 10; i++) {
        char.levelUp();
    }
    dataManager.saveCharacter(char);
    console.log(`✅ ${char.name} agora é nível ${char.level}!`);
}

// ==================== EXEMPLOS DE MAPAS ====================

/**
 * Exemplo 4: Criar um mapa fácil para iniciantes
 */
function criarMapaFacil() {
    const mapaFacil = dataManager.createCustomMap({
        name: 'Tutorial',
        level: 1,
        difficulty: 'easy',
        gravity: 200,
        platforms: [
            { x: 400, y: 568, scaleX: 2, scaleY: 1, type: 'ground' },
            { x: 200, y: 450, scaleX: 1.5, scaleY: 1, type: 'floating' },
            { x: 600, y: 450, scaleX: 1.5, scaleY: 1, type: 'floating' }
        ],
        enemies: [
            { x: 400, y: 300, velocityX: -80, velocityY: 0, type: 'basic' }
        ],
        stars: {
            count: 5,
            startX: 50,
            startY: 0,
            stepX: 150,
            bounceY: { min: 0.5, max: 0.7 },
            velocity: { minX: -100, maxX: 100, y: 20 },
            points: 20
        }
    });
    
    dataManager.setCurrentMap(mapaFacil);
    console.log('✅ Mapa "Tutorial" criado! Recarregue a página.');
}

/**
 * Exemplo 5: Criar um mapa impossível
 */
function criarMapaImpossivel() {
    const mapaImpossivel = dataManager.createCustomMap({
        name: 'Impossível',
        level: 99,
        difficulty: 'extreme',
        gravity: 500,
        platforms: [
            { x: 400, y: 568, scaleX: 1, scaleY: 1, type: 'ground' },
            { x: 100, y: 450, scaleX: 0.5, scaleY: 1, type: 'floating' },
            { x: 700, y: 450, scaleX: 0.5, scaleY: 1, type: 'floating' }
        ],
        enemies: [
            { x: 100, y: 100, velocityX: 250, velocityY: 0, type: 'basic' },
            { x: 200, y: 150, velocityX: -250, velocityY: 0, type: 'basic' },
            { x: 300, y: 200, velocityX: 250, velocityY: 0, type: 'basic' },
            { x: 400, y: 250, velocityX: -250, velocityY: 0, type: 'basic' },
            { x: 500, y: 300, velocityX: 250, velocityY: 0, type: 'basic' },
            { x: 600, y: 350, velocityX: -250, velocityY: 0, type: 'basic' },
            { x: 700, y: 400, velocityX: 250, velocityY: 0, type: 'basic' }
        ],
        stars: {
            count: 20,
            startX: 10,
            startY: 0,
            stepX: 40,
            bounceY: { min: 0.2, max: 0.9 },
            velocity: { minX: -300, maxX: 300, y: 50 },
            points: 50
        }
    });
    
    dataManager.setCurrentMap(mapaImpossivel);
    console.log('✅ Mapa "Impossível" criado! Boa sorte! Recarregue a página.');
}

/**
 * Exemplo 6: Mapa vertical (ênfase em pulos)
 */
function criarMapaVertical() {
    const mapaVertical = dataManager.createCustomMap({
        name: 'Torre Vertical',
        level: 5,
        difficulty: 'hard',
        gravity: 350,
        platforms: [
            { x: 400, y: 568, scaleX: 1, scaleY: 1, type: 'ground' },
            { x: 200, y: 480, scaleX: 0.8, scaleY: 1, type: 'floating' },
            { x: 600, y: 400, scaleX: 0.8, scaleY: 1, type: 'floating' },
            { x: 200, y: 320, scaleX: 0.8, scaleY: 1, type: 'floating' },
            { x: 600, y: 240, scaleX: 0.8, scaleY: 1, type: 'floating' },
            { x: 400, y: 160, scaleX: 0.8, scaleY: 1, type: 'floating' }
        ],
        enemies: [
            { x: 200, y: 400, velocityX: 120, velocityY: 0, type: 'basic' },
            { x: 600, y: 300, velocityX: -120, velocityY: 0, type: 'basic' }
        ],
        playerSpawn: { x: 400, y: 500 },
        stars: {
            count: 10,
            startX: 30,
            startY: 50,
            stepX: 80,
            bounceY: { min: 0.6, max: 0.8 },
            velocity: { minX: -150, maxX: 150, y: 25 },
            points: 15
        }
    });
    
    dataManager.setCurrentMap(mapaVertical);
    console.log('✅ Mapa "Torre Vertical" criado! Recarregue a página.');
}

// ==================== EXEMPLOS DE USUÁRIO ====================

/**
 * Exemplo 7: Configurar perfil de usuário
 */
function configurarPerfil() {
    dataManager.updateUser({
        username: 'ProGamer',
        email: 'progamer@gayme.com'
    });
    
    const user = dataManager.getUser();
    user.updateSettings({
        soundEnabled: true,
        musicEnabled: true,
        volume: 0.8,
        difficulty: 'normal'
    });
    dataManager.saveUser(user);
    
    console.log('✅ Perfil configurado!');
}

/**
 * Exemplo 8: Ver estatísticas detalhadas
 */
function verEstatisticas() {
    const user = dataManager.getUser();
    const char = dataManager.getCharacter();
    const map = dataManager.getMap();
    
    console.log('');
    console.log('═══════════════════════════════');
    console.log('📊 ESTATÍSTICAS DO JOGADOR');
    console.log('═══════════════════════════════');
    console.log('');
    console.log('👤 USUÁRIO');
    console.log(`   Nome: ${user.username}`);
    console.log(`   High Score: ${user.highScore}`);
    console.log(`   Total Score: ${user.totalScore}`);
    console.log(`   Partidas Jogadas: ${user.gamesPlayed}`);
    console.log(`   Vitórias: ${user.gamesWon}`);
    console.log(`   Taxa de Vitória: ${user.getWinRate()}%`);
    console.log(`   Conquistas: ${user.achievements.length}`);
    console.log('');
    console.log('🎮 PERSONAGEM');
    console.log(`   Nome: ${char.name}`);
    console.log(`   Nível: ${char.level}`);
    console.log(`   Vida: ${char.health}/${char.maxHealth}`);
    console.log(`   Velocidade: ${char.speed}`);
    console.log(`   Poder de Pulo: ${char.jumpPower}`);
    console.log(`   XP: ${char.experience}`);
    console.log(`   Moedas: ${char.coins}`);
    console.log('');
    console.log('🗺️  MAPA ATUAL');
    console.log(`   Nome: ${map.name}`);
    console.log(`   Nível: ${map.level}`);
    console.log(`   Dificuldade: ${map.difficulty}`);
    console.log(`   Plataformas: ${map.platforms.length}`);
    console.log(`   Inimigos: ${map.enemies.length}`);
    console.log(`   Completado: ${map.completed ? 'Sim' : 'Não'}`);
    console.log('');
    console.log('📈 ESTATÍSTICAS');
    console.log(`   Estrelas Coletadas: ${user.statistics.totalStarsCollected}`);
    console.log(`   Inimigos Derrotados: ${user.statistics.totalEnemiesDefeated}`);
    console.log(`   Total de Pulos: ${user.statistics.totalJumps}`);
    console.log(`   Tempo de Jogo: ${Math.floor(user.statistics.totalPlayTime / 60)}m ${user.statistics.totalPlayTime % 60}s`);
    console.log(`   Mortes: ${user.statistics.deaths}`);
    if (user.statistics.fastestWin) {
        console.log(`   Vitória Mais Rápida: ${user.statistics.fastestWin}s`);
    }
    console.log('');
    console.log('═══════════════════════════════');
}

/**
 * Exemplo 9: Resetar tudo
 */
function resetarTudo() {
    if (confirm('Tem certeza que deseja resetar TODOS os dados?')) {
        dataManager.clearAllData();
        console.log('✅ Todos os dados foram resetados! Recarregue a página.');
    }
}

/**
 * Exemplo 10: Backup e Restauração
 */
function fazerBackup() {
    const dados = dataManager.exportData();
    const json = JSON.stringify(dados, null, 2);
    
    console.log('📦 BACKUP DOS DADOS:');
    console.log(json);
    console.log('');
    console.log('💾 Copie o JSON acima e salve em um arquivo.');
    
    // Tenta copiar para clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(json)
            .then(() => console.log('✅ Backup copiado para a área de transferência!'))
            .catch(() => console.log('⚠️ Não foi possível copiar automaticamente.'));
    }
    
    return dados;
}

function restaurarBackup(dados) {
    if (dataManager.importData(dados)) {
        console.log('✅ Backup restaurado com sucesso! Recarregue a página.');
    } else {
        console.log('❌ Erro ao restaurar backup.');
    }
}

// ==================== MENU DE AJUDA ====================

/**
 * Mostra menu de ajuda com todos os comandos disponíveis
 */
function ajuda() {
    console.log('');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║       🎮 GAYME - SISTEMA DE DADOS 🎮          ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log('║                                                ║');
    console.log('║  PERSONAGENS:                                  ║');
    console.log('║  • criarPersonagemRapido()                     ║');
    console.log('║  • criarPersonagemTanque()                     ║');
    console.log('║  • maxLevelPersonagem()                        ║');
    console.log('║                                                ║');
    console.log('║  MAPAS:                                        ║');
    console.log('║  • criarMapaFacil()                            ║');
    console.log('║  • criarMapaImpossivel()                       ║');
    console.log('║  • criarMapaVertical()                         ║');
    console.log('║                                                ║');
    console.log('║  USUÁRIO:                                      ║');
    console.log('║  • configurarPerfil()                          ║');
    console.log('║  • verEstatisticas()                           ║');
    console.log('║                                                ║');
    console.log('║  UTILIDADES:                                   ║');
    console.log('║  • fazerBackup()                               ║');
    console.log('║  • restaurarBackup(dados)                      ║');
    console.log('║  • resetarTudo()                               ║');
    console.log('║  • ajuda()                                     ║');
    console.log('║                                                ║');
    console.log('║  📖 Veja GUIA_DADOS.md para mais detalhes     ║');
    console.log('║                                                ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
}

// Mostra ajuda automaticamente
console.log('');
console.log('✨ Exemplos de uso do DataManager carregados!');
console.log('💡 Digite ajuda() para ver todos os comandos disponíveis.');
console.log('');
