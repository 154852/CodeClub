class SimplexNoiseGenerator extends TerrainGenerator {
    constructor(multiplier, seed) {
        super();
        this.simplex = new Noise(seed? seed:Math.random());
        this.multiplier = multiplier;
    }

    fill(grid, range, chunkX, chunkY) {
        var realChunkX = chunkX * grid.width;
        var realChunkY = chunkY * grid.height;

        for (var x = 0; x < grid.width; x++) {
            for (var y = 0; y < grid.height; y++) {
                var h = this.simplex.simplex2(((realChunkX + y) - chunkX) * this.multiplier, ((realChunkY + x) - chunkY) * this.multiplier);
                grid.set(x, y, h * range);
            }
        }
    }

    shouldLinkEdges() {
        return false;
    }
}