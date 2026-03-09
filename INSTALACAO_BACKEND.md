# Guia de Instalação - Backend

## 🚀 Instalação Rápida

### 1. Instalar Dependências

```bash
cd /caminho/para/Gayme
npm install
```

Isso instalará automaticamente todas as dependências necessárias:
- **Frontend**: phaser, webpack, etc.
- **Backend**: express, cors, jsonwebtoken, bcryptjs

### 2. Executar

**Opção 1: Servidor + Frontend Juntos (Recomendado)**
```bash
npm run full
```

**Opção 2: Separado**
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
npm run dev
```

### 3. Acessar

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000

## 📦 Dependências Instaladas

### Produção
- `phaser` - Game engine
- `express` - Servidor web
- `cors` - CORS middleware
- `jsonwebtoken` - Autenticação JWT
- `bcryptjs` - Hash de senhas

### Desenvolvimento
- `webpack` + `webpack-cli` + `webpack-dev-server` - Bundler
- `nodemon` - Auto-reload do servidor
- `concurrently` - Rodar múltiplos comandos
- `ngrok` - Túnel público

## 🔧 Comandos Disponíveis

```bash
# Frontend apenas
npm run dev              # Desenvolvimento com webpack
npm run build            # Build de produção
npm run dev:ngrok        # Dev com túnel ngrok

# Backend apenas
npm run server           # Servidor backend
npm run server:dev       # Backend com auto-reload

# Ambos
npm run full             # Frontend + Backend juntos
```

## ⚠️ Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "Port 3000 already in use"
```bash
# Linux/Mac
lsof -i :3000
kill -9 PID

# Windows
netstat -ano | findstr :3000
taskkill /PID PID /F

# Ou mude a porta
PORT=4000 npm run server
```

### "ENOENT: no such file or directory"
Certifique-se de estar no diretório correto:
```bash
cd /caminho/para/Gayme
pwd  # Deve mostrar .../Gayme
```

## 🌐 Primeira Execução

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o sistema:**
   ```bash
   npm run full
   ```

3. **Abra o navegador:**
   - O webpack deve abrir automaticamente
   - Se não abrir: http://localhost:8080

4. **Na tela inicial:**
   - Clique em "Jogar Offline" para jogar sem servidor
   - OU clique em "Login/Registro" para modo online

5. **Para modo online:**
   - Registre uma conta (username + senha)
   - Seus dados serão salvos no servidor!

## 📁 Estrutura de Arquivos

```
Gayme/
├── server/
│   ├── server.js           # Código do servidor
│   ├── data/               # Dados salvos (criado automaticamente)
│   ├── .env.example        # Exemplo de configuração
│   └── README.md           # Docs da API
├── src/
│   ├── data/
│   │   ├── APIClient.js    # Cliente HTTP
│   │   ├── AuthManager.js  # Gerenciador de auth
│   │   └── DataManagerHybrid.js  # Manager híbrido
│   └── scenes/
│       └── LoginScene.js   # Tela de login
├── package.json
└── README.md
```

## 🎮 Testando

### Teste Offline
```bash
npm run dev
# Clique em "Jogar Offline"
```

### Teste Online
```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev

# No jogo: Login/Registro → Crie conta → Jogue
```

## 🔐 Segurança

Para produção:
1. **Mude JWT_SECRET** em `.env`
2. **Use HTTPS**
3. **Use banco de dados real** (MongoDB, PostgreSQL)
4. **Adicione rate limiting**
5. **Valide todos os inputs**

## 💡 Dicas

- **Desenvolvimento**: Use `npm run full` para ter tudo rodando
- **Debugging**: Abra DevTools (F12) para ver logs
- **API Testing**: Use Postman ou cURL para testar endpoints
- **Dados**: Veja `server/data/` para arquivos JSON salvos
