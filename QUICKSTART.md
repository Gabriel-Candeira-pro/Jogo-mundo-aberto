# ⚡ QUICK START - Backend Gayme

## 🎯 Em 3 Passos

### 1️⃣ Instalar
```bash
npm install
```

### 2️⃣ Executar
```bash
npm run full
```

### 3️⃣ Jogar
- Abra http://localhost:8080
- Clique em "Login/Registro"
- Crie conta (username + senha)
- Jogue!

---

## 📚 Documentação Completa

- **Frontend**: [README.md](README.md)
- **Backend API**: [server/README.md](server/README.md)
- **Instalação**: [INSTALACAO_BACKEND.md](INSTALACAO_BACKEND.md)
- **Sistema de Dados**: [GUIA_DADOS.md](GUIA_DADOS.md)

---

## 🎮 Modos de Jogo

### Offline (Sem servidor)
```bash
npm run dev
# Clique em "Jogar Offline"
```

### Online (Com servidor)
```bash
npm run full
# Clique em "Login/Registro"
```

---

## 🔍 Principais Arquivos

```
server/server.js           → Servidor backend
src/data/APIClient.js      → Cliente HTTP
src/data/AuthManager.js    → Sistema de login
src/scenes/LoginScene.js   → Tela de login
```

---

## 💡 Comandos Úteis

```bash
npm run full       # Servidor + Frontend
npm run server     # Apenas servidor
npm run dev        # Apenas frontend
npm run build      # Build produção
```

---

## 🆘 Problemas?

### Porta em uso
```bash
PORT=4000 npm run server
```

### Reinstalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Ver logs do servidor
```bash
npm run server:dev
```

---

## 🌟 Features

✅ Login/Registro  
✅ Sincronização em nuvem  
✅ Auto-save  
✅ Modo offline  
✅ API REST  
✅ JWT Auth  
✅ Múltiplos dispositivos  

---

**Dúvidas?** Veja a documentação completa nos arquivos README!
