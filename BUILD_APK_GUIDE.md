# 📦 Guia de Build APK - Passo a Passo

## Opções de Build

Existem **2 formas** de gerar o APK:

### 🚀 Opção 1: EAS Build (Recomendado)
Build na nuvem Expo - **sem precisar de Android Studio**

### 🛠️ Opção 2: Local Build
Build local - **precisa Android Studio configurado**

---

## 🚀 Opção 1: EAS Build (Fácil)

### Passo 1: Instalar/Usar EAS CLI

**Opção A: Usar npx (Sem Instalar) - RECOMENDADO**
```bash
# Não precisa instalar! Funciona direto:
npx eas-cli --version
```

**Opção B: Instalar Globalmente**
```bash
npm install -g eas-cli
# ou com sudo se der erro de permissão
sudo npm install -g eas-cli
```

**Importante:** EAS CLI requer **Node.js ≥ 20.0.0**. Se você tem Node 18, use npx ou veja [NODE_UPDATE_GUIDE.md](NODE_UPDATE_GUIDE.md)

### Passo 2: Login no Expo

```bash
# Com npx
npx eas-cli login

# Ou se instalou globalmente
eas login
```

Se não tem conta:
```bash
npx eas-cli register
```

### Passo 3: Configurar Projeto

```bash
cd mobile

# Com npx
npx eas-cli build:configure

# Ou com script npm
npm run eas:configure
```

Perguntas que aparecerão:
- **"Generate a new project?"** → Yes
- **"What would you like your Android package name to be?"** → `com.gayme.mobile` (ou outro)

Isso cria/atualiza o arquivo `eas.json`.

### Passo 4: Gerar APK (Preview Build)

**Da raiz do projeto:**
```bash
npm run build:apk
```

**Ou do diretório mobile:**
```bash
cd mobile
npm run build:apk
```

**Ou diretamente:**
```bash
# Com npx
npx eas-cli build --platform android --profile preview

# Com EAS instalado globalmente
eas build --platform android --profile preview
```

### Passo 5: Aguardar Build

O build acontece na nuvem:
- ⏱️ Primeira vez: ~15-20 minutos
- ⏱️ Builds seguintes: ~10-15 minutos

Você verá:
```
✔ Build started, it may take a few minutes to complete.
🔗 https://expo.dev/accounts/SEU_USER/projects/gayme-mobile/builds/...
```

### Passo 6: Download

Quando finalizar, você receberá:
- 📧 Email com link
- 🔗 Link no terminal
- 📱 Pode baixar direto no celular

Download do APK e instale!

---

## 🛠️ Opção 2: Build Local

**Pré-requisitos:**
- Android Studio instalado
- Android SDK configurado
- Java JDK 11+

### Passo 1: Instalar Expo Dev Client

```bash
cd mobile
npx expo install expo-dev-client
```

### Passo 2: Gerar projeto Android

```bash
npx expo prebuild --platform android
```

### Passo 3: Build APK Local

```bash
cd android
./gradlew assembleRelease
```

APK estará em:
```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

---

## 📋 Troubleshooting

### "You are not logged in"

```bash
npx eas-cli login
# Digite email e senha
```

### "Project not configured"

```bash
cd mobile
npx eas-cli build:configure
```

### "Unsupported engine" ou "Node version"

Você precisa Node.js 20+. **Solução rápida:** use `npx` em todos os comandos.

**Solução permanente:** Atualize o Node.js - veja [NODE_UPDATE_GUIDE.md](NODE_UPDATE_GUIDE.md)

### "Invalid Android package name"

Edite `mobile/app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.gayme.mobile"
    }
  }
}
```

### Build falha com "No credentials"

```bash
eas credentials
# Selecione: Android → Keystore → Generate new keystore
```

### Erro "Module not found"

```bash
cd mobile
rm -rf node_modules
npm install
npm run build:apk
```

### Build local falha

```bash
# Limpar cache Gradle
cd mobile/android
./gradlew clean

# Tentar novamente
./gradlew assembleRelease
```

### "EACCES: permission denied" ao instalar EAS

**Solução 1:** Use npx (não precisa instalar)
```bash
npx eas-cli login
```

**Solução 2:** Instale com sudo
```bash
sudo npm install -g eas-cli
```

**Solução 3:** Configure npm para usuário atual - veja [NODE_UPDATE_GUIDE.md](NODE_UPDATE_GUIDE.md)

---

## 🎯 Tipos de Build

### Development Build
```bash
eas build --platform android --profile development
```
- Inclui DevTools
- Maior tamanho (~50MB)
- Para desenvolvimento

### Preview Build (APK)
```bash
npm run build:apk
# ou
eas build --platform android --profile preview
```
- APK instalável
- Sem Google Play
- Para testes (~25MB)

### Production Build (AAB)
```bash
npm run build:android
# ou
eas build --platform android --profile production
```
- Android App Bundle
- Para Google Play Store
- Otimizado (~15MB)

---

## 📱 Instalar APK no Celular

### Opção 1: Download Direto
1. Abra o link do EAS no celular
2. Baixe o APK
3. Permita "Instalar de fontes desconhecidas"
4. Instale

### Opção 2: Transfer via USB
```bash
# Conecte celular via USB
# Habilite "Depuração USB" no celular

# Copie APK
adb install caminho/do/app.apk
```

### Opção 3: Upload para Drive/Dropbox
1. Faça upload do APK
2. Baixe no celular
3. Instale

---

## ⚙️ Configurações Avançadas

### Customizar eas.json

Edite `mobile/eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Adicionar Variáveis de Ambiente

```json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://seu-backend.com"
      }
    }
  }
}
```

### Build com recursos específicos

```bash
# Build apenas para arm64 (dispositivos modernos)
eas build --platform android --profile preview --non-interactive
```

---

## 📊 Comparação

| Aspecto | EAS Build | Local Build |
|---------|-----------|-------------|
| **Setup** | Fácil (npm) | Difícil (Android Studio) |
| **Tempo** | 15-20 min | 5-10 min |
| **Internet** | Necessária | Opcional |
| **Custo** | Grátis* | Grátis |
| **Manutenção** | Zero | Alta |

*Plano gratuito: builds ilimitados para open-source

---

## ✅ Checklist Final

Antes de gerar APK de produção:

- [ ] Teste em desenvolvimento (Expo Go)
- [ ] Todas funcionalidades funcionando
- [ ] Ícone customizado em `mobile/assets/icon.png`
- [ ] Splash screen em `mobile/assets/splash.png`
- [ ] `app.json` configurado (nome, versão, etc)
- [ ] Backend de produção configurado
- [ ] Testes em dispositivo real
- [ ] Versão incrementada em `app.json`

---

## 🚀 Comandos Rápidos

```bash
# Da raiz do projeto:
npm run build:apk           # APK preview
npm run build:android       # AAB produção
npm run mobile:start        # Desenvolvimento

# Do diretório mobile (com npx):
npm run eas:login          # Login Expo
npm run eas:configure      # Configurar (primeira vez)
npm run build:apk          # APK preview
npm run build:android      # AAB produção

# Direto com npx:
npx eas-cli build --platform android --profile preview
```

---

## 📚 Recursos

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Android Publishing](https://docs.expo.dev/submit/android/)
- [App Signing](https://docs.expo.dev/app-signing/app-credentials/)
- [Troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)

---

**Primeira vez?** → Use EAS Build (Opção 1)  
**Já configurado?** → `npm run build:apk`  
**Dúvidas?** → Veja [CHECKLIST.md](CHECKLIST.md)
