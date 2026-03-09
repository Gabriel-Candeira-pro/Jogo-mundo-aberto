# ✅ Checklist - Configuração Inicial

Use este checklist para configurar e testar o projeto mobile pela primeira vez.

## 📋 Pré-requisitos

- [ ] Node.js 18+ instalado
- [ ] npm ou yarn configurado
- [ ] Git instalado (opcional)
- [ ] Celular Android ou iOS disponível
- [ ] Mesma rede Wi-Fi (computador + celular)

## 🔧 Instalação

### Backend + Web (já existente)
- [ ] Dependências web instaladas: `cd web && npm install`
- [ ] Backend funciona: `npm run server` (porta 3000)
- [ ] Frontend web funciona: `npm run web:dev` (porta 8080)

### Mobile (novo)
- [ ] Dependências mobile instaladas: `cd mobile && npm install`
- [ ] Expo CLI disponível: `npx expo --version`
- [ ] Expo Go instalado no celular

## 📱 Configurar App Mobile

### 1. Descobrir IP Local
```bash
# Linux/Mac
hostname -I | awk '{print $1}'

# Anote o IP (ex: 192.168.1.100)
```

- [ ] IP local anotado: `_________________`

### 2. Configurar URL do Servidor

Edite `mobile/src/config/config.js`:

```javascript
BASE_URL: 'http://SEU_IP:3000'  // Substituir SEU_IP
```

- [ ] Arquivo editado com IP correto
- [ ] Salvo as mudanças

### 3. Configurar Assets (Opcional)

- [ ] Baixar/criar ícone do app (1024x1024)
- [ ] Colocar em `mobile/assets/icon.png`
- [ ] Criar splash screen (opcional)

## 🚀 Testar

### Teste 1: Backend
```bash
npm run server
```

- [ ] Servidor inicia sem erros
- [ ] Mensagem "Servidor rodando em http://localhost:3000" aparece
- [ ] `curl http://localhost:3000/api/map` retorna dados

### Teste 2: Web (opcional)
```bash
npm run web:dev
```

- [ ] Webpack compila sem erros
- [ ] Browser abre automaticamente
- [ ] Login funciona
- [ ] Jogo carrega

### Teste 3: Mobile

#### Terminal 1 - Backend
```bash
npm run server
```

#### Terminal 2 - Mobile
```bash
cd mobile
npm start
```

- [ ] Metro bundler inicia
- [ ] QR code aparece no terminal
- [ ] Nenhum erro de compilação

#### No Celular - Expo Go
- [ ] Expo Go está instalado
- [ ] QR code escaneado
- [ ] App baixa bundle JavaScript
- [ ] Tela de login aparece
- [ ] Consegue criar conta
- [ ] Consegue fazer login
- [ ] Jogo carrega (mapa aparece)
- [ ] Controles respondem
- [ ] Personagem se move

## 🐛 Troubleshooting

### "Network request failed"
- [ ] Backend está rodando?
- [ ] IP em config.js está correto?
- [ ] Firewall desabilitado?
- [ ] Mesma rede Wi-Fi?

**Teste manual:**
1. Abrir navegador no celular
2. Acessar `http://SEU_IP:3000`
3. Deve mostrar erro ou dados JSON

### "Unable to resolve module"
```bash
cd mobile
rm -rf node_modules
npm install
npm start -- --clear
```

- [ ] Tentou limpar cache
- [ ] Reinstalou dependências

### Controles não funcionam
- [ ] React Native Gesture Handler instalado?
- [ ] App reiniciado após instalar dependências?

## 📦 Build (Opcional)

### Configurar EAS Build

```bash
npm install -g eas-cli
eas login
```

- [ ] EAS CLI instalado
- [ ] Logado na conta Expo

```bash
cd mobile
eas build:configure
```

- [ ] Arquivo `eas.json` criado
- [ ] Configurações aceitas

### Gerar APK

```bash
npm run build:apk
```

- [ ] Build iniciado
- [ ] Link gerado (esperar ~10-20min)
- [ ] APK baixado
- [ ] Instalado no celular
- [ ] App abre sem Expo Go

## 🎯 Próximos Passos

Após tudo funcionando:

### Features
- [ ] Adicionar mais mapas
- [ ] Implementar chat
- [ ] Adicionar NPCs
- [ ] Sistema de inventário

### Performance
- [ ] Implementar WebSocket
- [ ] Adicionar cache offline
- [ ] Otimizar renderização

### Deploy
- [ ] Deploy backend (Railway, Render, etc)
- [ ] Build produção web
- [ ] Publicar na Play Store (opcional)

### Testes
- [ ] Testar com múltiplos jogadores
- [ ] Testar em diferentes dispositivos
- [ ] Testar com internet lenta
- [ ] Reportar bugs

## 📚 Documentação Útil

- [README_MONOREPO.md](README_MONOREPO.md) - Visão geral
- [QUICKSTART_MOBILE.md](QUICKSTART_MOBILE.md) - Guia mobile
- [OPTIMIZATIONS_MOBILE.md](OPTIMIZATIONS_MOBILE.md) - Otimizações
- [STRUCTURE.md](STRUCTURE.md) - Estrutura do projeto
- [mobile/README.md](mobile/README.md) - Docs mobile

## ✅ Status Final

Data: _______________

- [ ] ✅ Todo o checklist concluído
- [ ] ✅ App mobile funcionando
- [ ] ✅ Multiplataforma testado
- [ ] ✅ Pronto para desenvolvimento

---

**Dúvidas?** Leia a documentação completa em README_MONOREPO.md
