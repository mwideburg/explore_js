var Trunk = function (opt) {
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load('./src/images/bark_text.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    var material = new THREE.MeshLambertMaterial({ map: groundTexture });

    this.geometry = new THREE.CylinderGeometry(5, 5, 102, 32);
    // this.material = new THREE.MeshLambertMaterial({ color: "rgb(128,128,0)" });

    THREE.Mesh.call(this, this.geometry, material);

};

Trunk.prototype = Object.create(THREE.Mesh.prototype);
Trunk.prototype.constructor = Trunk;
Trunk.prototype.getMesh = function () {
    
    return this.mesh;

}
module.exports = Trunk