# 📦 Guia de Atualização do Node.js

## Problema Atual

Você tem **Node.js v18.19.1**, mas o EAS CLI requer **Node.js ≥ 20.0.0**.

## ✅ Solução Rápida (Sem Atualizar)

Use `npx` para executar EAS CLI sem instalar:

```bash
# Login no Expo
npx eas-cli login

# Configurar projeto
cd mobile
npx eas-cli build:configure

# Gerar APK
npx eas-cli build --platform android --profile preview
```

**Ou use os scripts npm:**
```bash
cd mobile
npm run eas:login         # Login
npm run eas:configure     # Configurar
npm run build:apk         # Gerar APK
```

---

## 🚀 Solução Definitiva - Atualizar para Node 20+

### Método 1: NVM (Recomendado)

NVM permite gerenciar múltiplas versões do Node.js facilmente.

#### Instalar NVM

```bash
# Download e instalação
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Recarregar configuração do shell
source ~/.bashrc
# ou
source ~/.zshrc  # se usar zsh
```

#### Instalar Node 20

```bash
# Instalar última versão LTS (20.x)
nvm install 20

# Usar Node 20
nvm use 20

# Definir como padrão
nvm alias default 20

# Verificar
node -v   # Deve mostrar v20.x.x
npm -v
```

#### Comandos Úteis NVM

```bash
# Listar versões instaladas
nvm list

# Listar versões disponíveis
nvm ls-remote

# Alternar entre versões
nvm use 18    # Volta para v18
nvm use 20    # Usa v20

# Desinstalar uma versão
nvm uninstall 18
```

---

### Método 2: NodeSource (Ubuntu/Debian)

```bash
# Remover Node.js antigo (opcional)
sudo apt-get remove nodejs npm

# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node 20
sudo apt-get install -y nodejs

# Verificar instalação
node -v   # v20.x.x
npm -v
```

---

### Método 3: Download Direto

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS 20.x**
3. Siga o instalador

---

## 🔧 Após Atualizar

### Instalar EAS CLI Globalmente

```bash
# Agora pode instalar globalmente
npm install -g eas-cli

# Verificar
eas --version
```

### Reinstalar Dependências do Projeto

```bash
# Na raiz do projeto
rm -rf node_modules package-lock.json
rm -rf web/node_modules web/package-lock.json  
rm -rf mobile/node_modules mobile/package-lock.json

# Reinstalar tudo
npm run install:all

# Ou manualmente
npm install
cd web && npm install && cd ..
cd mobile && npm install && cd ..
```

---

## 🐛 Troubleshooting

### "nvm: command not found"

Recarregue o shell:
```bash
source ~/.bashrc
# ou
source ~/.zshrc
```

Se ainda não funcionar, adicione manualmente ao `.bashrc`:
```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
source ~/.bashrc
```

### Erro de permissão com npm global

Com NVM, permissões são automáticas. Sem NVM:

```bash
# Configurar diretório npm para usuário
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### "EACCES: permission denied"

```bash
# Opção 1: Usar npx (recomendado)
npx eas-cli ...

# Opção 2: Instalar localmente
npm install eas-cli --save-dev
npx eas-cli ...

# Opção 3: Sudo (não recomendado)
sudo npm install -g eas-cli
```

---

## 📊 Comparação de Métodos

| Método | Vantagens | Desvantagens |
|--------|-----------|--------------|
| **npx** | Sem instalação, sem permissões | Mais lento, baixa toda vez |
| **NVM** | Múltiplas versões, sem sudo | Requer instalação inicial |
| **NodeSource** | Oficial, atualizado | Requer sudo |
| **Download** | Simples | Manual, requer sudo |

---

## ✅ Recomendação

1. **Para este projeto agora**: Use `npx eas-cli`
2. **Para desenvolvimento geral**: Instale NVM + Node 20

---

## 🚀 Comandos Finais

### Com npx (Funciona Agora)

```bash
# Login
npx eas-cli login

# Configurar (primeira vez)
cd mobile
npx eas-cli build:configure

# Build APK
cd ..
npm run build:apk
```

### Com Node 20 Instalado

```bash
# Instalar EAS
npm install -g eas-cli

# Login
eas login

# Configurar
cd mobile
eas build:configure

# Build
cd ..
npm run build:apk
```

---

## 📚 Recursos

- [NVM GitHub](https://github.com/nvm-sh/nvm)
- [Node.js Downloads](https://nodejs.org/)
- [NodeSource](https://github.com/nodesource/distributions)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

---

**TL;DR:**  
- **Agora:** Use `npx eas-cli` em todos os comandos
- **Depois:** Instale NVM e Node 20 para melhor experiência
