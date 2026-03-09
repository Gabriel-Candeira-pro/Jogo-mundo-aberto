# GameScene Modular

Estrutura modular da cena principal do jogo, seguindo o mesmo padrao de composicao usado em `DataManagerHybrid` e `APIClient`.

Refatorado seguindo o **Principio da Responsabilidade Unica (SRP)** - cada modulo tem uma responsabilidade especifica.

## Arvore de Arquivos

```
gameScene/
├── core/
│   └── GameSceneCore.js          # Classe base Phaser.Scene
├── modules/
│   ├── data/
│   │   ├── initialization.js     # Carrega dados do jogo
│   │   ├── multiplayer.js        # Sincroniza jogadores online
│   │   └── lifecycle.js          # Shutdown e game over
│   ├── player/
│   │   ├── setup.js              # Cria sprite do jogador
│   │   └── movement.js           # Logica de movimento
│   ├── map/
│   │   ├── renderer.js           # Renderiza elementos do mapa
│   │   └── collision.js          # Sistema de colisoes
│   ├── ui/
│   │   ├── hud.js                # Elementos de status
│   │   ├── instructions.js       # Instrucoes de controle
│   │   └── resize.js             # Gerencia redimensionamento
│   └── input/
│       └── controls.js           # Configura teclado e touch
└── README.md
```

## Detalhamento dos Modulos

### `core/GameSceneCore.js`
Classe base que estende `Phaser.Scene` com estado inicial e lifecycle hooks (`create`, `update`).

### `modules/data/`

#### `initialization.js`
Inicializacao de dados do jogo:
- `initGameData()` - Carrega personagem, usuario e mapa global

#### `multiplayer.js`
Sincronizacao de jogadores online:
- `updateOnlinePlayersDisplay()` - Atualiza lista de jogadores online
- `updatePlayersCount()` - Atualiza contador de jogadores na UI

#### `lifecycle.js`
Lifecycle e finalizacao:
- `shutdown()` - Remove jogador do multiplayer ao sair da cena
- `gameOver()` - Finaliza sessao e exibe tela de game over

### `modules/player/`

#### `setup.js`
Setup do sprite do jogador:
- `setupPlayer()` - Cria sprite do jogador e configura fisica

#### `movement.js`
Movimento do jogador:
- `handleMovement()` - Processa entrada WASD/touch e aplica velocidade ao jogador

### `modules/map/`

#### `renderer.js`
Renderizacao do mapa:
- `renderMap()` - Coordena renderizacao de todos os elementos
- `renderWater()` - Renderiza agua
- `renderRoads()` - Renderiza estradas
- `renderObstacles()` - Renderiza obstaculos (arvores, rochas)
- `renderBuildings()` - Renderiza edificios
- `renderCollectibles()` - Renderiza itens colecionaveis
- `renderNPCs()` - Renderiza NPCs

#### `collision.js`
Sistema de colisoes:
- `setupMapCollisions()` - Configura todos os colisores
- `setupBuildingCollisions()` - Colisores de edificios
- `setupObstacleCollisions()` - Colisores de obstaculos
- `setupWaterCollisions()` - Colisores de agua

### `modules/ui/`

#### `hud.js`
HUD e elementos de status:
- `setupUI()` - Cria textos de score, personagem, usuario, mapa e jogadores online

#### `instructions.js`
Instrucoes de controle:
- `showInstructions()` - Exibe instrucoes de controle (desktop/mobile)

#### `resize.js`
Gerenciamento de resize:
- `setupResize()` - Registra listener de resize
- `handleResize()` - Reposiciona elementos de UI quando a tela redimensiona

### `modules/input/`

#### `controls.js`
Configuracao de entrada:
- `setupControls()` - Configura teclas WASD e controles touch

## Composicao

A composicao final acontece em `src/scenes/GameScene.js`:

1. A classe `GameScene` estende `GameSceneCore`.
2. Cada modulo anexa metodos com `attach*Methods(GameScene)`.
3. A cena e exportada como `GameScene` e usada em `src/game.js`.

## Principio da Responsabilidade Unica

Cada arquivo tem uma unica responsabilidade:
- **data/initialization** - Apenas inicializacao de dados
- **data/multiplayer** - Apenas sincronizacao de jogadores online
- **data/lifecycle** - Apenas shutdown e game over
- **player/setup** - Apenas criacao do sprite e fisica
- **player/movement** - Apenas logica de movimento
- **map/renderer** - Apenas renderizacao visual do mapa
- **map/collision** - Apenas sistema de colisoes
- **ui/hud** - Apenas elementos de status na tela
- **ui/instructions** - Apenas exibicao de instrucoes
- **ui/resize** - Apenas gerenciamento de redimensionamento
- **input/controls** - Apenas configuracao de entrada

## Como adicionar novo modulo

1. Identifique a responsabilidade unica do novo modulo.
2. Crie `src/scenes/gameScene/modules/<categoria>/<nome>.js` com `export function attach<Nome>Methods(GameSceneClass) { ... }`.
3. Importe o `attach` em `src/scenes/GameScene.js`.
4. Execute `attach<Nome>Methods(GameScene)` apos os demais `attach`.
5. Rode `npm run build` para validar.

## Movimentos

Os movimentos do jogador sao gerenciados em:
- `modules/input/controls.js` - Captura entrada (teclado WASD + touch)
- `modules/player/movement.js` - Aplica aceleração e desaceleração (drag) em `handleMovement()`
- `src/utils/controls.js` - Logica de touch (esquerda/direita/pulo)
