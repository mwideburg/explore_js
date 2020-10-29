
import Trunk from './scripts/objects/trunk'
import Top from './scripts/objects/top'
import Top2 from './scripts/objects/top2'

// import Cloud from './scripts/objects/clouds';
import Sentinel from './scripts/objects/sentinels';
import Enemy from './scripts/enemies/enemy1';
import Orb from './scripts/objects/orb';
import EnemyOrb from './scripts/enemies/enemy1_orbs';
import SmallEnemy from './scripts/enemies/small_enemy';
import Level2 from './scripts/level_2/level_2';
import SoundEngine from './scripts/sound_engine/sound_engine';
import SoundFX from './scripts/sound_engine/sound_fx';
import { AnimationAction, Vector3 } from 'three';
let resetGame = false
let bossHealth = 200
let bossRate = 3000
let removeLevel = false
const player = {health: 100, start: true, arrows: false, shoot: false}
let camera, scene, renderer, mixer;
let clouds
let orbs = []
let smallHit = false
let enemy
let controls;
let group
let points = 0
let cubeA
let cubeB
let cubeC
let vector = new THREE.Vector3(0, 0, - 1);
let objects = [];
let level2Plane = [];
let level2;
let cubes = [];
let trees = [];
let raycaster;
let blocker = document.getElementById('blocker');
let instructions = document.getElementById('instructions');
let pointsHTML = document.getElementById('points');
let orbAlive = []
let smallEnemies = []
let soundEngine
let soundFX
let hit = false
var listener = new THREE.AudioListener();
let wait
let orbHit = false
let play = true
let enemyOrbs = []
let clickCount = false
let controlsEnabled = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let run = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
let sounds = {}
let hits = {}

// PLAYEWR SET UP

let orbCount = 0
let ammo = 50
let counterDisp = document.getElementById('orbCounter')
let ammoCount = document.getElementById('ammoCount')


function updateDisplay() {
    counterDisp.innerHTML = orbCount;
    ammoCount.innerHTML = ammo;
    pointsHTML.innerHTML = points;
};
updateDisplay()

function GainAmmo(){
    document.getElementById('ammoCount').style.color = "white";
    document.getElementById('ammoCount').style.opacity = 1;
    document.getElementById('ammoCount').style.size =" 20px";
    setTimeout(() => {
        document.getElementById('ammoCount').style.color = "black";
        document.getElementById('ammoCount').style.opacity = .7;
        document.getElementById('ammoCount').style.size = " 10px";
    }, 2000) 
}


document.getElementById("restart").addEventListener("click", restartGame, true)
document.getElementById("restart-level").addEventListener("click", restartGame, true)

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



// HERE IS WHEN WE START ADDIN THE WORLD

function init() {
    
    // Camera is place away from center
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 700
 
    

    // Make initial scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcce0ff);
    // Fog will make the 750 distance blurry
    scene.fog = new THREE.Fog(0xcce0ff, 0, 900);

    // Add hmisphere light
    let light = new THREE.HemisphereLight(0xcce0ff, 0xcce0ff, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    // Add a little spot light near stairs
    light = new THREE.SpotLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(20, 10, 100);
    scene.add(light);
    let keyDown = false
    // Controls are confusing but just based it off of the source code of the example of PointerLockControls at three.js
    controls = new THREE.PointerLockControls(camera, document.body);
    scene.add(controls.getObject());
    var onKeyDown = function (event) {
       
        
        
       
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
            
                keyDown = true
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
        soundEngine.move(keyDown)
    };
    var onKeyUp = function (event) {
        
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
            keyDown = false
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
        soundEngine.move(keyDown)
    };
    
    // WALL
    const spotEn = new THREE.PointLight("white", 10, 100);
    spotEn.position.x = 100
    spotEn.position.y = 10
    spotEn.position.z = 180
    scene.add(spotEn)
   


    

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
    
    document.addEventListener("mousedown", shootOrb, true)
    function shootOrb(){
        soundFX.shoot()
        if(player.shoot = false){
            player.shoot = true
        }
        if(clickCount){
            
            if(ammo > 0){
    
    
                let orbPos = raycaster.ray.origin.copy(controls.getObject().position);
                
                let traj = camera.getWorldDirection(vector)
                
                let orb = new Orb();
                
                orb.position.copy(orbPos)
                ammo -= 1
                updateDisplay();
                scene.add(orb)
                orbAlive.push(orb)
            }
        }
        if(!clickCount){
            clickCount = true
        }
        
        
       
        

    }
    


    soundEngine = new SoundEngine(camera, keyDown)
    soundFX = new SoundFX(camera)
    
    soundEngine.background()
    /// DESIGN


    // SENTINELS
    
    for (let i = 0; i < 10; i++) {
        const sentinel = new Sentinel;

        const light = new THREE.PointLight("rgb(255, 222, 84)", 10, 100);
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
        orbs.push(sent_light)
        
    }
    
    camera.add(listener);
    
    var audioLoader = new THREE.AudioLoader();
    // SMALL ENEMIES
    for (let i = 0; i < 6; i++) {
        const small = new SmallEnemy(camera);
        
        sounds[i] = new THREE.PositionalAudio(listener);
        hits[i] = new THREE.PositionalAudio(listener);
      
        // create the PositionalAudio object (passing in the listener)
        

        // load a sound and set it as the PositionalAudio object's buffer
        
        // var audioLoader2 = new THREE.AudioLoader();
        audioLoader.load('./src/sounds/boss.mp3', function (buffer) {
            sounds[i].setBuffer(buffer);
            sounds[i].setRefDistance(20);
            sounds[i].setVolume(1)
            sounds[i].setRolloffFactor(5)
            // sound.setMaxDistance(10)
            sounds[i].setLoop(true)
            if(!sounds[i].isPlaying){

                sounds[i].play();
            }
        });
        
        audioLoader.load('./src/sounds/hit.mp3', function (buffer) {
            hits[i].setBuffer(buffer);
            hits[i].setRefDistance(50);
            hits[i].setVolume(1)
            hits[i].setRolloffFactor(5)
            // sound.setMaxDistance(10)
            hits[i].setLoop(false)
            
        });
        
        
        
        const light = new THREE.PointLight("rgb(250, 0, 0)", 20, 100);
        const smallEnemy = new THREE.Group()
        small.position.x = Math.floor(Math.random() * 20 - 9) * 40;
        small.position.z = Math.floor(Math.random() * 100 - 100) * 10;
        small.position.y = 10;
        light.position.x = small.position.x
        light.position.y = small.position.y + 20
        light.position.z = small.position.z
        sounds[i].position.x = small.position.x
        sounds[i].position.y = small.position.y + 20
        sounds[i].position.z = small.position.z
        hits[i].position.x = small.position.x
        hits[i].position.y = small.position.y
        hits[i].position.z = small.position.z

        smallEnemy.add(small)
        smallEnemy.add(light)
        scene.add(smallEnemy)
        smallEnemy.add(sounds[i])
        smallEnemy.add(hits[i])

        smallEnemy.start = small.position
        
        smallEnemies.push(smallEnemy)
        
    }
    
    const bossFX = new THREE.PositionalAudio(listener);
    const bossShoot = new THREE.PositionalAudio(listener);
    enemy = new Enemy();

    audioLoader.load('./src/sounds/bossFX.mp3', function (buffer) {
        
        bossFX.setBuffer(buffer);
        bossFX.setRefDistance(300);
        bossFX.setRolloffFactor(20)
        bossFX.setLoop(true);
        bossFX.setVolume(1);
        
    });
    audioLoader.load('./src/sounds/bossShoot.mp3', function (buffer) {
        
        bossShoot.setBuffer(buffer);
        bossShoot.setRefDistance(300);
        bossShoot.setRolloffFactor(20)
        bossShoot.setLoop(false);
        bossShoot.setVolume(.5);
        
    });
    enemy.position.x = 120;
    enemy.position.z = 180;
    enemy.position.y = 150;
    enemy.health = 2000;
    bossFX.position.x = enemy.position.x
    bossFX.position.y = enemy.position.y
    bossFX.position.z = enemy.position.z
    bossShoot.position.x = enemy.position.x
    bossShoot.position.y = enemy.position.y
    bossShoot.position.z = enemy.position.z
    enemy.material.transparent = true
    enemy.material.opacity = 1
    scene.add(enemy)
    enemy.add(bossFX)
    enemy.add(bossShoot)
   
    // level2 = new Level2(scene, smallEnemies)
    // var water = level2.makeGround()
    // level2.scene = scene
    // scene.add(water)
    // level2Plane.push(water)

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
        
    }
    scene.add(clouds)

    // CUBES
    // Come back and make this a constructor class
    // geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    
    // var cubeA = new THREE.Mesh(geometry, material);
    // cubeA.position.set(200, 200, 0);
    // cubeA.name = "elevator"
    
    // var cubeB = new THREE.Mesh(geometry, material);
    // cubeB.position.set(20, 200, 10);
    
    // cubeB.name = "elevator"
    
    
    
    let geometry2 = new THREE.BoxBufferGeometry(10, 10, 10);
    material = new THREE.MeshBasicMaterial({ color: 0x00f000 });
    

    

    cubeA = new THREE.Mesh(geometry2, material);
    cubeB = new THREE.Mesh(geometry2, material);
    cubeC = new THREE.Mesh(geometry2, material);
    cubeA.position.set(200, 10, 300);
    cubeB.position.set(-100, 10, 300);
    cubeC.position.set(20, 10, 400);
    scene.add(cubeA);
    scene.add(cubeB);
    scene.add(cubeC);

    cubes.push(cubeA)
    cubes.push(cubeB)
    cubes.push(cubeC)

 
    
    // ENEMY
    
    
    

    // LIGHTS


    // Come back and make this a constructor class
    
    

    // var spotLight = new THREE.SpotLight(0xffffff, 10, 1000);
    // spotLight.position.set(100, 1000, 100);

    // spotLight.castShadow = true;

    // spotLight.shadow.mapSize.width = 1024;
    // spotLight.shadow.mapSize.height = 1024;

    // spotLight.shadow.camera.near = 500;
    // spotLight.shadow.camera.far = 4000;
    // spotLight.shadow.camera.fov = 30;

    // scene.add(spotLight);

    geometry = new THREE.CylinderGeometry(20, 20, 4);
    for (var i = 0, l = geometry.faces.length; i < l; i++) {
    var face = geometry.faces[i];
    face.vertexColors[0] = new THREE.Color("white")
    face.vertexColors[1] = new THREE.Color("white")
    face.vertexColors[2] = new THREE.Color("white")
    }
    material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: THREE.FlatShading, vertexColors: THREE.VertexColors });
    var elevator = new THREE.Mesh(geometry, material);
    elevator.position.x = 100
    elevator.position.y = 540
    elevator.position.z = -140
    elevator.name = "elevator"

    scene.add(elevator);
    objects.push(elevator)
    // Come back and make this a constructor class
    // These are the steps leading to the next level
    geometry = new THREE.CylinderGeometry(20, 20, 4);
    for (var i = 0, l = geometry.faces.length; i < l; i++) {
        var face = geometry.faces[i];
        face.vertexColors[0] = new THREE.Color("rgb(100, 50, 20)")
        face.vertexColors[1] = new THREE.Color("rgb(100, 50, 20)")
        face.vertexColors[2] = new THREE.Color("rgb(100, 250, 250)")
    }
    let y = 300
    let x = 100
    let z = 150
    for (var i = 0; i < 9; i++) {
        material = new THREE.MeshBasicMaterial({ color: 0xffffff, flatShading: THREE.FlatShading, vertexColors: THREE.VertexColors });
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
    // 
    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
    //
    window.addEventListener('resize', onWindowResize, false);


    
    
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
        
        enemyOrbs.push(bullet)
        scene.add(bullet)
        if (enemyOrbs.length < 5 && enemy.health <= bossHealth && enemy.health > 0 && play) {
            playShoot()
        }
        
    }, bossRate)
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
            if (Math.floor(bullet.position.distanceTo(person)) === (Math.floor(person.distanceTo(enemy.position)) - 15)){
                
                console.log("SHOOT")
                
            }
         
        })
        
    }else{
       
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
function playShoot(){
  
        enemy.children[1].play()
 
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
            soundEngine.health()
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
        // if(moveForward){
        //     posZ -= 4
        // }
        // if(moveBackward){
        //     posZ += 4
        // }
        // if(moveLeft){
        //     posX -= 4
        // }
        // if(moveRight){
        //     posX += 4
        // }
        let X = Math.abs(tree.position.x - posX)
        let Z = Math.abs(tree.position.z - posZ)
        if(X <= 12 && Z <= 12){
            
            let checkX = Math.floor(X) * 5
            let checkZ = Math.floor(Z) * 5
            if(checkZ > checkX){
                if(checkZ > -checkX){
                    
                    run = false
                    moveForward = false
                }else{
                    moveRight = false

                }
            }else{
                if(checkZ > -checkX){
                    moveLeft = false
                
                }else{
                    moveBackward = false

                }
            }
        }
        
        // if ((tree.position.x + 5  >= posX && tree.position.x - 5 <= posX) && (tree.position.z + 5 >= posZ && tree.position.z - 5 <= posZ)){
           
        //     velocity.x = 0;
        //     velocity.z = 0;
        //     moveBackward = false
        //     moveForward = false
        //     moveLeft = false
        //     moveRight = false
        // }
    })

    cubes.forEach((cube, idx) => {

        if (cube != "undefined"){
            let ammoPos = cube.position
            if (
                (pos.x >= (ammoPos.x - 10) && pos.x <= (ammoPos.x + 10)) &&
                (pos.y >= (ammoPos.y - 10) && pos.y <= (ammoPos.y + 10)) &&
                (pos.z >= (ammoPos.z - 10) && pos.z <= (ammoPos.z + 10))
            ) {
                ammo += 100
                
                GainAmmo()
                scene.remove(cube)
                soundEngine.ammo()
                delete cubes[idx]
                cube = false
                updateDisplay(); 
            }
        }
    })
    if (enemy.health > 0) {
        let enemyPos = enemy.position
        if (
            (pos.x >= (enemyPos.x - 50) && pos.x <= (enemyPos.x + 50)) &&
            (pos.y >= (enemyPos.y - 50) && pos.y <= (enemyPos.y + 50)) &&
            (pos.z >= (enemyPos.z - 50) && pos.z <= (enemyPos.z + 50))
        ) {
           
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
                
                orbHitUser(enemy, index)
            }

        })
    }
    if (smallEnemies.length > 0) {
        smallEnemies.forEach((enemy, index) => {
            if (enemy != "undefined") {
            let enemyPos = enemy.children[0].position
            if (
                (pos.x >= (enemyPos.x - 15) && pos.x <= (enemyPos.x + 15)) &&
                (pos.y >= (enemyPos.y - 15) && pos.y <= (enemyPos.y + 15)) &&
                (pos.z >= (enemyPos.z - 15) && pos.z <= (enemyPos.z + 15))
            ) {
                console.log(smallEnemies)
                
                smallEnemyHit()
                
                scene.remove(enemy)
                removeSmallEnemy(enemy, index)
            }
        }
        })
    }
}

function checkOrbCollision(orb, idx2, object){
    let pos = orb.position
    let enemyPos = object.position
    
    
    if (
        (pos.x >= (enemyPos.x - 50) && pos.x <= (enemyPos.x + 50)) &&
        (pos.y >= (enemyPos.y - 50) && pos.y <= (enemyPos.y + 50)) &&
        (pos.z >= (enemyPos.z - 50) && pos.z <= (enemyPos.z + 50))
    ) {
       

        removeUserOrb(orb, idx2)
        
        
        enemy.health -= 7
        enemy.material.color.r -= .02;
        enemy.material.color.g += .02;
        
        if(enemy.health <= 0){
            removeSmallEnemy(enemy, 0)
            points += 500
        }
            

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
                
                removeUserOrb(orb, idx2)
                
                small.children[0].health -= 8
                if (small.children[0].health <= 0) {
                    points += 125
                    die(small, index)
                    updateDisplay()
                    

                }
                small.children[0].hit = true
                small.children[1].intensity += 15;
    
                
               
                
                    
        
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
    if(player.health < 80){

        player.health += 20
        
    }else{
        player.health = 100
    }
    const playerHealth = player.health
    document.getElementById("player-health").style.width = `${playerHealth}%`
}
function orbHitUser(orb, index){
    soundFX.hitPlayer()
    
    removeEnemyOrb(orb, index)
    const div = document.getElementById("hurt")
    div.style.display = "inline"
    orbHit = true
    player.health -= 10
    const playerHealth = player.health
    document.getElementById("player-health").style.width = `${playerHealth}%`
   
    setTimeout(() => {
        orbHit = false
        div.style.display = "none"
        
    }, 500)
}

function wallOstacle() {
    let trajectory = camera.getWorldDirection(vector)
    let person = raycaster.ray.origin.copy(controls.getObject().position);

    orb.position.x += Math.sin(camera.rotation.y)
    orb.position.z += Math.cos(camera.rotation.y)
    
}
function endGame(){
    cancelAnimationFrame(start)
    document.exitPointerLock();
    document.getElementById("endgame").style.display = "block"

}
function restartGame(){
    console.log('RESTART')
    player.health = 100;
    

    // debugger
    
    document.getElementById("endgame").style.display = "none"
    document.getElementById("outOfBounds").style.display = "none"

    resetGame = false
    location.reload() 
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
    scene.remove(enemyLight)
    enemyOrbs.forEach((orb) => {
        scene.remove(orb)

    })
    enemyOrbs = []
}

function removeUserOrb(orb, index){
    scene.remove(orb)
    delete orbAlive[index]
}

function die(orb, index){
    orb.children[0].opacity -= .1
    
    setTimeout(()=> {
        scene.remove(orb)
        removeSmallEnemy(orb, index)
        removeLevel = true
    }, 500)
    
}
let smallTime
let smallSpeed = .8

function animateSmallEnemies(){

    let copy = smallEnemies
    copy.forEach((orb, index) => {
    let pos = raycaster.ray.origin.copy(controls.getObject().position);
    const array = [pos.x - orb.start.x, pos.z - orb.start.z]
  
    let alpha 
    alpha += delta;
    let orbPos = orb.children[0].position
    let dist = orb.children[0].position.distanceTo(pos)
    let finalSpeed = dist / 30
    let hitSpeed = dist / 80
    let v = new Vector3(1, 0, 1).normalize()
    if (!orb.children[0].hit) {
    orb.children[0].position.lerp(pos, (delta / finalSpeed))
    orb.children[1].position.lerp(pos, (delta / finalSpeed))
    orb.children[2].position.lerp(pos, (delta / finalSpeed))
    orb.children[3].position.lerp(pos, (delta / finalSpeed))
    }
    // let mag = Math.sqrt(array.reduce((acc, ele) => (ele * ele)))
    //     let unitVector = array.map(ele => ele / mag)
    //     // if(!orb.children[0].hit){
            
    //     //     smallTime = 0
    //     //         orb.children[0].translateX(unitVector[0] * .5);
    //     //         orb.children[1].translateX(unitVector[0] * .5);
    //     //         orb.children[2].translateX(unitVector[0] * .5);
    //     //         orb.children[3].translateX(unitVector[0] * .5);
    //     //         orb.children[0].translateZ(unitVector[1] * .5);
    //     //         orb.children[1].translateZ(unitVector[1] * .5);
    //     //         orb.children[2].translateZ(unitVector[1] * .5);
    //     //         orb.children[3].translateZ(unitVector[1] * .5);

            
            
    
    //     // }
        if(orb.children[0].hit){
            
            if(!orb.children[3].isPlaying){
                orb.children[3].play()
            }
            delayTrigger(orb.children[0])
            orb.children[0].position.lerp(pos, (delta / hitSpeed)*-1)
            orb.children[1].position.lerp(pos, (delta / hitSpeed)*-1)
            orb.children[2].position.lerp(pos, (delta / hitSpeed)*-1)
            orb.children[3].position.lerp(pos, (delta / hitSpeed)*-1)
            
            // orb.children[0].material.opacity -= .01;
            // orb.children[1].intensity += .01
            
        }

        if(orb.children[0].position.x === "NaN"){

            scene.remove(orb)
            removeSmallEnemy(orb, index)
        }

    })
    
    


    
    
    

}

function delayTrigger(orb, index){
    if(orb.health > 0){
        setTimeout(() => {
            orb.hit = false;
            // orb.material.opacity = 1
        }, 500)
    }
   

}
function removeSmallEnemy(small, index){
    small.children[3].play()
    small.children[2].stop()
    scene.remove(small)
    delete smallEnemies[index]
}
function hitUser(){
    
    hit = true
    soundEngine.hitPlayer()
    setTimeout(() => {
        hit = false
    }, 500)
}
function smallEnemyHit(){
    // hit = true
    soundFX.hitPlayer()
    player.health -= 10
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
let elevatorTime = 500
function animateElevator(elevator){
    elevatorTime -= .5
    if(elevatorTime > 0){
        elevator.translateY(.5)

    }
}

function checkCube(arr){
    
    arr[0].object.name === "elevator"
    
}

let stairEnd = 280
function animateStairs(){
    stairEnd -= .5
    
    if(stairEnd > 0){
        objects.forEach(stair =>{
            
            stair.translateY(-.5)
        })

    }
}

// function level2Generate(){
//     level2.makeSmallEnemies(scene, smallEnemies)
//     level2.makeSteps(level2.scene, objects)
// }

const limitEnemy = 50
let startEnemy = 0
let highEnemy = 100
let begin = true
const top = 500
const bottom = 500
let madStart = 0
let madEnd = 200
const enemyLight = new THREE.PointLight("rgb(250, 0 ,0)", 0, 600)
scene.add(enemyLight)
function animateEnemy(){
    
    enemyLight.position.x = enemy.position.x
    enemyLight.position.y = enemy.position.y + 100
    enemyLight.position.z = enemy.position.z
    

    if(begin){
        
        enemyLight.intensity = 30
        enemy.health = bossHealth
        enemy.material.color.r = 0.9;
        enemy.material.color.g = 0.0;
        enemy.material.color.b = 0.0;
        begin = false
        enemy.children[0].play()
        

    }

    if (startEnemy <= limitEnemy && enemy.health > 100){
        enemy.children[0].translateY(-.2)
        enemy.translateY(-.2)
        startEnemy += .2
        
    }
    if (startEnemy >= limitEnemy && enemy.health > 100){
        highEnemy -= .2
        enemy.children[0].translateY(.2)
        enemy.translateY(.2)
        
    }
    if(highEnemy <= limitEnemy){
        startEnemy = 0;
        highEnemy = 100
    }
    if(enemy.health <= 100 && madStart < 100){
        enemy.children[0].translateZ(1)
        enemy.translateZ(1)
        madStart += 1
        
    }
    if (enemy.health <= 100 && enemy.health > 0 && madStart === 100){
        enemy.children[0].translateZ(-1)
        enemy.translateZ(-1)
        madEnd -= 1
    }
    if (enemy.health <= 100 && enemy.health > 0 && madEnd === 100){
        madStart = 0
        madEnd = 200
    }
    if (enemy.health <= 0) {
        enemy.children[0].stop()
        enemy.translateY(-.5)
        enemy.material.color.g +=.2
        enemy.material.color.b +=.2
        enemy.material.color.r +=.1
        enemy.material.opacity -=.01

    }

}
let levelProgress = 1
let numEnemies = 10
let count = 0
function levelNext(){
    enemy.health = bossHealth
    levelProgress += 1
    document.getElementById('nextLevel').style.display = "flex"
    document.getElementById('levelnum').innerHTML = levelProgress;
    restartLevel = false
    removeLevel = false
    play = false
    count += 1
    if(count === 1){

    
    setTimeout(() => {
        bossHealth += 100
        smallSpeed += .02
        if (levelProgress > 2){
            numEnemies += 1
        }

    
    for (let i = 0; i < numEnemies; i++) {
        const sentinel = new Sentinel;

        const light = new THREE.PointLight("rgb(255, 222, 84)", 10, 100);
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
        orbs.push(sent_light)

    }
    var listener = new THREE.AudioListener();
    camera.add(listener);
    let sounds = {}
    let hits = {}
    var audioLoader = new THREE.AudioLoader();
    // SMALL ENEMIES
    for (let i = 0; i < 6; i++) {
        const small = new SmallEnemy(camera);

        sounds[i] = new THREE.PositionalAudio(listener);
        hits[i] = new THREE.PositionalAudio(listener);

        // create the PositionalAudio object (passing in the listener)


        // load a sound and set it as the PositionalAudio object's buffer

        // var audioLoader2 = new THREE.AudioLoader();
        audioLoader.load('./src/sounds/boss.mp3', function (buffer) {
            sounds[i].setBuffer(buffer);
            sounds[i].setRefDistance(20);
            sounds[i].setVolume(1)
            sounds[i].setRolloffFactor(5)
            // sound.setMaxDistance(10)
            sounds[i].setLoop(true)
            sounds[i].play();
        });

        audioLoader.load('./src/sounds/hit.mp3', function (buffer) {
            hits[i].setBuffer(buffer);
            hits[i].setRefDistance(50);
            hits[i].setVolume(1)
            hits[i].setRolloffFactor(5)
            // sound.setMaxDistance(10)
            hits[i].setLoop(false)

        });



        const light = new THREE.PointLight("rgb(250, 0, 0)", 20, 100);
        const smallEnemy = new THREE.Group()
        small.position.x = Math.floor(Math.random() * 20 - 9) * 40;
        small.position.z = Math.floor(Math.random() * 100 - 100) * 10;
        small.position.y = 10;
        light.position.x = small.position.x
        light.position.y = small.position.y + 20
        light.position.z = small.position.z
        sounds[i].position.x = small.position.x
        sounds[i].position.y = small.position.y + 20
        sounds[i].position.z = small.position.z
        hits[i].position.x = small.position.x
        hits[i].position.y = small.position.y
        hits[i].position.z = small.position.z

        smallEnemy.add(small)
        smallEnemy.add(light)
        scene.add(smallEnemy)
        smallEnemy.add(sounds[i])
        smallEnemy.add(hits[i])

        smallEnemy.start = small.position

        smallEnemies.push(smallEnemy)

    }

    const bossFX = new THREE.PositionalAudio(listener);
    const bossShoot = new THREE.PositionalAudio(listener);
    enemy = new Enemy();

    audioLoader.load('./src/sounds/bossFX.mp3', function (buffer) {

        bossFX.setBuffer(buffer);
        bossFX.setRefDistance(300);
        bossFX.setRolloffFactor(20)
        bossFX.setLoop(true);
        bossFX.setVolume(1);

    });
    audioLoader.load('./src/sounds/bossShoot.mp3', function (buffer) {

        bossShoot.setBuffer(buffer);
        bossShoot.setRefDistance(300);
        bossShoot.setRolloffFactor(20)
        bossShoot.setLoop(false);
        bossShoot.setVolume(.5);

    });
    enemy.position.x = 120;
    enemy.position.z = 180;
    enemy.position.y = 150;
    enemy.health = 2000;
    bossFX.position.x = enemy.position.x
    bossFX.position.y = enemy.position.y
    bossFX.position.z = enemy.position.z
    bossShoot.position.x = enemy.position.x
    bossShoot.position.y = enemy.position.y
    bossShoot.position.z = enemy.position.z
    enemy.material.transparent = true
    enemy.material.opacity = 1
    scene.add(enemy)
    enemy.add(bossFX)
    enemy.add(bossShoot)
    begin = true
    document.getElementById('nextLevel').style.display = "none"
    count = 0
    play = true
    
    }, 4000)
    }
}


function checkBounds(pos){
    if(pos.z > 1000){
        document.exitPointerLock();
        document.getElementById('outOfBounds').style.display = 'flex'
        controls.enabled = false
        console.log("OUTOFBOUNDS")
        
        // resetGame = true
        
    }
}

function instructionText(){
    
    document.getElementById('tutorial').style.display = "flex"
    if(moveForward){
        player.start = false
        document.getElementById('tutorial').style.display = "none"
        document.getElementById('shooter').style.display = "flex"
        setTimeout(() => {
            document.getElementById('shooter').style.display = "none"
            document.getElementById('goals').style.display = "flex"

        }, 3000)
        setTimeout(() => {
                document.getElementById('goals').style.display = "none"
                
        }, 8000)
    }
}

var delta
let bang = 0;
let start
let nextLevel = 0
let restartLevel = false
// Animate
function animate() {

    const traj = camera.getWorldDirection(vector)
    var time = performance.now();
    start = requestAnimationFrame(animate);
    // This will give all the PointLock controls
    if (controlsEnabled) {
        
        
        if(player.start){
            instructionText()
        }

        
        let pos = raycaster.ray.origin.copy(controls.getObject().position);
       
       
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;
        checkCollisions(pos)


        var intersections = raycaster.intersectObjects(objects);
       
        var isOnObject = intersections.length > 0;
        let plane2 = []
        
        // plane2 = raycaster.intersectObjects(level2Plane)
        // if(pos.y > 340){
        //     if(nextLevel === 0){
        //         level2Generate()
        //         nextLevel = false
        //     }
        //     level2.update(renderer, scene, camera)

        // }
        
        // var isOnplane2 = plane2.length > 0;
        
        delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions
        
        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (isOnObject === true) {

            velocity.y = Math.max(0, velocity.y);
            canJump = true;

        }
        if (isOnObject === true) {
            velocity.y = Math.max(0, velocity.y);
            
             
            canJump = true;
            if (intersections[0].object.name === "elevator"){
                console.log(pos.y)
                velocity.y = Math.max(20, velocity.y)
                animateElevator(intersections[0].object)
                controls.getObject().position.y = intersections[0].object.position.y + 10
            }
            if (intersections[0].object.name === "step"){
                controls.getObject().position.x += (intersections[0].object.speed.x)
                
                

            }
        }
        // if (isOnplane2 === true) {
        //     velocity.y = Math.max(0, velocity.y);
        //     canJump = true;
        // }
        // if (isOnplane2 === true) {

        //     velocity.y = Math.max(0, velocity.y);
        //     canJump = true;

        // }

        if (run){
            
            if(time - wait < 3000)
            velocity.z -= 400.0 * delta;
        } 
        
        if(hit){
            velocity.z += 10000.0 * delta;
        }
        if(orbHit){
            velocity.z += 2000.0 * delta;
        }
        
        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);
        controls.getObject().position.y += (velocity.y * delta);
        
        
        
        // controls.getObject().translateX(velocity.x * delta);
        // controls.getObject().translateY(velocity.y * delta);
        // controls.getObject().translateZ(velocity.z * delta);

         
        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        if (orbAlive.length > 0) {

            orbAlive.forEach((orb, index) => {
                animateOrb(orb, index, traj)
                checkOrbCollision(orb, index, enemy)
            })
        }

        if(smallEnemies.every(ele => ele === "undefined")){
            
            
            animateEnemy()
            animateEnemyOrbs()
            
        }
        
        if(enemy.health <= 0){
            restartLevel = true
            removeAllOrbs()
            scene.remove(enemy)
            // enemy.health = 2000
            animateStairs()
        }
        if(restartLevel && removeLevel){
            levelNext()
            
        }

        if(player.health <= 0){
            endGame()
                   
        }
        if (pos.z < 500) {
            animateSmallEnemies()
        }
        checkBounds(pos)
        if(resetGame){
            cancelAnimationFrame(start)
            
        }
       
        prevTime = time;
    }
    
        renderer.render(scene, camera);
    
}


