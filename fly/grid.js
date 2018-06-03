class Grid {
    constructor(width, height, nullValue) {
        this.width = width;
        this.height = height;

        this.rawItems = null;
        this.reset(nullValue);
        this.length = this.width * this.height;
    }

    reset(nullValue) {
        this.rawItems = [];
        for (var i = 0; i < this.length; i++) {
            this.rawItems.push(nullValue != null? nullValue:null);
        }
    }

    has(value) { 
        for (var i = 0; i < this.length; i++) {
            if (this.rawItems[i] == value) {
                return true;
            }
        }
        return false;
    }

    clone() {
        var grid = new Grid(this.width, this.height);
        for (var i = 0; i < this.length; i++) {
            grid.rawItems[i] = this.rawItems[i]? this.rawItems[i].clone():this.rawItems[i];
        }
        return grid;
    }

    getIndex(x, y) {
        return (x * this.width) + y;
    }

    get(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
        return this.rawItems[this.getIndex(x, y)];
    }

    set(x, y, value) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
        this.rawItems[this.getIndex(x, y)] = value;
    }

    toString(nullValue) {
        var string = '';
        for (var i = 0; i < this.length; i++) {
            if (i % this.width == 0) string += '|\n';

            if (this.rawItems[i] == nullValue) string += '?,';
            else {
                var substring = this.rawItems[i].toString();
                if (substring.length > 4) substring = substring.substring(0, 4);
                string += substring + ',';
            }
        }
        return string.substring(0, string.length - 2);
    }

    forEach(callback, random) {
        if (random) {
            var indices = [];
            for (var i = 0; i < this.width; i++) indices.splice(parseInt(Math.random() * indices.length), 0, i);

            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    callback(indices[x], y);
                }   
            }
        } else {
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    callback(x, y);
                }   
            }
        }
    }
}