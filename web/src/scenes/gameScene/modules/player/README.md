# Módulos do Jogador - Arquitetura Modular

Este diretório contém todos os módulos relacionados ao jogador, organizados seguindo o **Princípio de Responsabilidade Única (SRP)**.

## Estrutura

```
player/
├── movement.js                    # Orquestrador do movimento livre
├── movementTileBased.js           # Orquestrador do movimento tile-based
├── setup.js                       # Orquestrador do setup do jogador
│
├── movement/                      # Módulos de movimento livre
│   ├── inputDetection.js         # Detecção e bufferização de inputs
│   ├── physicsMovement.js        # Aplicação de física e aceleração
│   └── movementDebug.js          # Sistema de debug de movimento
│
├── tile-movement/                 # Módulos de movimento tile-based
│   ├── tileMovementState.js      # Gerenciamento de estado tile-based
│   ├── tileAnimation.js          # Interpolação de posição entre tiles
│   ├── tileInput.js              # Detecção de input para tiles
│   └── tileCollision.js          # Detecção de colisão em tiles
│
└── setup/                         # Módulos de setup do jogador
    ├── playerSprite.js           # Criação e configuração do sprite
    ├── playerPhysics.js          # Configuração de física
    └── playerDebug.js            # Ferramentas de debug visual
```

## Responsabilidades

### Movimento Livre (movement/)

#### `inputDetection.js`
- Inicializar buffer de inputs
- Decrementar buffer a cada frame
- Garantir que o teclado está habilitado
- Inicializar teclas
- Obter estado atual dos inputs (teclado + touch)
- Calcular vetor de input normalizado

#### `physicsMovement.js`
- Aplicar física quando não há input
- Calcular aceleração baseada em direção
- Aplicar boost de resposta em mudanças de direção
- Detectar jogador travado (input ativo mas parado)

#### `movementDebug.js`
- Inicializar sistema de debug
- Logar estado do teclado periodicamente
- Logar mudanças de input
- Logar estado sem input
- Logar aplicação de movimento
- Logar bloqueios por colisão
- Rastrear frames travados
- Alertar sobre inconsistências

### Movimento Tile-Based (tile-movement/)

#### `tileMovementState.js`
- Inicializar estado do sistema tile-based
- Alinhar jogador ao tile
- Desabilitar física durante movimento tile
- Calcular progresso do movimento
- Completar movimento entre tiles
- Iniciar novo movimento

#### `tileAnimation.js`
- Interpolar posição do jogador durante transição

#### `tileInput.js`
- Detectar próximo tile baseado em input
- Consumir tecla após iniciar movimento

#### `tileCollision.js`
- Verificar se um tile específico tem colisão
- Checar limites do mapa
- Detectar overlap com obstáculos/edifícios/água

### Setup (setup/)

#### `playerSprite.js`
- Criar sprite do jogador
- Configurar propriedades visuais (depth, bounce, tint)

#### `playerPhysics.js`
- Configurar gravidade zero do mundo
- Configurar drag e velocidade máxima
- Ajustar hitbox circular

#### `playerDebug.js`
- Criar círculo de debug visual
- Sincronizar círculo com posição do jogador
- Gerenciar cleanup do debug

## Uso

Os arquivos principais (`movement.js`, `movementTileBased.js`, `setup.js`) atuam como **orquestradores**, coordenando os módulos específicos:

```javascript
// Exemplo: movement.js
import { initInputBuffer, getInputState } from './movement/inputDetection.js';
import { calculateAcceleration } from './movement/physicsMovement.js';
import { logMovementApplication } from './movement/movementDebug.js';

export function attachMovementMethods(GameSceneClass) {
    GameSceneClass.prototype.handleMovement = function() {
        initInputBuffer(this);
        const inputState = getInputState(this);
        const { accelX, accelY } = calculateAcceleration(this, dirX, dirY);
        logMovementApplication(this, inputX, inputY, dirX, dirY, accelX, accelY);
    };
}
```

## Vantagens da Modularização

1. **Testabilidade**: Cada módulo pode ser testado isoladamente
2. **Manutenibilidade**: Alterações em uma responsabilidade não afetam outras
3. **Legibilidade**: Código mais limpo e fácil de entender
4. **Reutilização**: Módulos podem ser reutilizados em diferentes contextos
5. **Separação de Conceitos**: Debug, física, input e rendering são independentes

## Princípios Aplicados

- ✅ **Single Responsibility Principle (SRP)**: Cada módulo tem uma única razão para mudar
- ✅ **Separation of Concerns**: Input, física, debug e rendering são separados
- ✅ **DRY (Don't Repeat Yourself)**: Lógica comum é extraída para funções reutilizáveis
- ✅ **Composition over Inheritance**: Orquestradores compõem funcionalidades dos módulos
