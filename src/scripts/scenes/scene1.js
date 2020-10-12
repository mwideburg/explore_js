
// import '../ship/ship.js';

var scene = new THREE.Scene();

// CAMERA
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// RENDER
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// OBJECTS
var geometry = new THREE.SphereGeometry(5, 32, 32);
var material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
var sphere = new THREE.Mesh(geometry, material);
// controls = new THREE.PointerLockControls(camera, renderer.domElement);
// controls.addEventListener('change', render)
var cube = new THREE.Mesh(geometry, material);


scene.add(sphere);
scene.add(cube);


// LIGHT
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 1000, 100);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add(spotLight);

// TEXTURE


// load a resource

starGeo = new THREE.Geometry();
for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * 600 - 300
    );
    starGeo.vertices.push(star);
}

// CONTROLS

let moveForward
let moveLeft
let moveRight
let moveBackward
let jump
let jumpdown
var onKeyDown = function (event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = true;
            break;
        case 37: // left
        case 65: // a
            moveLeft = true; break;
        case 40: // down
        case 83: // s
            moveBackward = true;
            break;
        case 39: // right
        case 68: // d
            moveRight = true;
            break;
        case 32: // space
            jump
            break;
    }
};
var onKeyUp = function (event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
        case 83: // s
            moveBackward = false;
            break;
        case 39: // right
        case 68: // d
            moveRight = false;
            break;
        case 32: // space
            jumpdown
            break;
    }
};
var light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    if(moveForward){camera.position.z -= 0.5;}
    if (moveBackward){camera.position.z += 0.5;}
    if(moveLeft){camera.position.x -= 0.5;}
    if(moveRight){camera.position.x += 0.5;}
    if (jump) { camera.position.y += 0.5; }
    if (jumpdown) { camera.position.y -= 0.5; }
    renderer.render(scene, camera);
}



animate();