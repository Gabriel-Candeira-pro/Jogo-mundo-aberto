# Manager Hybrid

Estrutura modular do `HybridDataManager`, seguindo o mesmo padrao de composicao usado em `APIClient` e `DataManager`.

## Estrutura

- `core/HybridDataManagerCore.js`
- Responsavel apenas pelo estado base da instancia e bootstrap inicial (`initPromise`).

- `modules/initialization.js`
- Inicializacao online obrigatoria, `waitForInit()`, carga de dados do servidor e metodos de modo online/offline (deprecated no offline).

- `modules/multiplayer.js`
- Entrada/saida do multiplayer, heartbeat e lista de jogadores online.

- `modules/user.js`
- CRUD de usuario em memoria/localStorage e sincronizacao com API.

- `modules/character.js`
- CRUD de personagem em memoria/localStorage e sincronizacao com API.

- `modules/map.js`
- API de mapa no contexto multiplayer global. Metodos de alteracao ficam como no-op/deprecated para manter contrato.

- `modules/session.js`
- Ciclo de sessao de jogo (`startGameSession`, `updateSession`, `endGameSession`, `getCurrentSession`).

- `modules/utility.js`
- Utilitarios (`clearAllData`, `exportData`, `importData`, `getStorageInfo`).

## Composicao

A composicao final acontece em `src/data/DataManagerHybrid.js`:

1. A classe `HybridDataManager` estende `HybridDataManagerCore`.
2. Cada modulo anexa metodos com `attach*Methods(HybridDataManager)`.
3. O singleton exportado continua `dataManager`.

## Como adicionar um novo modulo

1. Crie `src/data/managerHybrid/modules/<nome>.js` com `export function attach<Nome>Methods(HybridDataManagerClass) { ... }`.
2. Importe o `attach` em `src/data/DataManagerHybrid.js`.
3. Execute `attach<Nome>Methods(HybridDataManager)` apos os demais `attach`.
4. Rode `npm run build` para validar imports/exports.
