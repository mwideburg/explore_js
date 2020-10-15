
import Trunk from './scripts/objects/trunk'
import Top from './scripts/objects/top'
import Top2 from './scripts/objects/top2'
import { Group } from 'three';
// import Cloud from './scripts/objects/clouds';
import Sentinel from './scripts/objects/sentinels';
import Enemy from './scripts/enemies/enemy1';
import Orb from './scripts/objects/orb';


let camera, scene, renderer, mixer;
let clouds
var geometry, material, mesh;
let orbs = []
let sentinels
let enemy
let controls;
let group
let cubeC
let vector = new THREE.Vector3(0, 0, - 1);
let objects = [];
let raycaster;
let blocker = document.getElementById('blocker');
let instructions = document.getElementById('instructions');
let orbAlive = []

// PLAYEWR SET UP

let orbCount = 0
let ammo = 10
let counterDisp = document.getElementById('orbCounter')
let ammoCount = document.getElementById('ammoCount')


function updateDisplay() {
    counterDisp.innerHTML = orbCount;
    ammoCount.innerHTML = ammo;
};
updateDisplay()

// https://www.html5rocks.com/en/tutorials/pointerlock/intro/
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if (havePointerLock) {
    let element = document.body;
    let pointerlockchange = function (event) {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = 'none';
        } else {
            controls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
        }
    };
    let pointerlockerror = function (event) {
        instructions.style.display = '';
    };
    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
    instructions.addEventListener('click', function (event) {
        instructions.style.display = 'none';
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if (/Firefox/i.test(navigator.userAgent)) {
            var fullscreenchange = function (event) {
                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                    document.removeEventListener('fullscreenchange', fullscreenchange);
                    document.removeEventListener('mozfullscreenchange', fullscreenchange);
                    element.requestPointerLock();
                }
            };
            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            element.requestFullscreen();
        } else {
            element.requestPointerLock();
        }
    }, false);
} else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}


init();
animate();


// Make variables

let controlsEnabled = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let orbVelocity = new THREE.Vector3();

// HERE IS WHEN WE START ADDIN THE WORLD

function init() {
    
    // Camera is place away from center
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 700
    

    // Make initial scene
    scene = new THREE.Scene();

    // Fog will make the 750 distance blurry
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    // Add hmisphere light
    let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    // Add a little spot light near stairs
    light = new THREE.SpotLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(20, 10, 100);
    scene.add(light);

    // Controls are confusing but just based it off of the source code of the example of PointerLockControls at three.js
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
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
                if (canJump === true) velocity.y += 350;
                canJump = false;
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
        }
    };



    
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
    
    document.addEventListener("mousedown", shootOrb, true)
    function shootOrb(){
        console.log("shoot")
        let orbPos = raycaster.ray.origin.copy(controls.getObject().position);
        
        let traj = camera.getWorldDirection(vector)
        console.log(traj)
        let orb = new Orb();
        
        orb.position.copy(orbPos)
        
        scene.add(orb)
        orbAlive.push(orb)
        
        
       
        

    }
    


    
    
    
    /// DESIGN


    // SENTINELS
    
    for (let i = 0; i < 10; i++) {
        const sentinel = new Sentinel;

        const light = new THREE.PointLight("rgb(255, 222, 84)", 15, 100);
        const sent_light = new THREE.Group()
        sentinel.position.x = Math.floor(Math.random() * 20 - 9) * 40;
        sentinel.position.z = Math.floor(Math.random() * 20 - 5) * 60;
        sentinel.position.y = Math.floor(Math.random() * 30) + 5;
        light.position.x = sentinel.position.x
        light.position.y = sentinel.position.y
        light.position.z = sentinel.position.z
        sent_light.add(sentinel)
        sent_light.add(light)
        scene.add(sent_light)
        orbs.push(sentinel)
        
    }
    
    
    
   


    /// TREESSSS


    for (let i = 0; i < 75; i++) {
        var trunk = new Trunk;
        var top = new Top;

        var tree = new THREE.Group();

        top.position.y = 50
        tree.add(trunk)
        tree.add(top)
        
    
    tree.position.x = Math.floor(Math.random() * 20 - 10) * 60;
    tree.position.z = Math.floor(Math.random() * 20 - 10) * 60;
    tree.position.y = Math.floor(Math.random() * 30) + 20;
    scene.add(tree)
    objects.push(tree)
    }

    // Trees 2
    for (var i = 0; i < 75; i++) {
        var trunk = new Trunk;
        var top = new Top2;

        var tree = new THREE.Group();

        top.position.y = 80
        tree.add(trunk)
        tree.add(top)
        
    
    tree.position.x = Math.floor(Math.random() * 20 - 10) * 60;
    tree.position.z = Math.floor(Math.random() * 20 - 10) * 60;
    tree.position.y = Math.floor(Math.random() * 30) + 10;
    scene.add(tree)
    objects.push(tree)
    }


    // Blue things in the sky????/
    // Come back and make this a constructor
    clouds = new THREE.Group();
    for (var i = 0; i < 250; i++) {
        var geometry = new THREE.ConeGeometry(5, 20, 32);
        var material = new THREE.MeshBasicMaterial({ color: "rgb(0, 202, 246)" });
        var cloud = new THREE.Mesh(geometry, material);

        cloud.position.x = Math.floor(Math.random() * 20 - 10) * 60;
        cloud.position.z = Math.floor(Math.random() * 20 - 10) * 60;
        cloud.position.y = Math.floor(Math.random() * 30) + 300;
        scene.add(cloud)
        clouds.add(mesh);
        objects.push(cloud)
    }
    scene.add(clouds)

    // CUBES
    // Come back and make this a constructor class
    geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    let geometry2 = new THREE.BoxBufferGeometry(10, 10, 10);
    material = new THREE.MeshBasicMaterial({ color: 0x00f000 });

    var cubeA = new THREE.Mesh(geometry, material);
    cubeA.position.set(200, 200, 0);

    var cubeB = new THREE.Mesh(geometry, material);
    cubeB.position.set(20, 200, 0);
    cubeC = new THREE.Mesh(geometry2, material);
    cubeC.position.set(20, 10, 600);
    

    group = new THREE.Group();
    group.add(cubeA);
    group.add(cubeB);
    objects.push(cubeA)
    objects.push(cubeB)
    scene.add(group);

    scene.add(cubeC)
    
    // ENEMY
    setTimeout(() => {
        enemy = new Enemy();
        enemy.position.x = 0;
        enemy.position.z = 500
        enemy.position.y = Math.floor(Math.random() * 30) + 5;
        scene.add(enemy)
    }, 10000)

    

    // SHOOTING





    // LIGHTS


    // Come back and make this a constructor class
    light = new THREE.PointLight(0xff0000, 15, 100);
    light.position.set(20, 0, 150);
    scene.add(light);
    

    var spotLight = new THREE.SpotLight(0xffffff, 10, 1000);
    spotLight.position.set(100, 1000, 100);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);
    
    

    // Come back and make this a constructor class
    // These are the steps leading to the next level
    geometry = new THREE.CylinderGeometry(20, 20, 4);
    for (var i = 0, l = geometry.faces.length; i < l; i++) {
        var face = geometry.faces[i];
        face.vertexColors[0] = new THREE.Color("rgb(100, 50, 20)")
        face.vertexColors[1] = new THREE.Color("rgb(100, 50, 20)")
        face.vertexColors[2] = new THREE.Color("rgb(100, 250, 250)")
    }
    let y = 30
    let x = 100
    let z = 150
    for (var i = 0; i < 20; i++) {
        material = new THREE.MeshBasicMaterial({ specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = x
        mesh.position.y = y
        mesh.position.z = z
        y += 30
        z -= 30
        scene.add(mesh);
        material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        objects.push(mesh);
    }
    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
    //
    window.addEventListener('resize', onWindowResize, false);


    var lim = 400;
    var clock = new THREE.Clock();
    var speed = 30;
    var dir = new THREE.Vector3(0, 0, 1).normalize();
    var move = new THREE.Vector3();
    var pos = new THREE.Vector3();
    var lookAt = new THREE.Vector3();

    renderer.setAnimationLoop(() => {
        
        move.copy(dir).multiplyScalar(speed * clock.getDelta());
        
        orbs.forEach((sent) => {
            pos.copy(sent.position).add(move);


            if (Math.abs(pos.length()) >= lim) {


                dir.negate();


            }

            sent.position.copy(pos);

            lookAt.copy(pos).add(dir);
        })
    })
    // GRASS

    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load('./src/images/grass.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

    mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), groundMaterial);
    mesh.position.y = 0;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;

    scene.add(mesh);

}



// Not sure what this does, but seemed legit from the source code
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function checkCollisions(pos){
    // debugger
    orbs.forEach((enemy, index) => {
    //     let enemy = sent.position
        
        const objPos = enemy.position
        
        if (
            (pos.x >= (objPos.x - 10) && pos.x <= (objPos.x + 10)) &&
            (pos.y >= (objPos.y - 10) && pos.y <= (objPos.y + 10)) &&
            (pos.z >= (objPos.z - 10) && pos.z <= (objPos.z + 10))
        ){
            orbCount ++
          
            
            updateDisplay();
            remove(index)

        }})
    if (cubeC){
        let ammoPos = cubeC.position
        if (
            (pos.x >= (ammoPos.x - 10) && pos.x <= (ammoPos.x + 10)) &&
            (pos.y >= (ammoPos.y - 10) && pos.y <= (ammoPos.y + 10)) &&
            (pos.z >= (ammoPos.z - 10) && pos.z <= (ammoPos.z + 10))
        ) {
            ammo += 30
        }

    }
    
        
    
}

function animateOrb(orb) {
    const traj = camera.getWorldDirection(vector)
    let person = raycaster.ray.origin.copy(controls.getObject().position);
    console.log(traj)
    // console.log(person)
    orb.position.x += (traj.x * 10)
    orb.position.z += (traj.z * 10)
    
}
function wallOstacle() {
    let traj = camera.getWorldDirection(vector)
    let person = raycaster.ray.origin.copy(controls.getObject().position);
    console.log(traj)
    // console.log(person)
    orb.position.x += Math.sin(camera.rotation.y)
    orb.position.z += Math.cos(camera.rotation.y)
    
}

function remove(index){
    const object = scene.getObjectById(orbs[index].parent.id)
    
    scene.remove(object)
    delete orbs[index]
}


// Animate
function animate() {
    requestAnimationFrame(animate);
    if(orbAlive.length > 0){

        orbAlive.forEach(orb => animateOrb(orb))
    }
    
    // This will give all the PointLock controls
    if (controlsEnabled) {
        raycaster.ray.origin.copy(controls.getObject().position);
        let pos = raycaster.ray.origin.copy(controls.getObject().position);
        checkCollisions(pos)
        raycaster.ray.origin.y -= 10;
        var intersections = raycaster.intersectObjects(objects);
       
        var isOnObject = intersections.length > 0;
       
        var time = performance.now();
        var delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        if (moveForward) velocity.z -= 400.0 * delta;
        if (moveBackward) velocity.z += 400.0 * delta;
        if (moveLeft) velocity.x -= 400.0 * delta;
        if (moveRight) velocity.x += 400.0 * delta;
        if (isOnObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);
        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        
        prevTime = time;
    }
    

    

    


    renderer.render(scene, camera);
}


