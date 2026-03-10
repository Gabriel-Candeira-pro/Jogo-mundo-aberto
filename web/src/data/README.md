# Sistema de Dados

## Novidades: Integração com Chunks Procedurais

- O DataManagerHybrid e o APIClient agora suportam carregamento de chunks procedurais via endpoint `/api/map/chunk?x=&y=`.
- O frontend mantém um cache de 3x3 chunks ao redor do player, requisitando chunks conforme o jogador transita entre bordas.
- Apenas alterações (deltas) são persistidas no backend, reduzindo uso de armazenamento.

Este diretório concentra a camada de dados do jogo: autenticação, cliente HTTP, modelos e gerenciadores de estado.

## Estrutura Atual

```text
data/
├── APIClient.js                    # Cliente HTTP modular para backend (/api)
├── AuthManager.js                  # Login, registro, verificação e sessão
├── DataManager.js                  # Gerenciador local legado (localStorage)
├── DataManagerHybrid.js            # Gerenciador principal (multiplayer online)
├── index.js                        # Exports centralizados (modo legado)
├── api/                            # Módulos do APIClient
│   ├── core/APIClientCore.js
│   └── modules/
│       ├── auth.js
│       ├── backup.js
│       ├── character.js
│       ├── health.js
│       ├── map.js
│       ├── session.js
│       └── user.js
├── manager/                        # Módulos do DataManager legado
├── managerHybrid/                  # Módulos do DataManagerHybrid
│   ├── core/HybridDataManagerCore.js
│   └── modules/
│       ├── initialization.js
│       ├── multiplayer.js
│       ├── user.js
│       ├── character.js
│       ├── map.js
│       ├── session.js
│       └── utility.js
└── models/
    ├── Character.js
    ├── User.js
    └── Map.js
```

## Fluxo Recomendado (Atual)

No jogo multiplayer, use `DataManagerHybrid`.

```javascript
import { dataManager } from './data/DataManagerHybrid.js';

// Aguarda inicialização online (auth + carga remota + entrada no multiplayer)
await dataManager.waitForInit();

const character = dataManager.getCharacter();
const user = dataManager.getUser();
const map = dataManager.getMap();

// Sessão de jogo
const session = dataManager.startGameSession();
dataManager.updateSession({ jumps: 10, starsCollected: 3 });
```

## Modos de Operação

- `DataManagerHybrid.js`: modo multiplayer online obrigatório, com sincronização no backend.
- `DataManager.js`: modo legado baseado em `localStorage` (mantido por compatibilidade).

## Persistência de Dados

- Dados principais do jogo (usuário, personagem, mapa global e sessão multiplayer) vêm do backend.
- `localStorage` ainda pode ser usado em pontos auxiliares, como cache de dados de autenticação no cliente.

## Documentação

Veja também:

- `GUIA_DADOS.md`
- `INSTALACAO_BACKEND.md`
- `MULTIPLAYER.md`
