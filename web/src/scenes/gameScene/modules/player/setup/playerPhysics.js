/**
 * Configuração de física do jogador
 * Responsabilidade: Configurar gravidade, drag, velocidade e hitbox
 */
export function setupPhysicsWorld(scene) {
    scene.physics.world.gravity.y = 0;
    scene.physics.world.gravity.x = 0;
}

export function setupPlayerPhysics(player, characterSpeed) {
    player.setDrag(900, 900);
    player.setMaxVelocity(characterSpeed, characterSpeed);
}

export function setupPlayerHitbox(player) {
    const body = player.body;
    if (!body) return;
    
    const minDisplay = Math.min(
        player.displayWidth || player.width,
        player.displayHeight || player.height
    );
    const radius = Math.max(8, Math.floor(minDisplay * 0.32));
    
    // Corpo circular reduz enrosco em cantos de colidores estáticos
    if (typeof body.setCircle === 'function') {
        body.setCircle(radius);
        const offsetX = Math.floor((player.displayWidth - radius * 2) / 2);
        const offsetY = Math.floor((player.displayHeight - radius * 2) / 2);
        body.setOffset(offsetX, offsetY);
    } else {
        const size = radius * 2;
        body.setSize(size, size, true);
    }
    
    console.info('[CollisionDebug] Hitbox do player ajustada', {
        radius,
        bodyWidth: body.width,
        bodyHeight: body.height,
        offsetX: body.offset.x,
        offsetY: body.offset.y
    });
}
