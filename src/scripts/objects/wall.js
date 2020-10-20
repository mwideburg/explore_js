const { Vector3 } = require("three");

var Wall = function (w, h, d) {
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load('./src/images/brick_text.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(15, 15);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    var material = new THREE.MeshLambertMaterial({ map: groundTexture });

    const geometry = new THREE.BoxGeometry(w, h, d);;
    // this.material = new THREE.MeshLambertMaterial({ color: "rgb(128,128,0)" });

    THREE.Mesh.call(this, geometry, material);

};



Wall.prototype = Object.create(THREE.Mesh.prototype);
Wall.prototype.constructor = Wall;
Wall.prototype.getMesh = function () {

    return this.mesh;

}

module.exports = Wall