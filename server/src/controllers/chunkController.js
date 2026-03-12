const { generateChunk } = require('../services/chunkGeneratorService');
const { BIOMES } = require('../services/chunkGenerator/biomes');
const { readJSON } = require('../utils/fileStorage');
const { getGlobalMap } = require('../services/multiplayerService');
const { WORLD_SEED } = require('../config/env');

module.exports = {
    async getChunk(req, res) {
        try {
            const chunkX = parseInt(req.query.x, 10);
            const chunkY = parseInt(req.query.y, 10);
            if (isNaN(chunkX) || isNaN(chunkY)) {
                return res.status(400).json({ error: 'Coordenadas chunkX e chunkY inválidas' });
            }

            const globalMapResult = await getGlobalMap();
            const storedSeed = globalMapResult && globalMapResult.data && globalMapResult.data.worldSeed;
            const worldSeed = storedSeed || WORLD_SEED || 'gayme-world-seed';

            const chunk = generateChunk(worldSeed, chunkX, chunkY);
            // Log básico para depuração: coordenadas solicitadas e bioma gerado
            try {
                console.log(`[ChunkController] Solicitação chunk x=${chunkX} y=${chunkY} -> biome=${chunk && chunk.biome}`);
            } catch (e) {
                console.log('[ChunkController] Solicitação chunk (erro ao logar biome)');
            }

            // Segurança adicional: assegurar que chunk.biome contenha um id válido
            try {
                const biomeId = chunk && chunk.biome;
                const valid = BIOMES.some(b => b.id === biomeId);
                if (!valid) {
                    console.warn(`[ChunkController] Biome inválido encontrado (${biomeId}), aplicando fallback para ${BIOMES[0].id}`);
                    chunk.biome = BIOMES[0].id;
                }
            } catch (e) {
                // Em caso de erro inesperado, garantir fallback
                if (chunk) chunk.biome = BIOMES[0].id;
            }

            const chunkDeltas = await readJSON('chunk_deltas.json');
            const key = `${chunkX}:${chunkY}`;
            let deltas = [];
            if (chunkDeltas && chunkDeltas.chunk_deltas && chunkDeltas.chunk_deltas[key]) {
                deltas = chunkDeltas.chunk_deltas[key];
            }

            for (const delta of deltas) {
                if (delta.op === 'remove' && delta.type && delta.id) {
                    if (Array.isArray(chunk[delta.type])) {
                        chunk[delta.type] = chunk[delta.type].filter(obj => obj.id !== delta.id);
                    }
                }
                if (delta.op === 'add' && delta.type && delta.data) {
                    if (Array.isArray(chunk[delta.type])) {
                        chunk[delta.type].push(delta.data);
                    }
                }
            }

            // Log final da resposta (campo biome + resumo)
            console.log(`[ChunkController] Enviando chunk ${chunkX}:${chunkY} biome=${chunk && chunk.biome} deltas=${deltas.length}`);
            return res.json({ success: true, chunk, deltas });
        } catch (error) {
            console.error('Erro ao gerar chunk:', error);
            return res.status(500).json({ error: 'Erro ao gerar chunk' });
        }
    }
};
