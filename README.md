# Gayme - Jogo Multiplayer Online 🌍

> **IMPORTANTE:** Este jogo agora é **EXCLUSIVAMENTE MULTIPLAYER**!  
> Todos os jogadores compartilham o mesmo mapa global.  
> Login obrigatório - Não há mais modo offline.

📖 **[Leia a documentação completa do Multiplayer](MULTIPLAYER.md)**

---

## 🎮 MODO MULTIPLAYER

- ✅ **Mapa Global Único** - Todos os jogadores no mesmo mapa
- ✅ **Login Obrigatório** - Crie uma conta para jogar
- ✅ **Jogadores Online** - Veja quantos estão jogando
- ✅ **Servidor Obrigatório** - Backend deve estar rodando

### 🚀 Quick Start Multiplayer

```bash
# Terminal 1 - Servidor Backend (OBRIGATÓRIO)
npm run dev:server

# Terminal 2 - Cliente do Jogo
npm run dev

# Abra http://localhost:8080
# Crie uma conta e comece a jogar!
```

---

Um jogo 2D criado com Phaser que funciona perfeitamente em **mobile** e **desktop**.

## � NOVO: Backend com Armazenamento em Servidor! 🌐

O jogo agora possui um **sistema completo de backend** que permite:

- 🔐 **Login e Registro** de usuários
- ☁️ **Sincronização em nuvem** - Jogue em qualquer dispositivo
- 💾 **Auto-save em servidor** - Nunca perca seu progresso
- 🌍 **Modo Híbrido** - Funciona offline e online
- 📊 **API REST completa** com autenticação JWT

**🚀 Quick Start com Backend:**
```bash
npm install
npm run full
# Abra http://localhost:8080 → Login/Registro
```

📖 **Documentação:** [QUICKSTART.md](QUICKSTART.md) | [server/README.md](server/README.md) | [INSTALACAO_BACKEND.md](INSTALACAO_BACKEND.md)

---

## �🎮 Características

- ✅ **Responsivo**: Funciona em qualquer tamanho de tela (mobile, tablet, desktop)
- ✅ **Multi-input**: Suporte a teclado (desktop) e touch (mobile)
- ✅ **Auto-scaling**: Jogo se adapta automaticamente ao redimensionar a janela (escala FIT)
- ✅ **Arquitetura modular**: Cenas e configurações organizadas em arquivos separados
- ✅ **Otimizado**: Phaser 3.55 com webpack para melhor performance
- ✅ **Pronto para jogar**: Exemplo completo de jogo jogável
- ✅ **Sistema de dados**: Armazenamento de personagem, usuário e mapas com auto-save
- ✅ **Progressão**: Sistema de XP, níveis e conquistas
- ✅ **Customização**: Personalize personagens, mapas e dificuldade via código

## 📋 Como Jogar

### Desktop
- **Setas ← →**: Mover para os lados
- **Seta ↑ ou Espaço**: Pular
- **Objetivo**: Coletar todas as estrelas e evitar os inimigos vermelhos

### Mobile
- **Toque lado esquerdo**: Mover para a esquerda
- **Toque lado direito**: Mover para a direita
- **Toque no topo**: Pular
- **Objetivo**: Coletar todas as estrelas e evitar os inimigos vermelhos

## 🚀 Quick Start

### Opção 1: Executar diretamente (Recomendado)

```bash
# Abrir no navegador
open index.html
```

Ou coloque o arquivo em um servidor HTTP local:

```bash
# Python 3
python -m http.server 8000

# Ou com Node.js (requer http-server)
npx http-server
```

Depois acesse: http://localhost:8000

### Opção 2: Com webpack (para desenvolvimento avançado)

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Buildar para produção
npm run build
```

### Opção 3: Com Backend (Modo Online) 🌐

Para habilitar jogabilidade online com armazenamento em servidor:

```bash
# Instalar dependências
npm install

# Opção 1: Rodar servidor + frontend juntos
npm run full

# Opção 2: Rodar separadamente
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run dev
```

**O que você ganha com o modo online:**
- 🔄 **Sincronização entre dispositivos**: Jogue no PC, continue no celular
- 💾 **Backup em servidor**: Seus dados nunca se perdem
- 🏆 **Ranking global**: Compare com outros jogadores (futuro)
- 👥 **Multiplayer**: Base para funcionalidades multiplayer (futuro)
- 📊 **Estatísticas centralizadas**: Acesse de qualquer lugar

**Como usar:**
1. Inicie o servidor backend (porta 3000)
2. Inicie o frontend (porta 8080)
3. No jogo, faça login/registro na tela inicial
4. Seus dados serão automaticamente sincronizados!

**📖 Documentação completa do backend:**
- Veja [server/README.md](server/README.md) para API completa
- Endpoints REST documentados
- Autenticação JWT
- Deploy para produção

## 🌐 Compartilhar Publicamente com ngrok

Para acessar seu jogo de qualquer lugar usando ngrok (recomendado para teste remoto):

### Pré-requisitos
- Ter uma conta no [ngrok](https://ngrok.com) (gratuita)
- ngrok instalado e autenticado: `ngrok authtoken SEU_TOKEN`
- As dependências do projeto instaladas: `npm install`

### Executar com ngrok

```bash
# Método 1: Usar o script automático (recomendado)
npm run dev:ngrok

# Método 2: Executar manualmente
node scripts/ngrok.js
```

**O que acontece automaticamente:**
1. ✅ Compila o webpack em modo desenvolvimento
2. ✅ Inicia servidor de desenvolvimento na porta 8080
3. ✅ Cria um túnel ngrok automático
4. ✅ Exibe a URL pública (ex: `https://abc123def456.ngrok.io`)
5. ✅ Monitora alterações e recarrega automáticamente

**Como usar:**
- Compartilhe a URL pública com qualquer pessoa
- Qualquer pessoa pode jogar sem instalar nada
- A URL muda a cada novo comando (exceto com plano pago ngrok)

**Dica de ouro**: Manter o terminal aberto enquanto estiver desenvolvendo permite que outras pessoas vejam as mudanças em tempo real!

## � Sistema de Armazenamento de Dados

O jogo agora possui um **sistema completo de armazenamento de dados** que salva automaticamente no navegador:

### 📦 O que é armazenado?

- **👤 Personagem**: Atributos, nível, experiência, moedas, velocidade, poder de pulo
- **👥 Usuário**: Pontuação, estatísticas, conquistas, configurações
- **🗺️ Mapas**: Configurações de níveis, plataformas, inimigos, estrelas

### ✨ Funcionalidades

- 🔄 **Auto-save**: Dados salvos automaticamente após cada partida
- 📊 **Estatísticas**: Rastreamento completo de desempenho
- 🎯 **Conquistas**: Sistema de achievements baseado em marcos
- 🎨 **Customização**: Personalize personagem, mapas e dificuldade
- 💪 **Progressão**: Sistema de XP e level up para personagem
- 📈 **Histórico**: Mantenha registro de todas as partidas
- 🌐 **Modo Híbrido**: Funciona offline (localStorage) e online (servidor)
- ☁️ **Sincronização**: Dados sincronizados automaticamente entre dispositivos (modo online)

### 🎮 Modos de Jogo

#### Modo Offline (Padrão)
- Dados salvos no navegador (localStorage)
- Funciona sem internet
- Não requer registro
- Dados específicos do dispositivo/navegador

#### Modo Online (Opcional)
- Dados salvos em servidor
- Sincroniza entre dispositivos
- Requer login/registro
- Acesse de qualquer lugar
- Backup automático em servidor

**Como ativar modo online:**
1. Inicie o servidor: `npm run server`
2. Na tela inicial do jogo, clique em "Login/Registro"
3. Crie uma conta ou faça login
4. Pronto! Seus dados serão sincronizados automaticamente

### 🛠️ Como Usar

**No Console do Navegador (F12):**

```javascript
// Ver informações atuais
dataManager.getCharacter();  // Ver personagem
dataManager.getUser();        // Ver usuário
dataManager.getMap();         // Ver mapa atual

// Customizar personagem
dataManager.updateCharacter({
    name: 'Super Herói',
    speed: 250,
    jumpPower: 400,
    color: 0xFF0000  // Vermelho
});

// Ver estatísticas
const user = dataManager.getUser();
console.log('High Score:', user.highScore);
console.log('Partidas:', user.gamesPlayed);
console.log('Taxa de Vitória:', user.getWinRate() + '%');

// Criar mapa customizado
const novoMapa = dataManager.createCustomMap({
    name: 'Meu Nível',
    difficulty: 'hard',
    enemies: [/* ... */],
    platforms: [/* ... */]
});
dataManager.setCurrentMap(novoMapa);

// Fazer backup
const backup = dataManager.exportData();
console.log(JSON.stringify(backup));

// Limpar dados
dataManager.clearAllData();
```

**📖 Documentação Completa:**
- Veja [GUIA_DADOS.md](GUIA_DADOS.md) para documentação detalhada
- Exemplos prontos em [src/data/examples.js](src/data/examples.js)

### 🎮 Dados Visíveis no Jogo

Durante o jogo, você verá:
- Nome e nível do personagem
- Nome de usuário e high score
- Nome do mapa atual
- Estatísticas ao finalizar (tempo, pulos, estrelas)
- Experiência ganha após cada partida

## 🗂️ Estrutura do Projeto (Nova Arquitetura)

```
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
│   └── ngrok.js                   # Exposição pública local via ngrok
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
        ├── DataManager.js         # Fallback/local manager
        ├── DataManagerHybrid.js   # Orquestração cliente + backend
        ├── examples.js            # Exemplos de uso no console
        ├── models/
        │   ├── Character.js       # Entidade de personagem
        │   ├── User.js            # Entidade de usuário
        │   └── Map.js             # Entidade de mapa
        ├── api/
        │   ├── core/
        │   │   └── APIClientCore.js  # HTTP core (fetch, headers, erros)
        │   └── modules/
        │       ├── auth.js        # Endpoints de autenticação
        │       ├── backup.js      # Backup/restore
        │       ├── character.js   # Endpoints de personagem
        │       ├── health.js      # Health check
        │       ├── map.js         # Endpoints de mapa global/multiplayer
        │       ├── session.js     # Sessão/heartbeat
        │       └── user.js        # Endpoints de usuário
        └── manager/
            ├── core/
            │   └── DataManagerCore.js # Núcleo do gerenciador
            └── modules/
                ├── character.js   # Regras de personagem
                ├── map.js         # Regras de mapa
                ├── session.js     # Regras de sessão
                ├── user.js        # Regras de usuário
                └── utility.js     # Utilitários compartilhados
```

## 🔧 Customizações

### Mudar tamanho da tela
Edite a configuração em [src/config/gameConfig.js](src/config/gameConfig.js):
```javascript
scale: {
    width: 800,         // Largura padrão
    height: 600,        // Altura padrão
    min: { width: 320, height: 240 },  // Tamanho mínimo
    max: { width: 1920, height: 1440 } // Tamanho máximo
}
```

### Ajustar dificuldade
Edite [src/scenes/GameScene.js](src/scenes/GameScene.js):
- Altere `gravity: { y: 300 }` para mudar a gravidade
- Mude `velocidade dos inimigos` (propriedade `speed`)
- Ajuste `velocidade do jogador` (propriedade `Velocity`)

### Adicionar mais sprites
Veja [src/scenes/PreloadScene.js](src/scenes/PreloadScene.js) para ver como criar gráficos dinâmicos.

### Acessar controles
Personalize os controles em [src/utils/controls.js](src/utils/controls.js)

## 📱 Teste em Smartphone

1. **Local Network**: 
   - Coloque o arquivo em um servidor HTTP
   - Acesse pelo IP da sua máquina (ex: http://192.168.1.X:8000)

2. **Com Cloudflare Tunnel** (Recomendado):
   ```bash
   # Instale cloudflare tunnel
   curl -L --output cloudflared.tgz https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.tgz
   tar xzf cloudflared.tgz
   
   # Crie um tunnel
   ./cloudflared tunnel --url http://localhost:8000
   ```

3. **Modo Fullscreen em Mobile**:
   - Pressione F11 ou o botão de fullscreen do navegador
   - Melhor experiência com a tela em modo landscape

## 🎨 Tecnologias

- **Phaser 3.55**: Framework de jogos JavaScript
- **Vanilla JavaScript**: Sem dependências desnecessárias
- **Responsive Web Design**: CSS moderno para adaptabilidade

## 📚 Recursos

- [Documentação Phaser](https://photonstorm.github.io/phaser3-docs/)
- [Exemplos Phaser](https://phaser.io/examples)
- [Community Phaser](https://www.html5gamedevs.com/)

## 📝 Novidades nesta Atualização

### ✨ Principais Melhorias
- 🏗️ **Refatoração modular**: Código organizado em cenas e configurações separadas
- ⚡ **Webpack integrado**: Build otimizado para produção e desenvolvimento
- 📱 **Responsividade melhorada**: Escala FIT com suporte completo a múltiplas resoluções
- 🎮 **Toque otimizado**: Controles touch refinados para melhor experiência mobile
- 🚀 **ngrok automático**: Script para compartilhar o jogo facilmente
- 💾 **Sistema de dados completo**: Armazenamento de personagem, usuário e mapas
- 📊 **Estatísticas e conquistas**: Sistema de tracking e progressão
- 🎨 **Customização total**: Personalize personagens, mapas e dificuldade
- 🔄 **Auto-save**: Progresso salvo automaticamente no navegador
- 📦 **Organização clara**: Estrutura escalável para adicionar novas features

### 🎯 Próximos Passos

Para expandir o jogo, considere adicionar:
- Novos níveis com dificuldade progressiva
- Sistema de sons e música de fundo
- Particle effects para efeitos visuais
- Animações mais complexas
- Sistema de salas/levels (world/room)
- Leaderboard local com localStorage
- Sistema de power-ups
- Inimigos com IA mais sofisticada

---
