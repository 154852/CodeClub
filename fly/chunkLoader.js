Array.prototype.pushIfAbsent = function(value) {
    if (this.indexOf(value) == -1) this.push(value);
}

function euclidiean(x1, y1, x2, y2) {
    var xDiff = x2 - x1,
        yDiff = y2 - y1;
    return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
}

class ChunkLoader {
    constructor(radius, chunkWidth, chunkHeight, chunkHeightRange, graphicalWidth, graphicalHeight, generator, waterHeight, waterColor) {
        this.radius = radius;

        this.chunkWidth = chunkWidth;
        this.chunkHeight = chunkHeight;
        this.chunkHeightRange = chunkHeightRange;

        this.graphicalWidth = graphicalWidth;
        this.graphicalHeight = graphicalWidth;

        this.loaded = [];
        
        this.generator = generator;

        this.waterHeight = waterHeight;
        this.waterColor = waterColor;
        
        if (!this.generator.isValid(this.chunkWidth, this.chunkHeight))
            throw 'Invalid chunk width and height for generator';
    }

    setEdges(chunk, x, y) {
        var top = this.findChunkAt(x, y - 1);
        var left = this.findChunkAt(x - 1, y);
        var bottom = this.findChunkAt(x, y + 1);
        var right = this.findChunkAt(x + 1, y);

        var knownCorners = [];
        if (top) {
            for (var i = 0; i < this.chunkWidth; i++) chunk.grid.set(0, i, top.grid.get(this.chunkWidth - 1, i));
            knownCorners.pushIfAbsent(2);
            knownCorners.pushIfAbsent(0);
        }

        if (left) {
            for (var i = 0; i < this.chunkHeight; i++) chunk.grid.set(i, 0, left.grid.get(i, this.chunkHeight - 1));
            knownCorners.pushIfAbsent(2);
            knownCorners.pushIfAbsent(3);
        }

        if (bottom) {
            for (var i = 0; i < this.chunkWidth; i++) chunk.grid.set(this.chunkWidth - 1, i, bottom.grid.get(0, i));
            knownCorners.pushIfAbsent(3);
            knownCorners.pushIfAbsent(1);
        }

        if (right) { 
            for (var i = 0; i < this.chunkHeight; i++) chunk.grid.set(i, this.chunkHeight - 1, right.grid.get(i, 0));
            knownCorners.pushIfAbsent(0);
            knownCorners.pushIfAbsent(1);
        }
    }

    genRand() {
        return (Math.random() - 0.5) * this.chunkHeightRange * Math.random() * 2;
    }

    loadChunk(x, y) {
        var chunk = new Chunk(this.chunkWidth, this.chunkHeight, this.chunkHeightRange);
        this.loaded.push({
            x: x, y: y,
            obj: chunk
        });
        if (this.generator.shouldLinkEdges()) this.setEdges(chunk, x, y);
        this.generator.fill(chunk.grid, this.chunkHeightRange, x, y);
        return chunk;
    }

    findChunkAt(x, y) {
        var loaded = this.getLoaded(x, y);
        return loaded? loaded.obj:null;
    }

    getLoaded(x, y) {
        for (var i = 0; i < this.loaded.length; i++) {
            if (this.loaded[i].x == x && this.loaded[i].y == y) return this.loaded[i];
        }
    }

    update(playerX, playerZ) {
        var playerChunkX = Math.ceil(playerX / this.graphicalWidth);
        var playerChunkZ = Math.ceil(playerZ / this.graphicalHeight);

        var newItems = [];

        for (var i = 0; i < this.loaded.length; i++) {
            var loaded = this.loaded[i];
            if (euclidiean(playerChunkX, playerChunkZ, loaded.x, loaded.y) > this.radius) {
                loaded.mesh.visible = false;
            }
        }

        for (var x = 0; x < this.radius * 2; x++) {
            for (var y = 0; y < this.radius * 2; y++) {
                var xPos = (x - this.radius) + playerChunkX,
                    yPos = (y - this.radius) + playerChunkZ;
                
                var loaded = this.getLoaded(xPos, yPos);
                if (!loaded) {
                    var mesh = this.loadChunk(xPos, yPos).getMesh(this.graphicalWidth, this.graphicalHeight, this.waterHeight, this.waterColor);
                    this.getLoaded(xPos, yPos).mesh = mesh;

                    mesh.position.x = xPos * this.graphicalWidth;
                    mesh.position.z = yPos * this.graphicalHeight;
                    newItems.push(mesh);
                } else {
                    loaded.mesh.visible = true;
                }
            }   
        }

        return newItems;
    }
}