Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
};

var waterheight = document.getElementById('waterheight');
waterheight.addEventListener('input', function() {
    document.getElementById('waterheightlabel').innerHTML = waterheight.value;
});

var worldrange = document.getElementById('worldrange');
worldrange.addEventListener('input', function() {
    document.getElementById('worldrangelabel').innerHTML = worldrange.value;
});

const worldtypes = [
    'Diamond-Square',
    'Perlin noise',
    'Simplex noise'
];

function updateSeedStatus(index) {
    var seed = document.getElementById('seed');
    if (index == 0) {
        seed.setAttribute('readonly', '');
        seed.style.color = 'gray';
        document.getElementById('seedwarning').style.color = 'black';
    } else {
        if (seed.hasAttribute('readonly')) seed.removeAttribute('readonly');
        seed.style.color = 'black';
        document.getElementById('seedwarning').style.color = 'white';
    }
}

var worldtype = document.getElementById('worldtype');
document.getElementById('worldtypeinc').addEventListener('click', function() {
    var index = (worldtypes.indexOf(worldtype.innerHTML) + 1) % worldtypes.length;
    worldtype.innerHTML = worldtypes[index];
    updateSeedStatus(index);
});

document.getElementById('worldtypedec').addEventListener('click', function() {
    var index = (worldtypes.indexOf(worldtype.innerHTML) - 1).mod(worldtypes.length);
    worldtype.innerHTML = worldtypes[index];
    updateSeedStatus(index);
});
updateSeedStatus(0);

const planetypes = [
    'X-15',
    'Boeing 777',
    'Lockheed SR-71'
];
var planetype = document.getElementById('planemodel');
document.getElementById('planemodelinc').addEventListener('click', function() {
    var index = (planetypes.indexOf(planetype.innerHTML) + 1) % planetypes.length;
    planetype.innerHTML = planetypes[index];
    loadModel(index);
});

document.getElementById('planemodeldec').addEventListener('click', function() {
    var index = (planetypes.indexOf(planetype.innerHTML) - 1).mod(planetypes.length);
    planetype.innerHTML = planetypes[index];
    loadModel(index);
});

function setSlider(name, pc) {
    var el = document.getElementById(name); 
    var size = el.getBoundingClientRect();
    el.children[0].style.width = (size.width * pc) + 'px';
}

var parent = document.getElementById('canvaswrapper');
var _size = window.getComputedStyle(parent);
var size = {width: _size.width.substring(0, _size.width.length - 2),
            height: _size.height.substring(0, _size.height.length - 2)};

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, size.width/size.height, 0.1, 1000);
scene.background = new THREE.Color(0xd3d3d3);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(window.devicePixelRatio);
parent.appendChild(renderer.domElement);

var loader = new THREE.ObjectLoader();

var controls = new THREE.OrbitControls(camera, renderer.domElement);
var plane = null;

function loadModel(i) {
    var model = models[i];

    scene.children = [];
    plane = loader.parse(model.model);
    scene.add(plane);
    camera.position.set(model.camera.position[0], model.camera.position[1], model.camera.position[2]);
    camera.rotation.set(model.camera.rotation[0], model.camera.rotation[1], model.camera.rotation[2]);
    controls.update();

    setSlider('speed', model.stats.speed / 4520);
    setSlider('handling', model.stats.handling);
}

loadModel(0);

var update = function() {
    plane.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

update();

document.getElementById('gobutton').addEventListener('click', function() {
    var string = 'fly/fly.html?';
    string += 'p=' + planetypes.indexOf(planetype.innerHTML);
    string += '&a=' + worldtypes.indexOf(worldtype.innerHTML);

    var seed = document.getElementById('seed').value;
    if (seed != '') string += '&s=' + seed;

    string += '&w=' + document.getElementById('waterheight').value;
    string += '&r=' + document.getElementById('worldrange').value;

    window.location.replace(string);
});