# Gayme - Jogo Phaser Responsivo

Um jogo 2D criado com Phaser que funciona perfeitamente em **mobile** e **desktop**.

## 🎮 Características

- ✅ **Responsivo**: Funciona em qualquer tamanho de tela (mobile, tablet, desktop)
- ✅ **Multi-input**: Suporte a teclado (desktop) e touch (mobile)
- ✅ **Auto-scaling**: Jogo se adapta automaticamente ao redimensionar a janela (escala FIT)
- ✅ **Arquitetura modular**: Cenas e configurações organizadas em arquivos separados
- ✅ **Otimizado**: Phaser 3.55 com webpack para melhor performance
- ✅ **Pronto para jogar**: Exemplo completo de jogo jogável

## 📋 Como Jogar

### Desktop
- **Setas ← →**: Mover para os lados
- **Seta ↑ ou Espaço**: Pular
- **Objetivo**: Coletar todas as estrelas e evitar os inimigos vermelhos

### Mobile
- **Toque lado esquerdo**: Mover para a esquerda
- **Toque lado direito**: Mover para a direita
- **Toque no topo**: Pular
- **Objetivo**: Coletar todas as estrelas e evitar os inimigos vermelhos

## 🚀 Quick Start

### Opção 1: Executar diretamente (Recomendado)

```bash
# Abrir no navegador
open index.html
```

Ou coloque o arquivo em um servidor HTTP local:

```bash
# Python 3
python -m http.server 8000

# Ou com Node.js (requer http-server)
npx http-server
```

Depois acesse: http://localhost:8000

### Opção 2: Com webpack (para desenvolvimento avançado)

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Buildar para produção
npm run build
```

## 🌐 Compartilhar Publicamente com ngrok

Para acessar seu jogo de qualquer lugar usando ngrok (recomendado para teste remoto):

### Pré-requisitos
- Ter uma conta no [ngrok](https://ngrok.com) (gratuita)
- ngrok instalado e autenticado: `ngrok authtoken SEU_TOKEN`
- As dependências do projeto instaladas: `npm install`

### Executar com ngrok

```bash
# Método 1: Usar o script automático (recomendado)
npm run dev:ngrok

# Método 2: Executar manualmente
node scripts/ngrok.js
```

**O que acontece automaticamente:**
1. ✅ Compila o webpack em modo desenvolvimento
2. ✅ Inicia servidor de desenvolvimento na porta 8080
3. ✅ Cria um túnel ngrok automático
4. ✅ Exibe a URL pública (ex: `https://abc123def456.ngrok.io`)
5. ✅ Monitora alterações e recarrega automáticamente

**Como usar:**
- Compartilhe a URL pública com qualquer pessoa
- Qualquer pessoa pode jogar sem instalar nada
- A URL muda a cada novo comando (exceto com plano pago ngrok)

**Dica de ouro**: Manter o terminal aberto enquanto estiver desenvolvendo permite que outras pessoas vejam as mudanças em tempo real!

## 📁 Estrutura do Projeto (Arquitetura Modular)

```
Gayme/
├── index.html                    # Arquivo HTML principal
├── package.json                  # Dependências npm
├── webpack.config.js             # Configuração webpack
├── README.md                     # Este arquivo
├── scripts/
│   └── ngrok.js                 # Script para iniciar com ngrok
└── src/
    ├── game.js                   # Inicializador do jogo
    ├── config/
    │   └── gameConfig.js         # Configuração centralizada (responsividade, física, etc)
    ├── scenes/
    │   ├── PreloadScene.js       # Cena de preload (sprites, assets)
    │   └── GameScene.js          # Cena principal do jogo
    └── utils/
        └── controls.js           # Utilitários de controles (teclado, touch)
```

## 🔧 Customizações

### Mudar tamanho da tela
Edite a configuração em [src/config/gameConfig.js](src/config/gameConfig.js):
```javascript
scale: {
    width: 800,         // Largura padrão
    height: 600,        // Altura padrão
    min: { width: 320, height: 240 },  // Tamanho mínimo
    max: { width: 1920, height: 1440 } // Tamanho máximo
}
```

### Ajustar dificuldade
Edite [src/scenes/GameScene.js](src/scenes/GameScene.js):
- Altere `gravity: { y: 300 }` para mudar a gravidade
- Mude `velocidade dos inimigos` (propriedade `speed`)
- Ajuste `velocidade do jogador` (propriedade `Velocity`)

### Adicionar mais sprites
Veja [src/scenes/PreloadScene.js](src/scenes/PreloadScene.js) para ver como criar gráficos dinâmicos.

### Acessar controles
Personalize os controles em [src/utils/controls.js](src/utils/controls.js)

## 📱 Teste em Smartphone

1. **Local Network**: 
   - Coloque o arquivo em um servidor HTTP
   - Acesse pelo IP da sua máquina (ex: http://192.168.1.X:8000)

2. **Com Cloudflare Tunnel** (Recomendado):
   ```bash
   # Instale cloudflare tunnel
   curl -L --output cloudflared.tgz https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.tgz
   tar xzf cloudflared.tgz
   
   # Crie um tunnel
   ./cloudflared tunnel --url http://localhost:8000
   ```

3. **Modo Fullscreen em Mobile**:
   - Pressione F11 ou o botão de fullscreen do navegador
   - Melhor experiência com a tela em modo landscape

## 🎨 Tecnologias

- **Phaser 3.55**: Framework de jogos JavaScript
- **Vanilla JavaScript**: Sem dependências desnecessárias
- **Responsive Web Design**: CSS moderno para adaptabilidade

## 📚 Recursos

- [Documentação Phaser](https://photonstorm.github.io/phaser3-docs/)
- [Exemplos Phaser](https://phaser.io/examples)
- [Community Phaser](https://www.html5gamedevs.com/)

## 📝 Novidades nesta Atualização

### ✨ Principais Melhorias
- 🏗️ **Refatoração modular**: Código organizado em cenas e configurações separadas
- ⚡ **Webpack integrado**: Build otimizado para produção e desenvolvimento
- 📱 **Responsividade melhorada**: Escala FIT com suporte completo a múltiplas resoluções
- 🎮 **Toque otimizado**: Controles touch refinados para melhor experiência mobile
- 🚀 **ngrok automático**: Script para compartilhar o jogo facilmente
- 📦 **Organização clara**: Estrutura escalável para adicionar novas features

### 🎯 Próximos Passos

Para expandir o jogo, considere adicionar:
- Novos níveis com dificuldade progressiva
- Sistema de sons e música de fundo
- Particle effects para efeitos visuais
- Animações mais complexas
- Sistema de salas/levels (world/room)
- Leaderboard local com localStorage
- Sistema de power-ups
- Inimigos com IA mais sofisticada

---
