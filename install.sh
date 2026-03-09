#!/bin/bash

# Script de instalação completa do projeto Gayme Monorepo

echo "🎮 Instalando Gayme Monorepo..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Instalar dependências root
echo -e "${BLUE}[1/3]${NC} Instalando dependências root..."
npm install

# 2. Instalar dependências web
echo -e "${BLUE}[2/3]${NC} Instalando dependências web (Phaser)..."
cd web && npm install && cd ..

# 3. Instalar dependências mobile
echo -e "${BLUE}[3/3]${NC} Instalando dependências mobile (React Native)..."
cd mobile && npm install && cd ..

echo ""
echo -e "${GREEN}✓${NC} Instalação concluída!"
echo ""
echo "📚 Próximos passos:"
echo ""
echo "  Web:    npm run full          # Backend + Frontend web"
echo "  Mobile: npm run mobile:start  # App React Native"
echo ""
echo "📖 Leia README_MONOREPO.md para mais informações"
