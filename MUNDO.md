# Como o Mundo é Construído 🌍

Este documento explica como o mundo do jogo é estruturado, carregado e renderizado.

---

## 🗺️ Visão Geral

O mundo do Gayme é um **mapa global único compartilhado** por todos os jogadores. Ele é composto por camadas de elementos visuais (água, estradas, edifícios, obstáculos, NPCs e itens colecionáveis) que formam uma vila explorável em perspectiva top-down.

```
┌─────────────────────────────────────────────────────────┐
│  GameScene  (renderização, física e controles)          │
│  → renderMap()       – desenha cada camada do mundo     │
│  → setupMapCollisions() – configura bloqueios/física    │
└────────────────────────┬────────────────────────────────┘
                         │ getMap()
┌────────────────────────▼────────────────────────────────┐
│  DataManagerHybrid  (orquestração de dados)             │
│  → init()            – autentica e carrega dados        │
│  → loadFromServer()  – busca mapa global da API         │
└────────────────────────┬────────────────────────────────┘
                         │ GET /api/map/global
┌────────────────────────▼────────────────────────────────┐
│  Backend (server/server.js)                             │
│  → lê/escreve  server/data/global_map.json              │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Estrutura de Dados do Mapa

O mapa é definido pela classe `Map` (`src/data/models/Map.js`) e pelo arquivo JSON do servidor (`server/data/global_map.json`).

### Propriedades do mapa

| Propriedade       | Tipo      | Descrição                                          |
|-------------------|-----------|----------------------------------------------------|
| `id`              | string    | Identificador único                                |
| `name`            | string    | Nome do mapa                                       |
| `level`           | number    | Nível do mapa                                      |
| `difficulty`      | string    | `easy`, `normal`, `hard`, `extreme`                |
| `width` / `height`| number    | Dimensões do mapa em pixels                        |
| `backgroundColor` | string    | Cor de fundo em hex (`#2d2d44`)                    |
| `skyColor`        | string    | Cor do céu em hex (`#87CEEB`)                      |
| `gravity`         | number    | Gravidade (padrão: 300)                            |
| `playerSpawn`     | `{x, y}`  | Posição inicial do jogador                         |
| `platforms`       | array     | Plataformas de colisão (modo clássico)             |
| `enemies`         | array     | Inimigos                                           |
| `stars`           | object    | Configuração dos itens coletáveis (estrelas)       |
| `buildings`       | array     | Edifícios da vila                                  |
| `water`           | array     | Zonas de água                                      |
| `roads`           | array     | Estradas                                           |
| `obstacles`       | array     | Obstáculos (árvores, rochas)                       |
| `collectibles`    | array     | Itens colecionáveis (moedas, etc.)                 |
| `npcs`            | array     | Personagens não-jogáveis                           |
| `timeLimit`       | number    | Limite de tempo em segundos (`null` = sem limite)  |
| `customSettings`  | object    | Configurações extras livres                        |

---

## 🧱 Elementos do Mundo

### 🏠 Edifícios (`buildings`)

Cada edifício é um retângulo com uma cor correspondente ao seu tipo:

```javascript
{
  x: 100, y: 200,        // posição (canto superior esquerdo)
  width: 60, height: 80, // dimensões em pixels
  type: 'house',         // tipo: house | tower | church | mill | market | farm | decoration
  name: 'Casa do João',  // nome exibido sobre o edifício
  collision: true,       // true = bloqueia o jogador
  id: 'building_1'       // identificador único
}
```

Cores por tipo:

| Tipo          | Cor                  |
|---------------|----------------------|
| `house`       | Marrom (`#A0522D`)   |
| `tower`       | Cinza (`#696969`)    |
| `church`      | Marrom escuro (`#8B4513`) |
| `mill`        | Bege (`#CD853F`)     |
| `market`      | Dourado (`#DAA520`)  |
| `farm`        | Verde oliva (`#6B8E23`) |
| `decoration`  | Vermelho tomate (`#FF6347`) |

---

### 💧 Água (`water`)

Zonas de água renderizadas em azul, podendo ou não bloquear o jogador:

```javascript
{
  x: 300, y: 400,
  width: 150, height: 80,
  collision: true,  // true = impede passagem
  id: 'water_1'
}
```

---

### 🛤️ Estradas (`roads`)

Faixas de cor bege que formam os caminhos entre os edifícios:

```javascript
{
  x: 0, y: 280,
  width: 800, height: 40,
  id: 'road_1'
}
```

---

### 🌲 Obstáculos (`obstacles`)

Árvores (verdes) e rochas (cinza):

```javascript
{
  x: 500, y: 200,
  width: 30, height: 40,
  type: 'tree',   // tree | rock
  collision: true,
  id: 'obstacle_1'
}
```

---

### 🪙 Itens Colecionáveis (`collectibles`)

Círculos dourados (moedas) ou rosa (outros itens):

```javascript
{
  x: 150, y: 250,
  type: 'coin',   // coin | item
  id: 'coin_1'
}
```

---

### 🧑 NPCs (`npcs`)

Personagens não-jogáveis renderizados como círculos magenta com nome:

```javascript
{
  x: 200, y: 300,
  name: 'Aldeão',
  id: 'npc_1'
}
```

---

## 🎨 Ordem de Renderização (Camadas / Depth)

O mundo é desenhado em camadas, do fundo para a frente:

| Profundidade (depth) | Elemento                        |
|---------------------|---------------------------------|
| 0 (câmera)          | Cor do céu (backgroundColor)    |
| 1                   | Água                            |
| 2                   | Estradas                        |
| 3                   | Obstáculos, edifícios, itens, NPCs |
| 4                   | Rótulos de texto (nomes)        |
| 50                  | Círculo de debug do jogador     |
| 100                 | HUD (score, personagem, mapa)   |

---

## ⚙️ Processo de Carregamento do Mundo

### 1. Autenticação

Ao iniciar o jogo, `DataManagerHybrid.init()` verifica se o jogador está autenticado via JWT. Sem login, o jogo não carrega.

### 2. Busca do Mapa no Servidor

```javascript
// src/data/DataManagerHybrid.js
await this.loadFromServer();
// → GET /api/map/global  (requer token JWT)
// → Resposta: { success: true, data: { ...mapData } }
this.currentMap = Map.fromJSON(mapData.data);
```

Se o arquivo `server/data/global_map.json` não existir, o servidor cria automaticamente um mapa padrão com plataformas, inimigos e estrelas.

### 3. Renderização do Mapa

```javascript
// src/scenes/GameScene.js
renderMap() {
    // Cor do céu
    this.cameras.main.setBackgroundColor(this.mapData.skyColor);

    // Camada 1: Água
    this.mapData.water.forEach(w => this.add.rectangle(...));

    // Camada 2: Estradas
    this.mapData.roads.forEach(r => this.add.rectangle(...));

    // Camada 3: Obstáculos
    this.mapData.obstacles.forEach(o => this.add.rectangle(...));

    // Camada 3: Edifícios + labels
    this.mapData.buildings.forEach(b => {
        this.add.rectangle(...);
        this.add.text(...); // nome do edifício
    });

    // Camada 3: Colecionáveis
    this.mapData.collectibles.forEach(c => this.add.circle(...));

    // Camada 3: NPCs + labels
    this.mapData.npcs.forEach(n => {
        this.add.circle(...);
        this.add.text(...); // nome do NPC
    });
}
```

### 4. Configuração de Física e Colisões

```javascript
setupMapCollisions() {
    // Edifícios com collision: true bloqueiam o jogador
    this.buildings = this.physics.add.staticGroup();
    this.mapData.buildings
        .filter(b => b.collision)
        .forEach(b => this.buildings.create(...));
    this.physics.add.collider(this.player, this.buildings);

    // Mesmo para obstáculos e zonas de água
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.player, this.waterZones);
}
```

O jogo usa **gravidade zero** (top-down), então o jogador se move em 4 direções sem cair.

---

## 🌐 Mundo Compartilhado (Multiplayer)

O mapa é **global e único** — todos os jogadores online veem e exploram o mesmo mundo:

- O servidor armazena o mapa em `server/data/global_map.json`
- Todos os clientes carregam o mapa via `GET /api/map/global`
- O servidor também mantém `server/data/active_players.json` com a lista de jogadores online
- Um heartbeat a cada 30 segundos mantém os jogadores registrados como ativos
- Jogadores inativos por mais de 5 minutos são removidos automaticamente

---

## 🛠️ Como Personalizar o Mundo

### Via console do navegador (F12)

```javascript
// Ver o mapa atual
const mapa = dataManager.getMap();
console.log(mapa);

// Criar um mapa customizado com vila
const novaVila = dataManager.createCustomMap({
    name: 'Minha Vila',
    skyColor: '#87CEEB',
    buildings: [
        { x: 100, y: 200, width: 60, height: 80, type: 'house', name: 'Casa 1', collision: true, id: 'b1' },
        { x: 400, y: 150, width: 80, height: 100, type: 'church', name: 'Igreja', collision: true, id: 'b2' }
    ],
    water: [
        { x: 600, y: 300, width: 120, height: 60, collision: true, id: 'w1' }
    ],
    roads: [
        { x: 0, y: 280, width: 800, height: 40, id: 'r1' }
    ],
    obstacles: [
        { x: 50, y: 100, width: 25, height: 35, type: 'tree', collision: true, id: 'o1' }
    ],
    npcs: [
        { x: 300, y: 250, name: 'Guarda', id: 'npc1' }
    ],
    collectibles: [
        { x: 200, y: 220, type: 'coin', id: 'c1' }
    ]
});

dataManager.setCurrentMap(novaVila);
location.reload();
```

### Editando o arquivo do servidor diretamente

Edite `server/data/global_map.json` e reinicie o servidor para que todos os jogadores carreguem o novo mapa.

---

## 📁 Arquivos Relacionados

| Arquivo | Função |
|--------|--------|
| `src/data/models/Map.js` | Modelo de dados do mapa (classe `Map`) |
| `src/scenes/GameScene.js` | Renderização, física e colisões do mundo |
| `src/data/DataManagerHybrid.js` | Carregamento e sincronização do mapa |
| `src/data/api/modules/map.js` | Chamadas à API de mapa |
| `server/server.js` | Endpoints `/api/map/global` |
| `server/data/global_map.json` | Dados persistidos do mapa global |

---

## 📖 Documentação Relacionada

- [README.md](README.md) – Visão geral do projeto
- [GUIA_DADOS.md](GUIA_DADOS.md) – Sistema de dados (personagens, usuários, mapas)
- [MULTIPLAYER.md](MULTIPLAYER.md) – Modo multiplayer
- [QUICKSTART.md](QUICKSTART.md) – Como iniciar o projeto
