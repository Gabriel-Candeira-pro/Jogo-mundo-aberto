# 🚀 START HERE - Guia de Início Rápido

**Leia isto primeiro** antes de começar com o projeto mobile.

---

## ⚡ TL;DR - Comandos Essenciais

```bash
# 1. Login no Expo (primeira vez)
npx eas-cli login

# 2. Configurar projeto mobile (primeira vez)
cd mobile
npx eas-cli build:configure
cd ..

# 3. Gerar APK Android
npm run build:apk

# 4. Ou testar em desenvolvimento (Expo Go)
npm run server           # Terminal 1: Backend
npm run mobile:start     # Terminal 2: Mobile
```

---

## ⚠️ IMPORTANTE: Node.js

Você tem **Node.js v18.19.1**, mas EAS CLI requer **Node ≥ 20**.

### Solução Imediata (Funciona Agora)
Use `npx eas-cli` em vez de `eas` em todos os comandos.

### Solução Permanente (Recomendado)
Atualize para Node 20 - veja [NODE_UPDATE_GUIDE.md](NODE_UPDATE_GUIDE.md)

---

## 📱 Opção 1: Testar no Celular (Expo Go)

**Mais rápido para começar:**

```bash
# Terminal 1: Iniciar backend
npm run server

# Terminal 2: Iniciar app mobile
npm run mobile:start
```

1. Instale **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Escaneie o QR code que aparece
3. Aguarde carregar
4. Jogue!

**Edite antes:** [mobile/src/config/config.js](mobile/src/config/config.js)
```javascript
BASE_URL: 'http://SEU_IP_LOCAL:3000'  // Ex: http://192.168.1.100:3000
```

Descubra seu IP:
```bash
hostname -I | awk '{print $1}'
```

---

## 📦 Opção 2: Gerar APK Instalável

**Para distribuir ou instalar sem Expo Go:**

### Primeira Vez

```bash
# 1. Login
npx eas-cli login

# 2. Configurar
cd mobile
npx eas-cli build:configure
# Responda: package name = com.gayme.mobile
cd ..
```

### Gerar APK

```bash
npm run build:apk
```

- ⏱️ Demora ~15-20 minutos
- 🔗 Link aparecerá no terminal
- 📧 Email quando finalizar
- 📱 Baixe e instale no celular

**Guia completo:** [BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md)

---

## 📁 Estrutura do Projeto

```
Gayme/
├── web/          # Projeto Phaser (navegador)
├── mobile/       # App React Native (Android/iOS)
├── server/       # Backend compartilhado
└── scripts/      # Utilitários
```

**Ambos (web e mobile) usam o mesmo backend!**

---

## 🛠️ Scripts Principais

### Backend
```bash
npm run server              # Iniciar servidor (localhost:3000)
npm run server:dev          # Com hot reload
```

### Web (Phaser)
```bash
npm run web:dev             # Dev server (localhost:8080)
npm run web:build           # Build produção
npm run full                # Backend + Web juntos
```

### Mobile (React Native)
```bash
npm run mobile:start        # Expo (desenvolvimento)
npm run mobile:android      # Abre no Android conectado
npm run build:apk           # Gera APK (build na nuvem)
```

### Instalação
```bash
npm run install:all         # Instalar TODAS as dependências
./install.sh                # Alternativa (script bash)
```

---

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
npm run install:all
```

Isso instala dependências para:
- Root (concurrently, express, etc)
- Web (webpack, phaser, etc)
- Mobile (expo, react-native, etc)

### 2. Configurar URL do Backend (Mobile)

Edite [mobile/src/config/config.js](mobile/src/config/config.js):

```javascript
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://192.168.1.100:3000'  // ⬅️ MUDAR AQUI (seu IP local)
    : 'https://seu-dominio.com',
  // ...
}
```

### 3. Testar Backend

```bash
npm run server
# Deve mostrar: ✓ Servidor rodando em http://localhost:3000
```

Teste no navegador: `http://localhost:3000/api/map`

---

## 🎯 Workflows Comuns

### Desenvolvimento Web
```bash
npm run full
# Abre automaticamente: http://localhost:8080
```

### Desenvolvimento Mobile
```bash
# Terminal 1
npm run server

# Terminal 2
npm run mobile:start
# Escaneie QR code com Expo Go
```

### Build Produção
```bash
# Web
npm run web:build
# Output: web/dist/

# Mobile
npm run build:apk
# Download link após ~15min
```

---

## 📚 Documentação Completa

| Arquivo | Descrição |
|---------|-----------|
| [README_MONOREPO.md](README_MONOREPO.md) | **⭐ Visão geral completa** |
| [QUICKSTART_MOBILE.md](QUICKSTART_MOBILE.md) | Guia passo a passo mobile |
| [BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md) | Como gerar APK |
| [NODE_UPDATE_GUIDE.md](NODE_UPDATE_GUIDE.md) | Atualizar Node.js para v20 |
| [STRUCTURE.md](STRUCTURE.md) | Estrutura detalhada |
| [OPTIMIZATIONS_MOBILE.md](OPTIMIZATIONS_MOBILE.md) | Otimizações implementadas |
| [CHECKLIST.md](CHECKLIST.md) | Checklist de configuração |

---

## 🐛 Problemas Comuns

### "Network request failed" (Mobile)
- Backend está rodando? (`npm run server`)
- IP correto em `config.js`?
- Mesma rede Wi-Fi (celular + PC)?

### "Unsupported engine" (EAS CLI)
- Use `npx eas-cli` em vez de `eas`
- Ou atualize Node.js → [NODE_UPDATE_GUIDE.md](NODE_UPDATE_GUIDE.md)

### "EACCES: permission denied"
- Use `npx` (não precisa sudo)
- Ou: `sudo npm install -g eas-cli`

### Expo Go não abre
- Mesma rede Wi-Fi?
- Firewall desabilitado?
- Tente digitar URL manualmente no Expo Go

### Build falha
- Logado no Expo? `npx eas-cli whoami`
- Projeto configurado? `cd mobile && npx eas-cli build:configure`
- Veja logs completos no link do terminal

---

## ✅ Checklist

Antes de começar:

- [ ] Node.js instalado (v18+ mínimo, v20+ recomendado)
- [ ] npm funcionando
- [ ] Dependências instaladas (`npm run install:all`)
- [ ] Backend funciona (`npm run server`)
- [ ] IP local anotado (para mobile)
- [ ] Expo Go instalado no celular (para testes)

---

## 🚀 Próximos Passos

1. **Agora:** Teste no Expo Go (mais rápido)
   ```bash
   npm run server
   npm run mobile:start
   ```

2. **Depois:** Gere APK para instalar
   ```bash
   npx eas-cli login
   cd mobile && npx eas-cli build:configure && cd ..
   npm run build:apk
   ```

3. **Por fim:** Deploy backend em produção
   - Railway, Render, Heroku, etc
   - Atualizar `BASE_URL` em `config.js`

---

## 💡 Dicas

- **Desenvolvimento:** Use Expo Go (hot reload instantâneo)
- **Distribuição:** Gere APK (sem dependência do Expo Go)
- **Produção:** Publique na Play Store (AAB otimizado)
- **Debugging:** Veja logs no terminal mobile (`npm run mobile:start`)

---

**Dúvidas?** Leia [README_MONOREPO.md](README_MONOREPO.md)  
**Problemas?** Veja [CHECKLIST.md](CHECKLIST.md)  
**Node v18?** Leia [NODE_UPDATE_GUIDE.md](NODE_UPDATE_GUIDE.md)

**Começar agora:**
```bash
npm run mobile:start
```
