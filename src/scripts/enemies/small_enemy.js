const { Scene } = require("three");
const EnemyOrb = require("./enemy1_orbs");

var SmallEnemy = function (camera) {

    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load('./src/images/red_text.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(15, 15);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    var material = new THREE.MeshLambertMaterial({ map: groundTexture });
    material.transparent = true
    const geometry = new THREE.TetrahedronBufferGeometry(15, 0);
    // this.material = new THREE.MeshLambertMaterial({ color: "rgb(128,128,0)" });

    THREE.Mesh.call(this, geometry, material);
    this.health = 20;
    this.hit = false

    
    
};

SmallEnemy.prototype = Object.create(THREE.Mesh.prototype);
SmallEnemy.prototype.constructor = SmallEnemy;
SmallEnemy.prototype.getMesh = function () {

    return this.mesh;

}

SmallEnemy.prototype.fireOrb = () => {
    orb = new EnemyOrb
    scene.add(orb)
};

module.exports = SmallEnemy