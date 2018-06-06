function avg(list) {
    var total = 0;
    for (var i = 0; i < list.length; i++) {
        total += list[i];
    }
    return total / list.length;
}

class Chunk {
    constructor(width, height, range) {
        this.width = width;
        this.height = height;
        
        this.range = range;
        this.grid = new Grid(this.width, this.height);
    }

    getMesh(width, height, waterHeight, waterColor) {
        var planeGeom = new THREE.PlaneBufferGeometry(width, height, this.width - 1, this.height - 1);
        planeGeom.addAttribute('height', new THREE.BufferAttribute(new Float32Array(this.grid.rawItems), 1));

        var planeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                end: { value: new THREE.Vector3(178/255, 186/255, 187/255) },
                start: { value: new THREE.Vector3(30/255, 132/255, 73/255) }, //Dark - bottom
                range: { value: this.range },
                waterHeight: { value: waterHeight },
                waterColor: { value: waterColor }
            },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });

        var plane = new THREE.Mesh(planeGeom, planeMaterial);
        plane.rotation.x = -Math.PI / 2;

        return plane;
    }
}