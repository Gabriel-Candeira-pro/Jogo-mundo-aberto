# chunkGenerator

Módulo responsável pela geração procedural de chunks do mundo do jogo.

## Visão Geral
Esta pasta contém a lógica para geração de mapas (chunks), biomas, obstáculos, áreas de água e utilidades relacionadas. O código foi modularizado seguindo o princípio da responsabilidade única, facilitando manutenção, testes e extensibilidade.

## Estrutura dos Arquivos

- **index.js**: Função principal `generateChunk` e exportação central do módulo.
- **biomes.js**: Definição dos biomas disponíveis e função para seleção aleatória de bioma.
- **chunkUtils.js**: Utilidades para manipulação de posições, seeds e configuração padrão de chunk.
- **meta.js**: Função para construir os metadados do chunk.
- **obstacles.js**: Funções para geração de obstáculos e áreas de água, além de detecção de colisão.
- **utils/**
  - **math.js**: Funções matemáticas auxiliares (ex: clamp, randomInt).
  - **random.js**: Funções de hash e randomização determinística.

## Principais Funções

- `generateChunk(worldSeed, chunkX, chunkY, chunkConfig)`: Gera um chunk proceduralmente.
- `pickBiome(random)`: Seleciona um bioma aleatório.
- `createObstacle(...)`: Cria um obstáculo sem sobreposição.
- `createWaterAreas(...)`: Gera áreas de água (lagos) no chunk.
- `getChunkWorldOrigin(chunkX, chunkY, chunkConfig)`: Calcula a origem mundial de um chunk.
- `toWorldPosition(chunkX, chunkY, localX, localY, chunkConfig)`: Converte posição local para mundial.
- `toLocalPosition(worldX, worldY, chunkConfig)`: Converte posição mundial para local e chunk.

## Exemplo de Uso

```js
const { generateChunk } = require('./chunkGenerator');

const chunk = generateChunk('seed123', 0, 0);
console.log(chunk);
```

## Extensibilidade
- Para adicionar novos biomas, edite `biomes.js`.
- Para alterar regras de obstáculos ou lagos, edite `obstacles.js`.
- Para mudar configurações padrão, edite `chunkUtils.js`.

## Manutenção
- Cada arquivo é responsável por uma parte específica da geração procedural.
- Alterações em um aspecto (ex: biomas) não afetam outros módulos.

---

Dúvidas ou sugestões? Consulte o README principal do projeto ou abra uma issue.
