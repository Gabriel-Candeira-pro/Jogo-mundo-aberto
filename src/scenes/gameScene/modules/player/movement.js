/**
 * Módulo de movimentação do jogador.
 *
 * Lógica de movimentação (top-down, 4 direções):
 *  - Teclas WASD no teclado para mover o personagem nos eixos X e Y.
 *  - Controles touch (esquerda/direita) fornecidos por TouchControls.
 *  - A velocidade aplicada em cada eixo é igual a `character.speed` definida
 *    nos dados do personagem carregado pelo DataManager.
 *  - Quando nenhuma tecla está pressionada a velocidade é zerada, parando o
 *    personagem imediatamente (sem inércia).
 *  - Movimento diagonal é suportado: pressionar duas teclas simultaneamente
 *    aplica velocidade nos dois eixos ao mesmo tempo.
 */

import { TouchControls } from '../../../../utils/controls.js';

/**
 * Registra as teclas WASD e instancia os controles touch usados no loop de
 * movimentação.  Deve ser chamado uma única vez, durante o `create` da cena.
 *
 * Após a chamada, a cena terá:
 *  - `scene.keys`          – mapa com as teclas W, A, S e D
 *  - `scene.touchControls` – instância de TouchControls
 *
 * @param {Phaser.Scene} scene - A cena do jogo.
 */
export function setupControls(scene) {
    scene.keys = {
        W: scene.input.keyboard.addKey('W'),
        A: scene.input.keyboard.addKey('A'),
        S: scene.input.keyboard.addKey('S'),
        D: scene.input.keyboard.addKey('D')
    };
    scene.touchControls = new TouchControls(scene);
}

/**
 * Calcula e aplica a velocidade do jogador com base nas entradas de teclado
 * e toque.  Deve ser chamado a cada frame, dentro do `update` da cena.
 *
 * Regras de movimentação:
 *  - **Horizontal**: A (ou toque esquerdo) → velocidade negativa em X;
 *    D (ou toque direito) → velocidade positiva em X.
 *  - **Vertical**: W → velocidade negativa em Y (para cima);
 *    S → velocidade positiva em Y (para baixo).
 *  - Se nenhuma tecla estiver pressionada no eixo, a velocidade daquele eixo
 *    é definida como 0.
 *  - A magnitude da velocidade em cada eixo é `scene.character.speed`.
 *
 * @param {Phaser.Scene} scene - A cena do jogo com `keys`, `touchControls`,
 *                               `player` e `character` já inicializados.
 */
export function handleMovement(scene) {
    const leftPressed  = scene.keys.A.isDown || scene.touchControls.getLeftInput();
    const rightPressed = scene.keys.D.isDown || scene.touchControls.getRightInput();
    const upPressed    = scene.keys.W.isDown;
    const downPressed  = scene.keys.S.isDown;

    let velocityX = 0;
    let velocityY = 0;

    // Movimento horizontal
    if (leftPressed) {
        velocityX = -scene.character.speed;
    } else if (rightPressed) {
        velocityX = scene.character.speed;
    }

    // Movimento vertical
    if (upPressed) {
        velocityY = -scene.character.speed;
    } else if (downPressed) {
        velocityY = scene.character.speed;
    }

    // Aplica velocidade ao sprite do jogador
    scene.player.setVelocity(velocityX, velocityY);
}
