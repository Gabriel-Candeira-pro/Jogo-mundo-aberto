# Gayme - Jogo Phaser Responsivo

Um jogo 2D criado com Phaser que funciona perfeitamente em **mobile** e **desktop**.

## 🎮 Características

- ✅ **Responsivo**: Funciona em qualquer tamanho de tela (mobile, tablet, desktop)
- ✅ **Multi-input**: Suporte a teclado (desktop) e touch (mobile)
- ✅ **Auto-scaling**: Jogo se adapta automaticamente ao redimensionar a janela
- ✅ **Sem dependências externas**: Usa Phaser via CDN
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

## 🌐 Compartilhar Publicament e com ngrok

Para acessar seu jogo de qualquer lugar usando ngrok:

### Pré-requisito
- Ter uma conta no [ngrok](https://ngrok.com) (gratuita)
- Fazer login: `ngrok authtoken SEU_TOKEN`

### Executar com ngrok

```bash
npm run dev:ngrok
```

Isso irá:
1. ✅ Iniciar o servidor webpack de desenvolvimento na porta 8080
2. ✅ Ativar um túnel ngrok automático
3. ✅ Exibir a URL pública (ex: `https://abc123def456.ngrok.io`)

Compartilhe a URL pública para outros acessarem seu jogo de qualquer lugar!

**Dica**: A URL é regenerada cada vez que você executa o comando. Se precisar de uma URL permanente, upgrade sua conta ngrok.

## 📁 Estrutura do Projeto

```
Gayme/
├── index.html          # Arquivo HTML principal
├── package.json        # Dependências npm
├── README.md          # Este arquivo
└── src/
    └── game.js        # Código principal do jogo
```

## 🔧 Customizações

### Mudar tamanho da tela
Edite a configuração em `src/game.js`:
```javascript
scale: {
    width: 800,    // Largura padrão
    height: 600,   // Altura padrão
    // ...
}
```

### Ajustar dificuldade
- Altere `gravity: { y: 300 }` para gravidade
- Mude velocidade dos inimigos
- Ajuste velocidade do jogador

### Adicionar mais sprites
Veja a função `PreloadScene.create()` em `src/game.js` para ver como criar gráficos dinâmicos.

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

## 📝 Próximos Passos

Para expandir o jogo, considere adicionar:
- Novos níveis
- Sistema de sons
- Particle effects
- Animações mais complexas
- Sistema de saltos (salas/levels)
- Leaderboard local

---
