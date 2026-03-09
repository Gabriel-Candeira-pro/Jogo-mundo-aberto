/**
 * Instruções de controle
 */
export function attachInstructionsMethods(GameSceneClass) {
    GameSceneClass.prototype.showInstructions = function showInstructions() {
        const isMobile = this.scale.isPortrait ||
            this.sys.game.device.os.android ||
            this.sys.game.device.os.iOS;

        const instructions = isMobile
            ? 'Use os botões para explorar a vila\nAproxime-se de NPCs para interagir'
            : 'Use WASD para se mover\nExplore a vila e colete itens';

        const instructionsText = this.add.text(
            this.scale.width / 2,
            50,
            instructions,
            {
                fontSize: '18px',
                fill: '#FFF',
                fontFamily: 'Arial',
                align: 'center'
            }
        ).setOrigin(0.5);

        this.add.text(
            this.scale.width / 2,
            85,
            '🌍 MODO MULTIPLAYER - Mapa compartilhado com todos os jogadores',
            {
                fontSize: '14px',
                fill: '#FFFF00',
                fontFamily: 'Arial',
                align: 'center'
            }
        ).setOrigin(0.5);
    };
}
