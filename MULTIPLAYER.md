# 🌍 MODO MULTIPLAYER - Gayme

## Visão Geral

O Gayme agora é **exclusivamente multiplayer online**. Todos os jogadores compartilham o mesmo mapa global e jogam juntos no mesmo ambiente.

## 🎮 Principais Mudanças

### ✅ Agora é MULTIPLAYER
- **Mapa Global Único**: Todos os jogadores jogam no mesmo mapa compartilhado
- **Login Obrigatório**: Não há mais modo offline - é necessário criar uma conta
- **Jogadores Online**: Veja quantos jogadores estão online em tempo real
- **Dados Sincronizados**: Seu progresso é salvo no servidor

### ❌ Removido
- ❌ Modo Offline
- ❌ Mapas individuais por jogador
- ❌ Opção "Jogar como convidado"
- ❌ Armazenamento local exclusivo

## 🚀 Como Jogar

### 1. Iniciar o Servidor Backend

O servidor é **obrigatório** para jogar. Execute:

```bash
npm run dev:server
```

O servidor iniciará em `http://localhost:3000`

### 2. Iniciar o Jogo

```bash
npm run dev
```

O jogo abrirá em `http://localhost:8080`

### 3. Criar Conta / Login

1. Na tela inicial, clique em **"LOGIN / REGISTRO"**
2. Digite um nome de usuário e senha
3. Clique em **"CRIAR CONTA"** (primeira vez) ou **"ENTRAR"** (usuários existentes)
4. Após o login, clique em **"JOGAR"**

## 📡 Arquitetura Multiplayer

### Backend (Server)

**Novo arquivo: `server/server.js`**

Novos endpoints criados:

```javascript
// Mapa Global
GET  /api/map/global          // Carrega mapa compartilhado
POST /api/map/global          // Atualiza mapa (admin)

// Gerenciamento de Jogadores
GET  /api/players/online      // Lista jogadores ativos
POST /api/players/join        // Registra entrada no mapa
POST /api/players/leave       // Registra saída do mapa
POST /api/players/heartbeat   // Mantém jogador ativo
```

**Dados armazenados:**
- `global_map.json` - Mapa único compartilhado
- `active_players.json` - Lista de jogadores online
- `character_[userId].json` - Personagem de cada jogador
- `userdata_[userId].json` - Dados de cada jogador

### Frontend (Client)

**Modificações principais:**

1. **`src/data/DataManagerHybrid.js`**
   - Modo online obrigatório
   - Carrega mapa global ao invés de mapa individual
   - Sistema de heartbeat para manter jogador ativo
   - Métodos de multiplayer: `joinMultiplayer()`, `leaveMultiplayer()`

2. **`src/scenes/LoginScene.js`**
   - Login obrigatório
   - Removidas opções de modo offline
   - Interface atualizada para multiplayer

3. **`src/scenes/GameScene.js`**
   - Carrega mapa global compartilhado
   - Mostra contador de jogadores online
   - Indicações visuais de modo multiplayer

4. **`src/data/api/modules/map.js`**
   - Novos métodos para API de mapa global
   - `loadGlobalMap()`, `saveGlobalMap()`
   - `joinMultiplayer()`, `leaveMultiplayer()`, `getOnlinePlayers()`

## 🗺️ Mapa Global

### Configuração Padrão

O mapa global é criado automaticamente na primeira execução:

```javascript
{
  id: 'global_map_1',
  name: 'Arena Multiplayer',
  level: 1,
  difficulty: 1,
  platforms: [
    { x: 400, y: 568, scaleX: 2, scaleY: 1 },
    { x: 600, y: 400 },
    { x: 50, y: 250 },
    { x: 750, y: 220 }
  ],
  playerSpawn: { x: 100, y: 450 },
  stars: {
    count: 12,
    startX: 12,
    startY: 0,
    stepX: 70,
    bounceY: { min: 0.4, max: 0.8 },
    velocity: { minX: -50, maxX: 50, y: 20 }
  }
}
```

### Modificando o Mapa Global

Para alterar o mapa global, edite diretamente `server/data/global_map.json` ou use a API:

```javascript
POST /api/map/global
{
  "name": "Novo Mapa",
  "platforms": [...],
  // ... outras configurações
}
```

## 👥 Sistema de Jogadores Online

### Heartbeat
- Jogadores enviam heartbeat a cada 30 segundos
- Jogadores inativos por mais de 5 minutos são removidos automaticamente

### Visualização
- Contador de jogadores online na tela do jogo
- Lista de jogadores disponível via API

## 🔧 Comandos NPM

```bash
# Desenvolvimento
npm run dev              # Inicia webpack dev server
npm run dev:server       # Inicia backend
npm run dev:ngrok        # Inicia com túnel ngrok

# Produção
npm run build            # Build para produção
npm start                # Inicia servidor de produção
```

## 📝 Notas Importantes

### ⚠️ Requisitos
- Node.js instalado
- Servidor backend rodando em `localhost:3000`
- Conexão de internet (para registro/login)

### 🔐 Segurança
- Senhas são hasheadas com bcrypt
- Tokens JWT para autenticação
- Sessões expiram em 7 dias

### 💾 Dados dos Jogadores
- Cada jogador mantém seus próprios dados (score, personagem, estatísticas)
- O mapa é compartilhado e não é modificado por ações individuais
- Vitórias e scores são salvos individualmente

## 🎯 Próximas Funcionalidades

Possíveis melhorias futuras:

- [ ] Ver outros jogadores em tempo real no mapa
- [ ] Chat entre jogadores
- [ ] Rankings globais
- [ ] Eventos multiplayer
- [ ] Salas/arenas separadas
- [ ] WebSockets para sincronização em tempo real

## 🐛 Troubleshooting

### Erro: "Login obrigatório para jogar"
**Solução:** Certifique-se de que o servidor backend está rodando em `localhost:3000`

### Erro: "Erro de conexão! Verifique se o servidor está rodando"
**Solução:**
```bash
npm run dev:server  # Em um terminal separado
```

### Jogadores não aparecem como online
**Solução:** O sistema de heartbeat pode levar até 30 segundos para atualizar. Aguarde ou recarregue a página.

## 📚 Arquivos Modificados

```
server/
  └── server.js .......................... ✅ Endpoints de mapa global e players

src/
  ├── data/
  │   ├── DataManagerHybrid.js ........... ✅ Modo multiplayer obrigatório
  │   └── api/modules/
  │       └── map.js ..................... ✅ Novos métodos de API
  └── scenes/
      ├── LoginScene.js .................. ✅ Login obrigatório
      └── GameScene.js ................... ✅ Indicadores multiplayer
```

## 📄 Licença

MIT - Mesma licença do projeto original

---

**Desenvolvido para Gayme v2.0.0 - Modo Multiplayer** 🎮🌍
