# Guia de Uso do Sistema de Dados

Este documento explica como usar o sistema de armazenamento de dados do Gayme.

## 🎮 Visão Geral

O sistema de dados permite armazenar e gerenciar:
- **Personagens** - Atributos, níveis, habilidades
- **Usuários** - Pontuações, conquistas, estatísticas
- **Mapas** - Configurações de níveis, plataformas, inimigos

Todos os dados são salvos automaticamente no **localStorage** do navegador.

## 📦 Estrutura de Arquivos

```
src/data/
├── DataManager.js          # Gerenciador principal de dados
└── models/
    ├── Character.js        # Modelo de personagem
    ├── User.js            # Modelo de usuário
    └── Map.js             # Modelo de mapa
```

## 🛠️ Como Usar

### Acessar o DataManager

Abra o console do navegador (F12) e teste:

```javascript
// Importar via módulos (já está disponível no jogo)
import { dataManager } from './src/data/DataManager.js';

// Ou acessar globalmente através do console
// (você precisa primeiro carregar a página do jogo)
```

### 👤 Gerenciar Personagem

```javascript
// Obter personagem atual
const character = dataManager.getCharacter();
console.log(character);

// Atualizar personagem
dataManager.updateCharacter({
    name: 'Super Herói',
    level: 5,
    speed: 200,
    jumpPower: 400,
    color: 0xFF0000  // Vermelho
});

// Adicionar experiência (faz level up automático)
character.addExperience(150);
dataManager.saveCharacter(character);

// Adicionar moedas
character.addCoins(50);
dataManager.saveCharacter(character);

// Criar um novo personagem customizado
const novoPersonagem = dataManager.createCustomCharacter({
    name: 'Ninja',
    speed: 250,
    jumpPower: 380,
    color: 0x000000  // Preto
});
```

### 👥 Gerenciar Usuário

```javascript
// Obter usuário atual
const user = dataManager.getUser();
console.log(user);

// Atualizar usuário
dataManager.updateUser({
    username: 'MeuNome',
    email: 'email@example.com'
});

// Ver estatísticas
console.log('Partidas jogadas:', user.gamesPlayed);
console.log('Taxa de vitória:', user.getWinRate() + '%');
console.log('Conquistas:', user.achievements);

// Atualizar configurações
user.updateSettings({
    soundEnabled: false,
    difficulty: 'hard'
});
dataManager.saveUser(user);
```

### 🗺️ Gerenciar Mapas

```javascript
// Obter mapa atual
const map = dataManager.getMap();
console.log(map);

// Criar um novo mapa customizado
const novoMapa = dataManager.createCustomMap({
    name: 'Nível Difícil',
    level: 2,
    difficulty: 'hard',
    platforms: [
        { x: 400, y: 568, scaleX: 2, scaleY: 1, type: 'ground' },
        { x: 200, y: 400, scaleX: 1, scaleY: 1, type: 'floating' },
        { x: 600, y: 300, scaleX: 1, scaleY: 1, type: 'floating' }
    ],
    enemies: [
        { x: 300, y: 200, velocityX: -150, velocityY: 0, type: 'basic' },
        { x: 500, y: 200, velocityX: 150, velocityY: 0, type: 'basic' },
        { x: 700, y: 300, velocityX: -120, velocityY: 0, type: 'basic' }
    ],
    stars: {
        count: 15,
        startX: 20,
        startY: 0,
        stepX: 50,
        bounceY: { min: 0.3, max: 0.9 },
        velocity: { minX: -250, maxX: 250, y: 30 },
        points: 15
    }
});

// Usar o novo mapa
dataManager.setCurrentMap(novoMapa);

// Ver todos os mapas salvos
const mapas = dataManager.getAllMaps();
console.log('Mapas disponíveis:', mapas);

// Aumentar dificuldade do mapa atual
map.increaseDifficulty();
dataManager.saveMap(map);
```

### 💾 Exportar/Importar Dados

```javascript
// Exportar todos os dados
const dados = dataManager.exportData();
console.log(JSON.stringify(dados, null, 2));

// Copiar para clipboard
const json = JSON.stringify(dados);
navigator.clipboard.writeText(json);

// Importar dados
const dadosImportados = {
    // ... seu JSON aqui
};
dataManager.importData(dadosImportados);

// Ver informações de armazenamento
const info = dataManager.getStorageInfo();
console.log('Espaço usado:', info.totalSizeKB + ' KB');
```

### 🗑️ Limpar Dados

```javascript
// Limpar TODOS os dados (cuidado!)
dataManager.clearAllData();

// Resetar apenas personagem
dataManager.resetCharacter();

// Resetar apenas usuário
dataManager.resetUser();

// Resetar apenas mapa
dataManager.resetMap();
```

## 🎨 Exemplos Práticos

### Exemplo 1: Criar Personagem Rápido

```javascript
dataManager.updateCharacter({
    name: 'Flash',
    speed: 300,
    jumpPower: 450,
    color: 0xFFFF00  // Amarelo
});

// Recarregue a página para ver as mudanças
location.reload();
```

### Exemplo 2: Criar Mapa com Muitos Inimigos

```javascript
const mapaInferno = dataManager.createCustomMap({
    name: 'Modo Inferno',
    level: 10,
    difficulty: 'extreme',
    gravity: 400,
    enemies: [
        { x: 100, y: 100, velocityX: 200, velocityY: 0 },
        { x: 300, y: 150, velocityX: -180, velocityY: 0 },
        { x: 500, y: 200, velocityX: 220, velocityY: 0 },
        { x: 700, y: 250, velocityX: -200, velocityY: 0 },
        { x: 400, y: 100, velocityX: 150, velocityY: 0 }
    ]
});

dataManager.setCurrentMap(mapaInferno);
location.reload();
```

### Exemplo 3: Ver Estatísticas Completas

```javascript
const user = dataManager.getUser();
const character = dataManager.getCharacter();

console.log('========== ESTATÍSTICAS ==========');
console.log('Usuário:', user.username);
console.log('High Score:', user.highScore);
console.log('Total de Partidas:', user.gamesPlayed);
console.log('Vitórias:', user.gamesWon);
console.log('Taxa de Vitória:', user.getWinRate() + '%');
console.log('');
console.log('Personagem:', character.name);
console.log('Nível:', character.level);
console.log('XP:', character.experience);
console.log('Moedas:', character.coins);
console.log('Velocidade:', character.speed);
console.log('Poder de Pulo:', character.jumpPower);
console.log('==================');
```

## 🔍 Cores Hexadecimais Úteis

```javascript
// Cores para personalizar personagem
0xFF0000  // Vermelho
0x00FF00  // Verde
0x0000FF  // Azul
0xFFFF00  // Amarelo
0xFF00FF  // Magenta
0x00FFFF  // Ciano
0xFFFFFF  // Branco
0x000000  // Preto
0xFF8800  // Laranja
0x8800FF  // Roxo
0x00b300  // Verde padrão do jogo
```

## 📖 Propriedades Importantes

### Character
- `name` - Nome do personagem
- `level` - Nível
- `health` - Vida atual
- `maxHealth` - Vida máxima
- `speed` - Velocidade de movimento
- `jumpPower` - Poder de pulo
- `color` - Cor (hexadecimal)
- `experience` - Experiência
- `coins` - Moedas

### User
- `username` - Nome de usuário
- `highScore` - Pontuação máxima
- `totalScore` - Pontuação total
- `gamesPlayed` - Partidas jogadas
- `gamesWon` - Partidas vencidas
- `achievements` - Lista de conquistas
- `settings` - Configurações
- `statistics` - Estatísticas detalhadas

### Map
- `name` - Nome do mapa
- `level` - Nível
- `difficulty` - Dificuldade (easy, normal, hard, extreme)
- `platforms` - Array de plataformas
- `stars` - Configuração de estrelas
- `enemies` - Array de inimigos
- `playerSpawn` - Posição inicial do jogador
- `gravity` - Gravidade do mapa
- `completed` - Se foi completado

## 🚀 Dicas

1. **Sempre salve após modificar**: Use `dataManager.saveCharacter()`, `dataManager.saveUser()` ou `dataManager.saveMap()` após fazer mudanças.

2. **Recarregue a página**: Após modificar dados, recarregue a página para ver as mudanças no jogo.

3. **Faça backup**: Use `dataManager.exportData()` para criar backups dos seus dados.

4. **Teste gradualmente**: Teste uma mudança de cada vez para entender o impacto.

5. **Use o console**: O console do navegador (F12) é seu amigo para testar e debugar.

## 🎯 Próximos Passos

- Crie seus próprios mapas personalizados
- Experimente diferentes configurações de personagem
- Tente criar desafios únicos
- Compartilhe suas configurações com amigos
