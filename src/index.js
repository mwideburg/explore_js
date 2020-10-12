
import Sphere from './scripts/objects/sphere.js';
import SpotLight from './scripts/lights/spot_light.js';
import Ground from './scripts/ground/ground.js';

var scene = new THREE.Scene();

// CAMERA
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 5

// RENDER
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color('skyblue');
scene.fog = new THREE.Fog("rgb(255, 0, 0)", 500, 10000);
// var geometry, material, mesh;
// geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
// geometry.rotateX(- Math.PI / 2);
// for (var i = 0, l = geometry.vertices.length; i < l; i++) {
//     var vertex = geometry.vertices[i];
//     vertex.x += Math.random() * 20 - 10;
//     vertex.y += Math.random() * 2;
//     vertex.z += Math.random() * 20 - 10;
// }
// for (var i = 0, l = geometry.faces.length; i < l; i++) {
//     var face = geometry.faces[i];
//     face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
//     face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
//     face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
// }
// material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

let moveForward
let moveLeft
let moveRight
let moveBackward
let stop

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
        case 81: // space
            stop = true
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
        case 81: // space
            stop = false;
            break;
    }
};



// LIGHTS
var ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);
scene.add(new SpotLight(100, 1000, 100));


var gt = new THREE.TextureLoader().load("./src/images/space_ground.jpg");
var gg = new THREE.PlaneBufferGeometry(16000, 16000);
var gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });

var ground = new THREE.Mesh(gg, gm);
ground.rotation.x = - Math.PI / 2;
ground.material.map.repeat.set(64, 64);
ground.material.map.wrapS = THREE.RepeatWrapping;
ground.material.map.wrapT = THREE.RepeatWrapping;
ground.material.map.encoding = THREE.sRGBEncoding;
// note that because the ground does not cast a shadow, .castShadow is left false
ground.receiveShadow = true;

scene.add(ground)


document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);
let velocity = [0, 0]

function move(velocity){
    
    camera.position.z += velocity[1];
    camera.position.x += velocity[0]
}
function checkControls(velocity){
    
    if (moveForward) { velocity[1] -= 0.01; }
    if (moveBackward) { velocity[1] += 0.01; }
    if (moveLeft) { velocity[0] -= 0.01; }
    if (moveRight) { velocity[0] += 0.01; }
    if (stop) { velocity[0] = 0; velocity[1] = 0; }
    
  
    
}

function gravity(){

}

scene.add( new Sphere);


function animate() {
    requestAnimationFrame(animate);
    
    checkControls(velocity);
    move(velocity);
    
    
    
    renderer.render(scene, camera);
}



animate();