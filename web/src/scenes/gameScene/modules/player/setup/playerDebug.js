/**
 * Ferramentas de debug visual do jogador
 * Responsabilidade: Criar e sincronizar elementos visuais de debug
 */
export function createDebugCircle(scene, spawn) {
    const debugCircle = scene.add.circle(spawn.x, spawn.y, 20, 0x00FF00);
    debugCircle.setDepth(50);
    debugCircle.setStrokeStyle(2, 0x00FF00);
    debugCircle.setAlpha(0.2);
    
    return debugCircle;
}

export function setupDebugCircleSync(scene, player, debugCircle) {
    // Mantém o debug visual no centro do jogador para validar alinhamento do hitbox
    const syncDebugCircle = () => {
        debugCircle.setPosition(player.x, player.y);
    };
    
    scene.events.on('postupdate', syncDebugCircle);
    
    // Cleanup ao desligar a cena
    scene.events.once('shutdown', () => {
        scene.events.off('postupdate', syncDebugCircle);
        debugCircle.destroy();
    });
    
    return syncDebugCircle;
}
