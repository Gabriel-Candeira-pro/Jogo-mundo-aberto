# Gayme - Monorepo Multiplataforma

Projeto multiplayer com suporte para **Web (Phaser)** e **Mobile (React Native)** compartilhando o mesmo backend Node.js.

## 📁 Estrutura do Projeto

```
Gayme/
├── web/                    # Projeto web (Phaser.js)
│   ├── src/               # Código-fonte do jogo web
│   ├── index.html         # HTML principal
│   └── webpack.config.js  # Config webpack
│
├── mobile/                # Projeto mobile (React Native + Expo)
│   ├── src/
│   │   ├── screens/       # Telas (Login, Game)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── services/      # API e serviços
│   │   └── config/        # Configurações
│   ├── app.json          # Config Expo
│   └── package.json
│
├── server/                # Backend compartilhado (Node.js + Express)
│   ├── server.js         # Servidor principal
│   └── data/             # Dados do jogo (JSON)
│
├── scripts/              # Scripts utilitários
└── package.json          # Root package (workspaces)
```

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
# Instala dependências de todos os projetos
npm run install:all

# Ou manualmente:
npm install                      # Root
npm install --prefix web         # Web
npm install --prefix mobile      # Mobile
```

### 2. Executar o Projeto Web

```bash
# Inicia servidor backend + frontend web
npm run full

# Acesse: http://localhost:8080
# Backend: http://localhost:3000
```

### 3. Executar o Projeto Mobile

**Pré-requisitos:**
- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Ou Android Studio / Xcode configurado

```bash
# Terminal 1: Iniciar backend
npm run server

# Terminal 2: Iniciar app mobile
npm run mobile:start

# Para abrir diretamente no Android
npm run mobile:android
```

**Configurar URL do servidor:**
Edite [mobile/src/config/config.js](mobile/src/config/config.js):
```javascript
BASE_URL: 'http://SEU-IP-LOCAL:3000'  // Ex: http://192.168.1.100:3000
```

## 📱 Build APK Android

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar projeto
cd mobile
eas build:configure

# Gerar APK
npm run build:apk
```

O APK estará disponível para download no painel Expo.

## 🎮 Como Jogar

### Web
1. Abra http://localhost:8080
2. Crie uma conta ou faça login
3. Use WASD ou setas para mover

### Mobile
1. Abra o app
2. Faça login (mesmas credenciais da web)
3. Use os controles na tela para mover

**Ambos compartilham:**
- ✅ Mesmo mapa global
- ✅ Mesmos jogadores online
- ✅ Mesma autenticação
- ✅ Progresso sincronizado

## 🛠️ Scripts Disponíveis

### Root
- `npm run server` - Inicia backend
- `npm run server:dev` - Backend com hot reload
- `npm run web:dev` - Inicia frontend web
- `npm run web:build` - Build produção web
- `npm run mobile:start` - Inicia Expo
- `npm run mobile:android` - Abre no Android
- `npm run full` - Backend + Web simultâneo

### Mobile
- `npm start` - Inicia Expo
- `npm run android` - Abre no Android
- `npm run build:apk` - Gera APK

## 📝 Desenvolvimento

### Adicionar funcionalidade em ambas plataformas

1. **Backend** (server/): Criar/modificar endpoints da API
2. **Web** (web/src/): Implementar com Phaser
3. **Mobile** (mobile/src/): Implementar com React Native

### Hot Reload
- **Web**: Webpack Dev Server (automático)
- **Mobile**: Expo Fast Refresh (automático)
- **Backend**: Nodemon (automático com `npm run server:dev`)

## 🔧 Troubleshooting

### Mobile não conecta ao servidor
- Verifique se está na mesma rede Wi-Fi
- Use o IP local (não localhost) em config.js
- Desabilite firewall temporariamente

### Erro de permissões Android
- Verifique `android.permissions` em app.json
- Recompile com `eas build`

### Dependências desatualizadas
```bash
npm run install:all
```

## 📚 Documentação

- [Web/Phaser](web/README.md)
- [Backend](server/README.md)  
- [Multiplayer](MULTIPLAYER.md)
- [Quick Start](QUICKSTART.md)

## 🎯 Próximos Passos

- [ ] Implementar WebSocket para multiplayer em tempo real
- [ ] Adicionar sistema de chat
- [ ] Melhorar gráficos mobile
- [ ] Suporte a iOS
- [ ] Publicar na Play Store

## 📄 Licença

MIT
