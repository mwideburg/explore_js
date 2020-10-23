const SmallEnemy = require("../enemies/small_enemy");


function Level2(scene, smallEnemies) {
    this.objects= {
        scene: scene,
        steps: []
    }
    
    
    this.makeSteps = this.makeSteps.bind(this)
    this.moveSteps = this.moveSteps.bind(this)
    this.makeGround = this.makeGround.bind(this)

}

Level2.prototype.makeSmallEnemies = function (scene, smallEnemies){
    for (let i = 0; i < 5; i++) {
        var smallEnemy = this.makeObject()

        smallEnemies.push(smallEnemy)
        scene.add(smallEnemy)

    }
    let geometry2 = new THREE.BoxBufferGeometry(100, 100, 100);
    material = new THREE.MeshBasicMaterial({ color: 0x00f000 });

    


    cubeA = new THREE.Mesh(geometry2, material);
    cubeA.position.y = 340
    cubeA.position.x = 100
    cubeA.position.z = 300

    scene.add(cubeA)
}

Level2.prototype.makeGround = () => {
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load('./src/images/water_text.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

    mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), groundMaterial);
    mesh.position.y = 340;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "level"


    

    return mesh



   
}

Level2.prototype.makeObject = () => {
    
    var small =  new SmallEnemy
    const light = new THREE.PointLight("rgb(250, 0, 0)", 20, 100);
    const smallEnemy = new THREE.Group()
    small.position.x = Math.floor(Math.random() * 20 - 9) * 40;
    small.position.z = Math.floor(Math.random() * 100 - 100) * 10;
    small.position.y = 350;
    light.position.x = small.position.x
    light.position.y = small.position.y + 20
    light.position.z = small.position.z
    smallEnemy.add(small)
    smallEnemy.add(light)
    smallEnemy.start = small.position
    return smallEnemy

}

Level2.prototype.makeSteps = function (scene, objects){
    let that = this.objects
    console.log(this.steps)
    const steps = []
    let geometry = new THREE.CylinderGeometry(20, 20, 4);
    for (var i = 0, l = geometry.faces.length; i < l; i++) {
        var face = geometry.faces[i];
        face.vertexColors[0] = new THREE.Color("rgb(0, 0, 0)")
        face.vertexColors[1] = new THREE.Color("rgb(0, 0, 0)")
        face.vertexColors[2] = new THREE.Color("rgb(0, 0, 0)")
    }

    for (var i = 0; i < 20; i++) {
        material = new THREE.MeshPhongMaterial({ color: "white"});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.floor(Math.random() * 20 - 10) * 60;
        mesh.position.z = Math.floor(Math.random() * 20 - 10) * 60;
        mesh.position.y = 370
        mesh.name = "step"
        steps.push(mesh)
        let x = Math.random() - Math.random();
        let vel = { x: x }
        mesh.speed = vel
        mesh.time = 0
        scene.add(mesh);
        objects.push(mesh)
        
    }
    this.objects.steps = steps

}

Level2.prototype.moveSteps = function (){
    
    
    this.objects.steps.forEach(step => {
        step.time += .5
        if (step.time > 100){
            step.speed.x = step.speed.x * -1;
            step.time = 0
        }
        
        step.translateX(step.speed.x);
        
        
    })
}

Level2.prototype.update = function(renderer, scene, camera){
    this.moveSteps()
    renderer.render(scene, camera);
}
Level2.prototype.constructor = Level2;

module.exports = Level2;