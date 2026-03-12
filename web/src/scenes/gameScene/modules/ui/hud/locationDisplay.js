// Responsabilidade única: atualizar a exibição de localização do jogador
export function attachLocationDisplay(GameSceneClass) {
    GameSceneClass.prototype.updateLocationDisplay = function updateLocationDisplay() {
        try {
            const tm = this.tileMovement || {};
            const chunkX = (tm.chunkX != null) ? tm.chunkX : 0;
            const chunkY = (tm.chunkY != null) ? tm.chunkY : 0;
            const tileX = (tm.currentTileX != null) ? tm.currentTileX : 0;
            const tileY = (tm.currentTileY != null) ? tm.currentTileY : 0;
            // Tenta obter o bioma da fonte mais confiável disponível:
            // 1) this.mapData.biome (mapa central)
            // 2) chunkCache no chunk atual (carregado async)
            // 3) fallback 'desconhecido'
            let biome = (this.mapData && this.mapData.biome) ? this.mapData.biome : null;
            if (!biome) {
                const key = `${chunkX}:${chunkY}`;
                const cached = (this.chunkCache && this.chunkCache[key]) ? this.chunkCache[key] : null;
                if (cached && cached.biome) {
                    biome = cached.biome;
                }
            }
            if (!biome) biome = 'desconhecido';
            if (this.locationText) {
                this.locationText.setText(`Bioma: ${biome} — ${chunkX}:${chunkY} (${tileX},${tileY})`);
            }
        } catch (err) {
            console.error('updateLocationDisplay error', err);
        }
    };
}
