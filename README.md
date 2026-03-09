# Gayme - Jogo Multiplayer Online 🌍

> **IMPORTANTE:** este jogo é exclusivamente multiplayer.
> Todos os jogadores compartilham o mesmo mapa global.
> Login obrigatório - não há mais modo offline.

[Leia a documentação completa do Multiplayer](MULTIPLAYER.md)

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
npm run full
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

## 🚀 Quick Start

### Opção 1: rodar tudo junto (recomendado)

```bash
npm install
npm run full
```

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

## 🗂️ Estrutura do Projeto (Nova Arquitetura)

```text
Gayme/
├── index.html                     # Entrada HTML do cliente
├── package.json                   # Scripts e dependências
├── webpack.config.js              # Build do frontend
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
    │   └── GameScene.js           # Loop principal e HUD multiplayer
    ├── utils/
    │   └── controls.js            # Controles desktop e mobile
    └── data/
        ├── index.js               # Facade pública da camada de dados
        ├── APIClient.js           # Cliente de API de alto nível
        ├── AuthManager.js         # Sessão/token/autenticação
        ├── DataManager.js         # Manager local/fallback
        ├── DataManagerHybrid.js   # Orquestração cliente + backend
        ├── examples.js            # Exemplos de uso no console
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
        └── manager/
            ├── core/
            │   └── DataManagerCore.js
            └── modules/
                ├── character.js
                ├── map.js
                ├── session.js
                ├── user.js
                └── utility.js
```

## 📱 Teste em Smartphone

1. Local Network:
- Rode `npm run dev`
- Acesse pelo IP da máquina na porta `8080`

2. Com Cloudflare Tunnel (recomendado):

```bash
cloudflared tunnel --url http://localhost:8080
```

3. Para melhor experiência:
- Use modo fullscreen do navegador
- Prefira orientação landscape

## 🧰 Tecnologias

- Phaser 3.55
- Vanilla JavaScript
- Node.js + Express
- JWT + bcryptjs
- Webpack

## 📚 Recursos

- [Documentação Phaser](https://photonstorm.github.io/phaser3-docs/)
- [Exemplos Phaser](https://phaser.io/examples)

---
