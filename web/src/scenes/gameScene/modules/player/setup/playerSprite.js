/**
 * Criação e configuração básica do sprite do jogador
 * Responsabilidade: Criar sprite e configurar propriedades visuais
 */
export function createPlayerSprite(scene, spawn, character) {
    console.log('🎮 Criando jogador em:', spawn);
    
    const player = scene.physics.add.sprite(spawn.x, spawn.y, 'player');
    
    // Depth: acima das camadas do mapa (1-4) e abaixo do HUD (100)
    player.setDepth(10);
    player.setBounce(0);
    player.setCollideWorldBounds(true);
    player.setTint(character.color);
    
    return player;
}
