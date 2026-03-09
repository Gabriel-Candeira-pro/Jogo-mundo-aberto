# Gayme - Jogo Multiplayer Online 🌍

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Phaser](https://img.shields.io/badge/Phaser-3.55-purple)
![Node](https://img.shields.io/badge/Node-14+-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

> **IMPORTANTE:** este jogo é exclusivamente multiplayer.
> Todos os jogadores compartilham o mesmo mapa global.
> Login obrigatório - não há mais modo offline.

[Leia a documentação completa do Multiplayer](MULTIPLAYER.md)

## 📑 Índice

- [Requisitos](#️-requisitos)
- [Modo Multiplayer](#-modo-multiplayer)
- [Backend Multiplayer](#-backend-multiplayer)
- [Características](#-características)
- [Como Jogar](#-como-jogar)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Quick Start](#-quick-start)
- [Compartilhar Publicamente](#-compartilhar-publicamente)
- [Sistema de Armazenamento](#-sistema-de-armazenamento-de-dados)
- [Arquitetura](#️-arquitetura)
- [Estrutura do Projeto](#️-estrutura-do-projeto-arquitetura-modular)
- [Teste em Smartphone](#-teste-em-smartphone)
- [Troubleshooting](#-troubleshooting)
- [Endpoints da API](#-endpoints-da-api)
- [Tecnologias](#-tecnologias)
- [Recursos](#-recursos)

---

## ⚙️ Requisitos

- Node.js 14+ 
- npm ou yarn
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Porta 3000 livre (backend)
- Porta 8080 livre (frontend)

---

## 🎮 Modo Multiplayer

- Mapa global único
- Login obrigatório
- Jogadores online
- Servidor backend obrigatório

### Quick Start Multiplayer

```bash
# Terminal 1 - Backend (obrigatório)
npm run dev:server

# Terminal 2 - Frontend
npm run dev

# Abra http://localhost:8080
# Crie sua conta e jogue
```

---

## 🌐 Backend Multiplayer

O backend foi organizado para sustentar multiplayer persistente:

- Autenticação com JWT
- Registro e login de usuários
- Persistência de personagem e progresso no servidor
- Mapa global compartilhado entre todos os jogadores
- Controle de jogadores online com heartbeat

Quick start:

```bash
npm install
npm run full  # Roda backend + frontend simultaneamente
```

Para limpar cache e reinstalar:

```bash
./full-clean.sh  # Remove node_modules e reinstala dependências
```

Documentação complementar:
- [QUICKSTART.md](QUICKSTART.md)
- [server/README.md](server/README.md)
- [INSTALACAO_BACKEND.md](INSTALACAO_BACKEND.md)

## ✨ Características

- Responsivo: mobile, tablet e desktop
- Multi-input: teclado e touch
- Auto-scaling com Phaser (FIT)
- Arquitetura modular por camadas
- Build com webpack
- Sistema de dados com persistência no servidor

## 📋 Como Jogar

### Desktop
- Setas esquerda/direita: mover
- Seta para cima ou espaço: pular
- Objetivo: coletar estrelas e evitar inimigos

### Mobile
- Toque no lado esquerdo: mover para esquerda
- Toque no lado direito: mover para direita
- Toque na parte superior: pular
- Objetivo: coletar estrelas e evitar inimigos

## � Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run full` | Verifica/libera automaticamente portas 3000/8080 e roda backend + frontend |
| `npm run dev` | Inicia frontend (webpack dev server) na porta 8080 |
| `npm run dev:server` | Inicia backend em modo desenvolvimento (nodemon) |
| `npm run dev:ngrok` | Expõe o jogo publicamente via ngrok |
| `npm run server` | Inicia backend em modo produção |
| `npm run build` | Gera build de produção do frontend |
| `./full-clean.sh` | Remove node_modules e reinstala dependências |

## �🚀 Quick Start

### Opção 1: rodar tudo junto (recomendado)

```bash
npm install
npm run full
```

`npm run full` executa um pre-check automatico das portas `3000` e `8080`.
Se alguma estiver ocupada, o script encerra o processo em conflito antes de subir o backend/frontend.

### Opção 2: rodar separado (desenvolvimento)

```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev
```

Fluxo obrigatório:
1. Backend ativo em `localhost:3000`
2. Frontend ativo em `localhost:8080`
3. Login/registro na tela inicial
4. Entrada no mapa global

## 🔗 Compartilhar Publicamente

### Recomendado: Cloudflare Tunnel

```bash
# Com frontend ativo em localhost:8080
cloudflared tunnel --url http://localhost:8080
```

### Alternativa: ngrok

```bash
npm run dev:ngrok
```

## 💾 Sistema de Armazenamento de Dados

O armazenamento é orientado a servidor para manter progresso por conta.

### O que é armazenado?

- Personagem: nível, experiência, moedas, atributos
- Usuário: score, estatísticas, conquistas
- Sessão: estado e presença online
- Mapa global: configuração compartilhada

### Funcionalidades

- Auto-save no servidor
- Sincronização entre dispositivos
- Progressão persistente por usuário
- Estatísticas centralizadas

### Modo de Jogo

- Somente multiplayer online
- Login obrigatório
- Backend ativo durante a partida

## 🏗️ Arquitetura

### Camada de Dados (src/data/)

O projeto utiliza uma arquitetura em camadas para gerenciamento de dados:

- **APIClient**: Cliente HTTP para comunicação com o backend
- **AuthManager**: Gerenciamento de sessão e autenticação JWT
- **DataManager**: Gerenciador local com fallback para localStorage
- **DataManagerHybrid**: Orquestrador que combina API + localStorage
- **Models**: Entidades de domínio (Character, User, Map)

### Modularização

Código organizado em módulos focados:
- **Core**: Funcionalidade base e classes principais
- **Modules**: Funcionalidades específicas separadas por responsabilidade
- **Utils**: Utilitários e helpers reutilizáveis

Veja os READMEs em cada diretório para mais detalhes.

## 🗂️ Estrutura do Projeto (Arquitetura Modular)

```text
Gayme/
├── index.html                     # Entrada HTML do cliente
├── package.json                   # Scripts e dependências
├── webpack.config.js              # Build do frontend
├── full-clean.sh                  # Script de limpeza e reinstalação
├── README.md                      # Documentação principal
├── MULTIPLAYER.md                 # Guia do modo multiplayer
├── QUICKSTART.md                  # Setup rápido
├── GUIA_DADOS.md                  # Documentação do sistema de dados
├── INSTALACAO_BACKEND.md          # Instalação/configuração do backend
├── scripts/
│   └── ngrok.js                   # Exposição pública via ngrok
├── server/
│   ├── server.js                  # API REST (auth, mapa global, players)
│   ├── README.md                  # Documentação da API
│   ├── test-api.sh                # Script de teste dos endpoints
│   └── data/
│       ├── users.json             # Usuários registrados
│       ├── active_players.json    # Jogadores online
│       ├── global_map.json        # Mapa global compartilhado
│       ├── character_*.json       # Dados de personagem por usuário
│       └── userdata_*.json        # Dados de progresso por usuário
└── src/
    ├── game.js                    # Bootstrap do Phaser
    ├── config/
    │   └── gameConfig.js          # Configuração de render/escala/física
    ├── scenes/
    │   ├── PreloadScene.js        # Carregamento de assets
    │   ├── LoginScene.js          # Login e registro obrigatórios
    │   ├── GameScene.js           # Loop principal e HUD multiplayer
    │   └── gameScene/             # Módulos do GameScene
    │       ├── README.md
    │       ├── core/
    │       │   └── GameSceneCore.js
    │       └── modules/
    │           ├── data/
    │           │   ├── initialization.js
    │           │   ├── lifecycle.js
    │           │   └── multiplayer.js
    │           ├── input/
    │           │   └── controls.js
    │           ├── map/
    │           │   ├── collision.js
    │           │   └── renderer.js
    │           ├── player/
    │           │   ├── movement.js
    │           │   └── setup.js
    │           └── ui/
    │               ├── hud.js
    │               ├── instructions.js
    │               └── resize.js
    ├── utils/
    │   └── controls.js            # Controles desktop e mobile
    └── data/
        ├── index.js               # Facade pública da camada de dados
        ├── APIClient.js           # Cliente de API de alto nível
        ├── AuthManager.js         # Sessão/token/autenticação
        ├── DataManager.js         # Manager local/fallback
        ├── DataManagerHybrid.js   # Orquestração cliente + backend
        ├── examples.js            # Exemplos de uso no console
        ├── README.md              # Documentação da camada de dados
        ├── models/
        │   ├── Character.js       # Entidade de personagem
        │   ├── User.js            # Entidade de usuário
        │   └── Map.js             # Entidade de mapa
        ├── api/
        │   ├── core/
        │   │   └── APIClientCore.js
        │   └── modules/
        │       ├── auth.js
        │       ├── backup.js
        │       ├── character.js
        │       ├── health.js
        │       ├── map.js
        │       ├── session.js
        │       └── user.js
        ├── manager/
        │   ├── core/
        │   │   └── DataManagerCore.js
        │   └── modules/
        │       ├── character.js
        │       ├── map.js
        │       ├── session.js
        │       ├── user.js
        │       └── utility.js
        └── managerHybrid/
            ├── README.md
            ├── core/
            │   └── HybridDataManagerCore.js
            └── modules/
                ├── character.js
                ├── initialization.js
                ├── map.js
                ├── multiplayer.js
                ├── session.js
                ├── user.js
                └── utility.js
```

## 📱 Teste em Smartphone

### 1. Local Network (mesma rede Wi-Fi)
- Rode `npm run full`
- Descubra o IP da sua máquina: `hostname -I` (Linux) ou `ipconfig` (Windows)
- Acesse pelo IP da máquina na porta `8080` (ex: `http://192.168.1.100:8080`)

### 2. Com Cloudflare Tunnel (recomendado para acesso externo)

```bash
cloudflared tunnel --url http://localhost:8080
```

### 3. Com ngrok (alternativa)

```bash
npm run dev:ngrok
```

### 4. Para melhor experiência
- Use modo fullscreen do navegador
- Prefira orientação landscape
- Limpe o cache se encontrar problemas

## 🔧 Troubleshooting

### Backend não inicia
- Verifique se a porta 3000 está livre: `lsof -i :3000` (Linux/Mac)
- Execute `./full-clean.sh` para reinstalar dependências

### Frontend não conecta ao backend
- Confirme que o backend está rodando em `http://localhost:3000`
- Verifique o console do navegador para erros de CORS
- Confirme que ambos estão na mesma rede (para testes mobile)

### Erros de autenticação
- Limpe o localStorage do navegador
- Crie uma nova conta se necessário
- Verifique os logs do backend no terminal

### Performance ruim em mobile
- Feche outras abas do navegador
- Teste em modo anônimo/privado
- Verifique a conexão de internet

### Túnel do VS Code retorna HTTP 403 (acesso negado)

O erro `HTTP ERROR 403 - Você não tem autorização para ver esta página` em URLs do tipo `*.devtunnels.ms` ocorre porque os **túneis do VS Code são privados por padrão** e exigem autenticação Microsoft/GitHub para acesso.

**Solução 1 — Alterar visibilidade do túnel no VS Code (recomendado):**
1. Abra o painel **Portas** (`Ctrl+Shift+P` → "Focus on Ports View") no VS Code
2. Clique com o botão direito na porta `8080`
3. Selecione **Visibilidade da Porta** → **Pública**
4. Repita para a porta `3000` (backend)

Agora qualquer pessoa pode acessar a URL gerada sem precisar de login.

> Este repositório já inclui `.vscode/settings.json` e `.devcontainer/devcontainer.json` configurados para definir as portas 8080 e 3000 como **públicas automaticamente** ao abrir o projeto no VS Code ou Codespaces.

**Solução 2 — Usar Cloudflare Tunnel (alternativa sem autenticação):**
```bash
cloudflared tunnel --url http://localhost:8080
```

**Solução 3 — Usar ngrok (alternativa):**
```bash
npm run dev:ngrok
```

## 📡 Endpoints da API

Para mais detalhes, consulte [server/README.md](server/README.md) ou execute:

```bash
./server/test-api.sh  # Testa todos os endpoints
```

Principais endpoints:
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/user/:userId` - Dados do usuário
- `GET /api/character/:userId` - Dados do personagem
- `GET /api/map/global` - Mapa global
- `POST /api/session/heartbeat` - Manter sessão ativa

## 🧰 Tecnologias

### Frontend
- Phaser 3.55 - Engine de jogos HTML5
- Vanilla JavaScript (ES6+)
- Webpack 5 - Bundler e dev server

### Backend
- Node.js + Express - API REST
- JWT (jsonwebtoken) - Autenticação
- bcryptjs - Criptografia de senhas
- CORS - Comunicação cross-origin

### Desenvolvimento
- Webpack Dev Server - Hot reload
- Nodemon - Auto-restart do backend
- Concurrently - Rodar múltiplos processos
- ngrok - Túnel público para testes

## 📚 Recursos

- [Documentação Phaser](https://photonstorm.github.io/phaser3-docs/)
- [Exemplos Phaser](https://phaser.io/examples)
- [Express.js Guide](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/introduction)

## 📝 Documentação Adicional

- [MULTIPLAYER.md](MULTIPLAYER.md) - Guia completo do modo multiplayer
- [QUICKSTART.md](QUICKSTART.md) - Início rápido passo a passo
- [GUIA_DADOS.md](GUIA_DADOS.md) - Sistema de gerenciamento de dados
- [INSTALACAO_BACKEND.md](INSTALACAO_BACKEND.md) - Configuração detalhada do backend
- [server/README.md](server/README.md) - Documentação da API REST
- [src/data/README.md](src/data/README.md) - Camada de dados do frontend

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ usando Phaser 3**

---
