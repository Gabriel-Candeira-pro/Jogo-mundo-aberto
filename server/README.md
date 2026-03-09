# Backend API - Gayme

Sistema de backend para armazenamento de dados em servidor com autenticação.

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar o Servidor

```bash
# Modo normal
npm run server

# Modo desenvolvimento (auto-reload)
npm run server:dev

# Servidor + Frontend juntos
npm run full
```

O servidor estará disponível em: **http://localhost:3000**

## 📡 API Endpoints

### Autenticação

#### POST /api/auth/register
Registra novo usuário

**Body:**
```json
{
  "username": "meuUsuario",
  "password": "minhaSenha",
  "email": "email@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "user_1234567890_abc123",
  "username": "meuUsuario"
}
```

#### POST /api/auth/login
Faz login

**Body:**
```json
{
  "username": "meuUsuario",
  "password": "minhaSenha"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "user_1234567890_abc123",
  "username": "meuUsuario"
}
```

#### GET /api/auth/verify
Verifica se o token é válido

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response:**
```json
{
  "success": true,
  "userId": "user_1234567890_abc123"
}
```

### Personagem

#### GET /api/character
Carrega personagem do servidor

**Headers:** `Authorization: Bearer TOKEN`

#### POST /api/character
Salva personagem no servidor

**Headers:** `Authorization: Bearer TOKEN`

**Body:**
```json
{
  "id": "char_123",
  "name": "Herói",
  "level": 5,
  "speed": 200,
  "jumpPower": 350,
  ...
}
```

### Usuário

#### GET /api/user
Carrega dados do usuário

**Headers:** `Authorization: Bearer TOKEN`

#### POST /api/user
Salva dados do usuário

**Headers:** `Authorization: Bearer TOKEN`

### Mapas

#### GET /api/map/current
Carrega mapa atual

**Headers:** `Authorization: Bearer TOKEN`

#### POST /api/map/current
Salva mapa atual

**Headers:** `Authorization: Bearer TOKEN`

#### GET /api/maps
Carrega lista de todos os mapas

**Headers:** `Authorization: Bearer TOKEN`

#### POST /api/maps
Salva lista de mapas

**Headers:** `Authorization: Bearer TOKEN`

### Sessão

#### GET /api/session
Carrega sessão atual

**Headers:** `Authorization: Bearer TOKEN`

#### POST /api/session
Salva sessão

**Headers:** `Authorization: Bearer TOKEN`

### Backup/Restore

#### GET /api/export
Exporta todos os dados

**Headers:** `Authorization: Bearer TOKEN`

#### POST /api/import
Importa dados

**Headers:** `Authorization: Bearer TOKEN`

**Body:**
```json
{
  "data": {
    "character": {...},
    "user": {...},
    "map": {...},
    "maps": [...]
  }
}
```

## 🔐 Autenticação

O servidor usa JWT (JSON Web Tokens) para autenticação.

1. Faça login ou registre-se para receber um token
2. Inclua o token no header de todas as requisições protegidas:
   ```
   Authorization: Bearer SEU_TOKEN_AQUI
   ```
3. Tokens expiram em 7 dias

## 💾 Armazenamento

Os dados são armazenados em arquivos JSON no diretório `server/data/`:

```
server/data/
├── users.json                    # Lista de usuários
├── character_[userId].json       # Personagem do usuário
├── userdata_[userId].json        # Dados do usuário
├── map_current_[userId].json     # Mapa atual
├── maps_[userId].json            # Lista de mapas
└── session_[userId].json         # Sessão atual
```

## 🛠️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório `server/`:

```env
PORT=3000
JWT_SECRET=sua-chave-secreta-aqui
```

### Alterar Porta

```bash
PORT=4000 npm run server
```

## 🧪 Testar API

### Com cURL

```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"123456"}'

# Salvar personagem (substitua TOKEN)
curl -X POST http://localhost:3000/api/character \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Herói","level":1}'
```

### Com Postman/Insomnia

1. Importe a coleção de endpoints
2. Configure a variável `baseUrl` como `http://localhost:3000`
3. Faça login para obter o token
4. Use o token nas requisições protegidas

## 🌐 Deploy

### Usando Railway

1. Crie conta em [Railway](https://railway.app)
2. Conecte seu repositório
3. Configure variáveis de ambiente
4. Deploy automático!

### Usando Heroku

```bash
heroku create gayme-api
git push heroku main
heroku config:set JWT_SECRET=sua-chave-secreta
```

### Usando Vercel (Serverless)

```bash
vercel
```

## 🔒 Segurança

⚠️ **IMPORTANTE para produção:**

1. **Mude o JWT_SECRET**: Use uma chave forte e aleatória
2. **Use HTTPS**: Sempre use HTTPS em produção
3. **Rate Limiting**: Implemente limitação de taxa
4. **Validação**: Valide todos os inputs
5. **Backup**: Faça backup regular do diretório `data/`

## 📊 Monitoramento

O servidor loga todas as requisições:

```
[2026-03-09T15:30:45.123Z] POST /api/auth/login
[2026-03-09T15:30:46.456Z] GET /api/character
```

## 🐛 Troubleshooting

### Erro: "Token não fornecido"
- Certifique-se de incluir o header `Authorization: Bearer TOKEN`

### Erro: "Token inválido"
- O token pode ter expirado (7 dias)
- Faça login novamente

### Erro: "Usuário já existe"
- Tente outro username/email
- Ou faça login com a conta existente

### Servidor não inicia
- Verifique se a porta 3000 está livre
- Rode: `lsof -i :3000` para ver processos usando a porta
- Kill o processo: `kill -9 PID`

## 📝 Exemplo de Uso no Frontend

```javascript
import { apiClient } from './src/data/APIClient.js';

// Registrar
const result = await apiClient.register('usuario', 'senha123');
console.log('Token:', result.token);

// Login
await apiClient.login('usuario', 'senha123');

// Salvar personagem
await apiClient.saveCharacter({
  name: 'Herói',
  level: 5,
  speed: 200
});

// Carregar personagem
const char = await apiClient.loadCharacter();
console.log('Personagem:', char.data);

// Logout
apiClient.logout();
```

## 🔄 Sincronização

O `HybridDataManager` sincroniza automaticamente entre local e servidor:

- **Modo Online**: Dados salvos no servidor + backup local
- **Modo Offline**: Dados salvos apenas localmente
- **Sincronização**: Ao fazer login, dados locais são enviados ao servidor

## 📚 Recursos

- [Express.js Docs](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
