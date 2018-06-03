function avg(list) {
    var total = 0;
    for (var i = 0; i < list.length; i++) {
        total += list[i];
    }
    return total / list.length;
}


Math.getBaseLog = function(x, y) {
    return Math.log(y) / Math.log(x);
}

class TerrainGenerator {
    fill(grid, range, x, y) {}

    isValid(width, height) {
        return true;
    }

    shouldLinkEdges() {
        return true;
    }
}

class DiamondGenerator extends TerrainGenerator {
    isValid(width, height) {
        return !(Math.getBaseLog(2, width - 1) % 1 != 0 || Math.getBaseLog(2, height - 1) % 1 != 0)
    }

    fill(grid, range, x, y) {
        if (!grid.get(0, 0)) grid.set(0, 0, this.genRand(range));
        if (!grid.get(0, grid.width - 1)) grid.set(0, grid.width - 1, this.genRand(range));
        if (!grid.get(grid.height - 1, 0)) grid.set(grid.height - 1, 0, this.genRand(range));
        if (!grid.get(grid.height - 1, grid.width - 1)) grid.set(grid.height - 1, grid.width - 1, this.genRand(range));

        while (grid.has(null)) {
            this.step(this.outwardsDiamond, grid, range);
            this.step(this.outwardsSquare, grid, range);
        }
    }

    genRand(range) {
        return (Math.random() - 0.5) * range * Math.random() * 2;
    }

    step(callback, grid, range) {
        var additions = [];

        grid.forEach(function(x, y) {
            if (grid.get(x, y)) return;

            var result = callback(x, y, grid);
            if (result) additions.push({x: x, y: y, avg: result});
        });

        additions.forEach(element => {
            grid.set(element.x, element.y, element.avg + this.genRand(range));
        });
    }

    outwardsDiamond(x, y, grid) {
        // alert('d1')
        var i = 0;
        while (true) {
            var xm = x - i,
                xp = x + i,
                ym = y - i,
                yp = y + i;

            if (xm < 0 || ym < 0 || xp >= grid.width || yp >= grid.height) return false;
            
            var tl = grid.get(xm, ym),
                tr = grid.get(xp, ym),
                bl = grid.get(xm, yp),
                br = grid.get(xp, yp);

            if (tl && tr && bl && br)
                return avg([tl, tr, bl, br]);
            else if (tl || tr || bl || br)
                return false;
            i++;
        }
    }

    outwardsSquare(x, y, grid) {
        // alert('s1')
        var i = 0;
        while (true) {
            var xm = x - i,
                xp = x + i,
                ym = y - i,
                yp = y + i;

            var out = 0;
            if (xm < 0) out++;
            if (ym < 0) out++;
            if (xp >= grid.width) out++;
            if (yp >= grid.height) out++;

            if (out >= 2) return false;

            var l = grid.get(xm, y),
                r = grid.get(xp, y),
                t = grid.get(x, ym),
                b = grid.get(x, yp);
            
            var valid = [];
            if (l) valid.push(l);
            if (r) valid.push(r);
            if (t) valid.push(t);
            if (b) valid.push(b);

            if (valid.length >= 3) {
                return avg(valid);
            } else if (valid.length != 0)
                return false;
            
            i++;
        }
    }
}