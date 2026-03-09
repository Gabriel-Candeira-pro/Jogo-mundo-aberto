# Gayme Mobile - React Native

App Android/iOS para o jogo multiplayer Gayme.

## 🎯 Características

- ✅ Login/Registro sincronizado com web
- ✅ Renderização nativa com Skia
- ✅ Controles touch otimizados
- ✅ Multiplayer em tempo real
- ✅ Mesma lógica de jogo da versão web
- ✅ Offline-first (em desenvolvimento)

## 🚀 Executar

```bash
# Instalar dependências
npm install

# Iniciar Expo
npm start

# Ou diretamente no Android
npm run android
```

## 📱 Testar no Dispositivo

1. Instale [Expo Go](https://expo.dev/client)
2. Execute `npm start`
3. Escaneie o QR code com o app Expo Go

## 🔧 Configuração

### URL do Servidor

Edite `src/config/config.js`:

```javascript
BASE_URL: 'http://192.168.1.100:3000'  // Seu IP local
```

Para descobrir seu IP:
```bash
# Linux/Mac
ifconfig | grep inet

# Windows
ipconfig
```

## 📦 Build APK

```bash
# Primeira vez
npm install -g eas-cli
eas login
eas build:configure

# Gerar APK
npm run build:apk
```

## 🎮 Arquitetura

```
src/
├── screens/        # Telas principais
│   ├── LoginScreen.js
│   └── GameScreen.js
│
├── components/     # Componentes reutilizáveis
│   ├── GameCanvas.js      # Renderização do jogo
│   ├── GameControls.js    # Controles touch
│   └── GameHUD.js         # Interface do jogo
│
├── services/       # Lógica de negócio
│   ├── APIService.js      # Client HTTP
│   ├── AuthService.js     # Autenticação
│   └── GameService.js     # Lógica do jogo
│
├── config/         # Configurações
│   └── config.js          # API URLs, constantes
│
└── App.js          # Entry point
```

## 🔄 Sincronização com Backend

O app se comunica com o mesmo servidor Node.js da versão web:

- **Login/Registro**: `/api/auth/*`
- **Personagem**: `/api/character/*`
- **Mapa**: `/api/map`
- **Jogadores**: `/api/players/active`

## 🎨 Customização

### Cores do Tema

Edite os estilos em cada componente ou crie `src/styles/theme.js`.

### Performance

Ajuste FPS e qualidade em `src/config/config.js`:

```javascript
GAME_CONFIG = {
  MAX_FPS: 60,
  PHYSICS_FPS: 60,
  ANTIALIAS: false,  // true = melhor visual, false = melhor performance
}
```

## 📚 Dependências Principais

- **Expo**: Framework React Native
- **@shopify/react-native-skia**: Renderização de canvas
- **axios**: Cliente HTTP
- **@react-native-async-storage/async-storage**: Armazenamento local

## 🐛 Troubleshooting

### "Network request failed"
- Verifique se o servidor backend está rodando
- Use IP local, não `localhost`
- Verifique firewall

### "Unable to resolve module"
- Limpe cache: `npm start -- --clear`
- Reinstale: `rm -rf node_modules && npm install`

### Controles não respondem
- Verifique se React Native Gesture Handler está instalado
- Reinicie o app

## 📄 Licença

MIT
