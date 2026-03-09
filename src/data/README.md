# Sistema de Dados

Este diretório contém o sistema completo de armazenamento de dados do jogo.

## 📁 Estrutura

```
data/
├── DataManager.js      # Gerenciador principal de armazenamento
├── index.js            # Exports centralizados
├── examples.js         # Exemplos de uso (console)
└── models/
    ├── Character.js    # Modelo de personagem
    ├── User.js         # Modelo de usuário
    └── Map.js          # Modelo de mapa
```

## 🚀 Uso Rápido

```javascript
import { dataManager } from './data/DataManager.js';

// Acessar dados
const character = dataManager.getCharacter();
const user = dataManager.getUser();
const map = dataManager.getMap();

// Atualizar dados
dataManager.updateCharacter({ speed: 200 });
dataManager.updateUser({ username: 'ProGamer' });

// Criar mapa customizado
const newMap = dataManager.createCustomMap({
    name: 'Meu Nível',
    difficulty: 'hard'
});
dataManager.setCurrentMap(newMap);
```

## 📚 Documentação

Veja o arquivo [GUIA_DADOS.md](../../GUIA_DADOS.md) na raiz do projeto para documentação completa.

## 🎮 Integração com o Jogo

O sistema já está integrado com `GameScene.js` e salva automaticamente:
- Dados do personagem (velocidade, cor, XP)
- Dados do usuário (pontuação, estatísticas)
- Configuração do mapa (plataformas, inimigos)
- Sessão de jogo (pulos, estrelas coletadas)

Todos os dados são persistidos no `localStorage` do navegador.
