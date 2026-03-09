/**
 * Núcleo do DataManager com inicialização base
 */
export class DataManagerCore {
    constructor() {
        this.storagePrefix = 'gayme_';
        this.currentUser = null;
        this.currentCharacter = null;
        this.currentMap = null;
        this.init();
    }

    /**
     * Inicializa o gerenciador de dados
     */
    init() {
        // Carrega ou cria usuário padrão
        this.currentUser = this.loadUser() || this.createDefaultUser();

        // Carrega ou cria personagem padrão
        this.currentCharacter = this.loadCharacter() || this.createDefaultCharacter();

        // Carrega ou cria mapa padrão
        this.currentMap = this.loadMap() || this.createDefaultMap();

        // Carrega todos os mapas salvos
        this.savedMaps = this.loadAllMaps();
    }
}
