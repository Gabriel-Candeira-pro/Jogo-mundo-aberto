# 📊 Estrutura do Projeto - Visão Geral

## Organização Atual

```
Gayme/  (Monorepo)
│
├── 📁 web/                          # Projeto Web (Phaser.js)
│   ├── src/                         # Código Phaser
│   │   ├── game.js                 # Entry point
│   │   ├── scenes/                 # Cenas do jogo
│   │   ├── data/                   # DataManager, API
│   │   ├── config/                 # Configurações
│   │   └── utils/                  # Utilitários
│   ├── index.html                  # HTML principal
│   ├── webpack.config.js           # Build config
│   └── package.json                # Deps web
│
├── 📱 mobile/                       # Projeto Mobile (React Native + Expo)
│   ├── src/
│   │   ├── App.js                  # Entry point mobile
│   │   ├── screens/                # Telas
│   │   │   ├── LoginScreen.js     # Tela de login
│   │   │   └── GameScreen.js      # Tela do jogo
│   │   ├── components/             # Componentes UI
│   │   │   ├── GameCanvas.js      # Renderização (Skia)
│   │   │   ├── GameControls.js    # Controles touch
│   │   │   └── GameHUD.js         # Interface
│   │   ├── services/               # Lógica de negócio
│   │   │   ├── APIService.js      # Client HTTP
│   │   │   ├── AuthService.js     # Autenticação
│   │   │   └── GameService.js     # Lógica do jogo
│   │   └── config/                 # Configurações
│   │       └── config.js          # URLs, constantes
│   ├── assets/                     # Imagens, ícones
│   ├── app.json                    # Config Expo
│   ├── eas.json                    # Config build
│   ├── babel.config.js             # Config Babel
│   ├── index.js                    # Expo entry
│   └── package.json                # Deps mobile
│
├── 🖥️  server/                      # Backend Compartilhado (Node.js + Express)
│   ├── src/services/chunkGenerator/ # Geração procedural de chunks
│   ├── server.js                   # Servidor principal
│   ├── data/                       # Banco de dados JSON
│   │   ├── users/                 # Dados por usuário
│   │   │   ├── index.json         # Usuários
│   │   │   └── [userId]/          # Arquivos individuais
│   │   └── map/
│   │       ├── active_players.json # Jogadores online
│   │       ├── global_map.json     # Legado (fallback/migração)
│   │       └── global_map/         # Mapa global modularizado
│   │           ├── meta.json
│   │           ├── world.json
│   │           ├── entities.json
│   │           └── layout.json
│   └── README.md                   # Docs backend
│
├── 🔧 scripts/                      # Scripts auxiliares
│   ├── ensure-ports-free.js        # Verifica portas
│   └── ngrok.js                    # Túnel ngrok
│
├── 📄 Documentação
│   ├── README_MONOREPO.md          # ⭐ Doc principal
│   ├── QUICKSTART_MOBILE.md        # Guia mobile
│   ├── README.md                   # Doc original web
│   ├── MULTIPLAYER.md              # Doc multiplayer
│   └── GUIA_DADOS.md               # Guia de dados

## Novidades: Mundo Procedural por Chunks

- O mundo agora é dividido em chunks procedurais, gerados sob demanda.
- O backend expõe o endpoint `/api/map/chunk?x=&y=` para geração e persistência de chunks.
- O frontend mantém um cache de 3x3 chunks ao redor do player.
│
├── package.json                     # Root (workspaces)
├── install.sh                       # Script instalação
├── full-clean.sh                    # Limpeza
└── .gitignore                       # Git ignore
```

## Fluxo de Dados

### Web (Phaser)
```
Browser → Webpack Dev Server :8080 → Phaser Game
                ↓
        Backend API :3000 → server/data/*.json
```

### Mobile (React Native)
```
Expo Go → Metro Bundler → React Native App
                ↓
        Backend API :3000 → server/data/*.json
```

### Sincronização
```
Web Player ──┐
             ├── Backend (server.js) ── map/global_map/*.json
Mobile Player┘
```

## Código Compartilhado

### Conceitos Reutilizados
- ✅ **Autenticação:** Mesmo fluxo JWT
- ✅ **API:** Mesmos endpoints
- ✅ **Lógica de jogo:** Colisão, movimento
- ✅ **Modelos de dados:** Character, Map, User

### Implementações Diferentes
- 🎨 **Renderização:** Phaser (web) vs Skia (mobile)
- 🎮 **Input:** Teclado (web) vs Touch (mobile)
- 💾 **Storage:** localStorage (web) vs AsyncStorage (mobile)

## Scripts Principais

### Root
```bash
npm run server         # Iniciar backend
npm run web:dev        # Iniciar web
npm run mobile:start   # Iniciar mobile
npm run full           # Backend + Web
./install.sh           # Instalar tudo
```

### Web
```bash
npm run dev            # Dev server
npm run build          # Build produção
```

### Mobile
```bash
npm start              # Expo
npm run android        # Android direto
npm run build:apk      # Gerar APK
```

## Endpoints da API (Compartilhados)

| Endpoint | Método | Web | Mobile |
|----------|--------|-----|--------|
| `/api/auth/login` | POST | ✅ | ✅ |
| `/api/auth/register` | POST | ✅ | ✅ |
| `/api/character/:id` | GET | ✅ | ✅ |
| `/api/character/position` | PUT | ✅ | ✅ |
| `/api/map` | GET | ✅ | ✅ |
| `/api/players/active` | GET | ✅ | ✅ |

## Portas Utilizadas

- **3000:** Backend Node.js
- **8080:** Web Dev Server (Webpack)
- **8081:** Metro Bundler (React Native)
- **19000-19001:** Expo DevTools

## Dependências Principais

### Web
- Phaser 3.55
- Webpack 5
- Express (proxy)

### Mobile
- Expo 50
- React Native 0.73
- Skia (canvas)
- Axios (HTTP)

### Backend
- Express 4
- JWT
- Bcrypt
- CORS

## Próximas Melhorias

### Performance
- [ ] WebSocket para real-time
- [ ] Cache de assets mobile
- [ ] Lazy loading de componentes

### Features
- [ ] Chat multiplayer
- [ ] Sistema de inventário
- [ ] Mais mapas
- [ ] NPCs

### DevOps
- [ ] CI/CD (GitHub Actions)
- [ ] Docker containers
- [ ] Deploy automatizado
- [ ] Testes E2E

---

**Criado:** Março 2026  
**Versão:** 2.0.0  
**Licença:** MIT
