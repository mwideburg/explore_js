
import Trunk from './scripts/objects/trunk'
import Top from './scripts/objects/top'
import Top2 from './scripts/objects/top2'
import { Group, Vector3 } from 'three';
// import Cloud from './scripts/objects/clouds';
import Sentinel from './scripts/objects/sentinels';
import Enemy from './scripts/enemies/enemy1';
import Orb from './scripts/objects/orb';
import EnemyOrb from './scripts/enemies/enemy1_orbs';
import SmallEnemy from './scripts/enemies/small_enemy';

const player = {health: 100}
let camera, scene, renderer, mixer;
let clouds
let orbs = []
let smallHit = false
let enemy
let controls;
let group
let cubeC
let vector = new THREE.Vector3(0, 0, - 1);
let objects = [];
let trees = [];
let raycaster;
let blocker = document.getElementById('blocker');
let instructions = document.getElementById('instructions');
let orbAlive = []
let smallEnemies = []
let hit = false
let wait
let orbHit = false
let test = new Vector3(0, 5, 0)
let enemyOrbs = []

// PLAYEWR SET UP

let orbCount = 0
let ammo = 50
let counterDisp = document.getElementById('orbCounter')
let ammoCount = document.getElementById('ammoCount')


function updateDisplay() {
    counterDisp.innerHTML = orbCount;
    ammoCount.innerHTML = ammo;
};
updateDisplay()


document.getElementById("restart").addEventListener("click", restartGame, true)
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
let run = false;
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
    scene.fog = new THREE.Fog(0xffffff, 0, 900);

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
            case 16: // d
                wait = performance.now()
                run = true;
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
            case 16: // d
                
                run = false;
                break;
        }
    };



    
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
    
    document.addEventListener("mousedown", shootOrb, true)
    function shootOrb(){
        // console.log("shoot")
        if(ammo > 0){


            let orbPos = raycaster.ray.origin.copy(controls.getObject().position);
            
            let traj = camera.getWorldDirection(vector)
            // console.log(traj)
            let orb = new Orb();
            
            orb.position.copy(orbPos)
            ammo -= 1
            updateDisplay();
            scene.add(orb)
            orbAlive.push(orb)
        }else{
            // document.getElementById(ammoCount)
            return null
        }
        
        
       
        

    }
    


    
    
    
    /// DESIGN


    // SENTINELS
    
    for (let i = 0; i < 10; i++) {
        const sentinel = new Sentinel;

        const light = new THREE.PointLight("rgb(255, 222, 84)", 15, 100);
        const sent_light = new THREE.Group()
        sentinel.position.x = Math.floor(Math.random() * 20 - 9) * 40;
        sentinel.position.z = Math.floor(Math.random() * 20 - 5) * 60;
        sentinel.position.y = Math.floor(Math.random() * 30);
        light.position.x = sentinel.position.x
        light.position.y = sentinel.position.y
        light.position.z = sentinel.position.z
        sent_light.add(sentinel)
        sent_light.add(light)
        scene.add(sent_light)
        orbs.push(sent_light)
        
    }

    // SMALL ENEMIES
    for (let i = 0; i < 6; i++) {
        const small = new SmallEnemy;

        const light = new THREE.PointLight("rgb(250, 0, 0)", 5, 100);
        const smallEnemy = new THREE.Group()
        small.position.x = Math.floor(Math.random() * 20 - 9) * 40;
        small.position.z = Math.floor(Math.random() * 20 - 5) * 10;
        small.position.y = 10;
        light.position.x = small.position.x
        light.position.y = small.position.y + 20
        light.position.z = small.position.z
        smallEnemy.add(small)
        smallEnemy.add(light)
        scene.add(smallEnemy)
        smallEnemy.start = small.position
        
        smallEnemies.push(smallEnemy)

    }
    
    enemy = new Enemy();
    enemy.position.x = 120;
    enemy.position.z = 150;
    enemy.position.y = 50;
    enemy.health = 100;
    scene.add(enemy)
   


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
    if ((tree.position.x < (enemy.position.x + 100) && tree.position.x > (enemy.position.x - 100)) && (tree.position.z < (enemy.position.z + 100) && tree.position.z > (enemy.position.z - 500))) {

        i -= 1
    } else {
        scene.add(tree)
        trees.push(tree)
    }
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
    if ((tree.position.x < (enemy.position.x + 100) && tree.position.x > (enemy.position.x - 100)) && (tree.position.z < (enemy.position.z + 100) && tree.position.z > (enemy.position.z - 500))){
        
        i -= 1
    }else{
        scene.add(tree)
        trees.push(tree)
    }
    
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
    cubeA.name = "elevator"

    var cubeB = new THREE.Mesh(geometry, material);
    cubeB.position.set(20, 200, 10);
    
    cubeB.name = "elevator"

    

    group = new THREE.Group();
    group.add(cubeA);
    group.add(cubeB);
    group.name = "elevator"
    objects.push(cubeA)
    objects.push(cubeB)
    scene.add(group);


    cubeC = new THREE.Mesh(geometry2, material);
    cubeC.position.set(20, 10, 400);
    scene.add(cubeC)
    
    // ENEMY
    
    
    

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


    // ANIMATION LOOP

    var lim = 400;
    var clock = new THREE.Clock();
    var speed = 30;
    var dir = new THREE.Vector3(0, 0, 1).normalize();
    var move = new THREE.Vector3();
    var pos = new THREE.Vector3();
    var lookAt = new THREE.Vector3();

    renderer.setAnimationLoop(() => {
        move.copy(dir).multiplyScalar(speed * clock.getDelta());
        orbs.forEach(sent => {
            pos.copy(sent.children[0].position).add(move);
            if (Math.abs(pos.length()) >= lim) {
                dir.negate();
            }
            sent.children[0].position.copy(pos);
            sent.children[1].position.copy(pos);
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

    addEnemyOrb();
    

}

function addEnemyOrb(){
    setInterval(() => {
        
        const bullet = new EnemyOrb
        bullet.position.copy(enemy.position)
        bullet.position.y -= 15
        bullet.traj = raycaster.ray.origin.copy(controls.getObject().position);
        console.log("created orb")
        enemyOrbs.push(bullet)
        scene.add(bullet)
        
    }, 3000)
}

function animateEnemyOrbs(){
    const person = raycaster.ray.origin.copy(controls.getObject().position);
    
    
    if(enemyOrbs.length < 5){
        enemyOrbs.forEach((bullet) => {
            let array = [bullet.traj.x - enemy.position.x, bullet.traj.z - enemy.position.z, (bullet.traj.y - enemy.position.y + 10)]
            const mag = Math.sqrt(array.reduce((acc, ele) => acc + (ele * ele)))
            let unitVector = array.map(ele => ele/mag)
            
            const radian = bullet.position.angleTo(bullet.traj)
            bullet.translateX(unitVector[0]* 5);
            bullet.translateZ(unitVector[1]* 5);
            bullet.translateY(unitVector[2]* 5);
         
        })

    }else{
        console.log("DELETE orbs")
        enemyOrbs.forEach((bullet) => {
            scene.remove(bullet)
        })
        enemyOrbs = []
    }
}

// Not sure what this does, but seemed legit from the source code
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function checkCollisions(pos){
  
    orbs.forEach((orb, index) => {
    //     let enemy = sent.position
        const objPos = orb.children[0].position
        if (
            (pos.x >= (objPos.x - 10) && pos.x <= (objPos.x + 10)) &&
            (pos.y >= (objPos.y - 10) && pos.y <= (objPos.y + 10)) &&
            (pos.z >= (objPos.z - 10) && pos.z <= (objPos.z + 10))
        ){
           updatePlayerHealth()
            updateDisplay();
            remove(orb, index)
        }})
    enemyOrbs.forEach((orb, index) => {
        trees.forEach((tree) => {
        
        const objPos = orb.position
        const treePos = tree.position
        if (
            (treePos.x >= (objPos.x - 5) && treePos.x <= (objPos.x + 5)) &&
            (treePos.z >= (objPos.z - 5) && treePos.z <= (objPos.z + 5))
            ){
                
                
            updateDisplay();
            removeEnemyOrb(orb, index)
            }
        })
    })
    
    trees.forEach((tree) => {
        
        let pos = raycaster.ray.origin.copy(controls.getObject().position);
        let posX = Math.floor(pos.x)
        let posZ = Math.floor(pos.z)
        if(moveForward){
            posZ -= 3
        }
        if(moveBackward){
            posZ += 3
        }
        if(moveLeft){
            posZ -= 3
        }
        if(moveRight){
            posZ += 3
        }
        
        
        
        if ((tree.position.x + 5  >= posX && tree.position.x - 5 <= posX) && (tree.position.z + 5 >= posZ && tree.position.z - 5 <= posZ)){
            console.log("TREEE")
            moveBackward = false
            moveForward = false
            moveLeft = false
            moveRight = false
        }
    })
    
    if (cubeC){
        let ammoPos = cubeC.position
        if (
            (pos.x >= (ammoPos.x - 10) && pos.x <= (ammoPos.x + 10)) &&
            (pos.y >= (ammoPos.y - 10) && pos.y <= (ammoPos.y + 10)) &&
            (pos.z >= (ammoPos.z - 10) && pos.z <= (ammoPos.z + 10))
        ) {
            ammo += 30
            scene.remove(cubeC)
            cubeC = false
            updateDisplay(); 
        }
    }
    if (enemy.health > 0) {
        let enemyPos = enemy.position
        if (
            (pos.x >= (enemyPos.x - 50) && pos.x <= (enemyPos.x + 50)) &&
            (pos.y >= (enemyPos.y - 50) && pos.y <= (enemyPos.y + 50)) &&
            (pos.z >= (enemyPos.z - 50) && pos.z <= (enemyPos.z + 50))
        ) {
            console.log("hit")
            hitUser()
        }
    }
    if (enemyOrbs.length > 0) {
        enemyOrbs.forEach((enemy, index) => {
            let enemyPos = enemy.position
            if (
                (pos.x >= (enemyPos.x - 13) && pos.x <= (enemyPos.x + 13)) &&
                (pos.y >= (enemyPos.y - 13) && pos.y <= (enemyPos.y + 13)) &&
                (pos.z >= (enemyPos.z - 13) && pos.z <= (enemyPos.z + 13))
            ) {
                console.log("hit")
                orbHitUser(enemy, index)
            }

        })
    }
    if (smallEnemies.length > 0) {
        smallEnemies.forEach((enemy, index) => {
            if (enemy != "undefined") {
            let enemyPos = enemy.children[0].position
            if (
                (pos.x >= (enemyPos.x - 10) && pos.x <= (enemyPos.x + 10)) &&
                (pos.y >= (enemyPos.y - 10) && pos.y <= (enemyPos.y + 10)) &&
                (pos.z >= (enemyPos.z - 10) && pos.z <= (enemyPos.z + 10))
            ) {
                console.log(smallEnemies)
                
                smallEnemyHit()
                removeSmallEnemy(enemy, index)
            }
        }
        })
    }
}

function checkOrbCollision(orb, index, object){
    let pos = orb.position
    let enemyPos = object.position
    
    
    if (
        (pos.x >= (enemyPos.x - 50) && pos.x <= (enemyPos.x + 50)) &&
        (pos.y >= (enemyPos.y - 50) && pos.y <= (enemyPos.y + 50)) &&
        (pos.z >= (enemyPos.z - 50) && pos.z <= (enemyPos.z + 50))
    ) {
        console.log("hit")
        scene.remove(orb)
        orbAlive.splice(index, 1)
        
   
        enemy.material.color.r -= .05;
        enemy.material.color.g += .05;
        if(enemy.health <= 0){
            scene.remove(enemy)
        }
        enemy.health -= 5
            

    }
    smallEnemies.forEach((small, index) => {
        if(small != "undefined"){

            let move = false
            let smallPos = small.children[0].position
            
            if (
                (pos.x >= (smallPos.x - 8) && pos.x <= (smallPos.x + 8)) &&
                (pos.y >= (smallPos.y - 8) && pos.y <= (smallPos.y + 8)) &&
                (pos.z >= (smallPos.z - 8) && pos.z <= (smallPos.z + 8))
            ) {
                move = true
                console.log("hit")
                scene.remove(orb)
                delete orbAlive[index]
                small.children[0].health -= 5
                console.log(small.children[0].health)
                
                small.children[0].hit = true
                
                small.children[1].intensity += 15;
    
                if (small.children[0].health <= 0){
                    removeSmallEnemy(small, index)
                    
                }
               
                
                    
        
            }
        }

    })
}




function animateOrb(orb, index, traj) {
    orb.position.x += (traj.x * 10)
    orb.position.z += (traj.z * 10)
    orb.position.y += (traj.y * 10)
    setTimeout(() => {
        delete orbAlive[index]
        scene.remove(orb)
    }, 2000)
    
}


function updatePlayerHealth(){
    player.health += 20
    const playerHealth = player.health
    document.getElementById("player-health").style.width = `${playerHealth}%`
}
function orbHitUser(orb, index){
    removeEnemyOrb(orb, index)
    const div = document.getElementById("hurt")
    div.style.display = "inline"
    orbHit = true
    player.health -= 20
    const playerHealth = player.health
    document.getElementById("player-health").style.width = `${playerHealth}%`
    console.log("HIT")
    
    setTimeout(() => {
        orbHit = false
        div.style.display = "none"
        
    }, 500)
}

function wallOstacle() {
    let trajectory = camera.getWorldDirection(vector)
    let person = raycaster.ray.origin.copy(controls.getObject().position);
    // console.log(traj)
    // console.log(person)
    orb.position.x += Math.sin(camera.rotation.y)
    orb.position.z += Math.cos(camera.rotation.y)
    
}
function endGame(){
    document.getElementById("endgame").style.display = "block"
    cancelAnimationFrame(start)

}
function restartGame(){
    player.health = 100;
    document.getElementById("endgame").style.display = "none"
    init()
    animate()
    
    
    
}
function remove(orb, index){
    
    
    scene.remove(orb)
    delete orbs[index]
}
function removeEnemyOrb(orb, index){
    scene.remove(orb)
    delete enemyOrbs[index]
}
function removeAllOrbs(){
    enemyOrbs.forEach((orb) => {
        scene.remove(orb)

    })
    enemyOrbs = []
}

function animateSmallEnemies(){
    let copy = smallEnemies
    copy.forEach((orb, index) => {
    let pos = raycaster.ray.origin.copy(controls.getObject().position);
    const array = [pos.x - orb.start.x, pos.z - orb.start.z]
    
        
        const mag = Math.sqrt(array.reduce((acc, ele) => acc + (ele * ele)))
        const unitVector = array.map(ele => ele / mag)
        if(!orb.children[0].hit){
           
                orb.children[0].position.x += (unitVector[0] * .8);
                orb.children[1].position.x += (unitVector[0] * .8);
                orb.children[0].position.z += (unitVector[1] * .8);
                orb.children[1].position.z += (unitVector[1] * .8);

            
            
    
        }
        if(orb.children[0].hit){
            
            orb.children[0].position.x += ((unitVector[0] * -1) * 10);
            orb.children[1].position.x += ((unitVector[0] * -1) * 10);
            orb.children[0].position.z += ((unitVector[1] * -1) * 10);
            orb.children[1].position.z += ((unitVector[1] * -1) * 10);
            delayTrigger(orb.children[0])
            return null
        }

    })
    
    


    
    
    

}

function delayTrigger(orb){
    setTimeout(() => {orb.hit = false}, 500)
    animateSmallEnemies
}
function removeSmallEnemy(small, index){
    scene.remove(small)
    delete smallEnemies[index]
    console.log(smallEnemies)
    


    
    
}
function hitUser(){
    hit = true
    console.log("HIT")
    setTimeout(() => {
        hit = false
    }, 500)
}
function smallEnemyHit(){
    // hit = true
    console.log("Small Enemy Hit")
    player.health -= 20
    const div = document.getElementById("hurt")
    div.style.display = "inline"
    const playerHealth = player.health
    document.getElementById("player-health").style.width = `${playerHealth}%`
    setTimeout(() => {
        orbHit = false
        div.style.display = "none"

    }, 500)
    // setTimeout(() => {
    //     hit = false
    // }, 500)
}

function animateCube(){
    group.position.y += 1
}

function checkCube(arr){
    arr[0].object.name === "elevator"
    
}
const limitEnemy = 50
let startEnemy = 0
let highEnemy = 100
function animateEnemy(){
   

    enemy.material.color.r = .9;
    if(startEnemy < limitEnemy){
        enemy.translateY(.2)
        startEnemy += .1
        console.log(startEnemy)
    }
    if (startEnemy === limitEnemy){
        highEnemy -= .1
        enemy.translateY(- .2)
        
    }
    if(highEnemy === limitEnemy){
        startEnemy = 0;
        highEnemy = 100
    }

}
let bang = 0;
let start
// Animate
function animate() {
    const traj = camera.getWorldDirection(vector)
    start = requestAnimationFrame(animate);
    if(orbAlive.length > 0){

        orbAlive.forEach((orb, index) => {animateOrb(orb, index, traj)
        checkOrbCollision(orb, index, enemy)
        })
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
        if (run){
            
            if(time - wait < 3000)
            velocity.z -= 400.0 * delta;
        } 
        if (isOnObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
            if (checkCube(intersections)){
                animateCube()
            }
        }
        
        if(hit){
            velocity.z += 10000.0 * delta;
        }
        if(orbHit){
            velocity.z += 2000.0 * delta;
        }
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);
        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        if(enemy.health > 0 && smallEnemies.every(ele => ele === "undefined")){
            
            animateEnemy()
            animateEnemyOrbs()
            
            
        }
        
        if(enemy.health <= 0){
            removeAllOrbs()
        }
        if(player.health <= 0){
            endGame()
                   
        }
        if (smallEnemies.length > 0) {
            
            
                animateSmallEnemies()

        
        }
        
        prevTime = time;
    }
    

    

    


    renderer.render(scene, camera);
}


