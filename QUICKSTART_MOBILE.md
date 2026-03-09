# 📱 Guia de Início Rápido - Mobile

## Pré-requisitos

1. **Node.js** 18+ instalado
2. **Expo Go** no celular:
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
3. **Backend rodando** (servidor Node.js)

## Passo a Passo

### 1. Instalar Dependências

```bash
# Na raiz do projeto
./install.sh

# Ou manualmente:
cd mobile
npm install
```

### 2. Configurar URL do Servidor

Edite `mobile/src/config/config.js`:

```javascript
BASE_URL: 'http://SEU_IP:3000'  // Substitua SEU_IP pelo seu IP local
```

**Descobrir seu IP:**
```bash
# Linux
hostname -I | awk '{print $1}'

# Mac
ipconfig getifaddr en0

# Windows (PowerShell)
(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Wi-Fi).IPAddress
```

### 3. Iniciar Backend

```bash
# Em um terminal separado, na raiz do projeto
npm run server
```

Você verá:
```
✓ Servidor rodando em http://localhost:3000
```

### 4. Iniciar App Mobile

```bash
cd mobile
npm start
```

Um QR code aparecerá no terminal.

### 5. Testar no Celular

1. Abra o **Expo Go** no celular
2. Escaneie o QR code
3. Aguarde o build
4. App abrirá automaticamente

**Importante:** Celular e computador devem estar na **mesma rede Wi-Fi**.

## Testar

1. **Login:** Use as mesmas credenciais da versão web
2. **Criar conta:** Clique em "Criar nova conta"
3. **Jogar:** Use os controles na tela para mover

## Problemas Comuns

### "Network request failed"

**Solução:**
1. Verifique se o backend está rodando
2. Confirme o IP em `config.js`
3. Teste acessando `http://SEU_IP:3000` no navegador do celular

### QR code não abre

**Solução:**
1. Verifique se está na mesma rede
2. Tente digitar o URL manualmente no Expo Go
3. Desabilite firewall temporariamente

### App trava/fecha

**Solução:**
1. Limpe cache: `npm start -- --clear`
2. Reinstale dependências: `rm -rf node_modules && npm install`
3. Verifique logs no terminal

## Build APK (Opcional)

Para criar um APK instalável:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar (primeira vez)
eas build:configure

# Gerar APK
npm run build:apk
```

O link para download aparecerá no terminal.

## Próximos Passos

- [ ] Testar multiplayer com amigos
- [ ] Personalizar controles
- [ ] Reportar bugs no GitHub
- [ ] Melhorar gráficos

---

**💡 Dica:** Mantenha o terminal do backend e do mobile abertos durante o desenvolvimento para ver logs em tempo real.
