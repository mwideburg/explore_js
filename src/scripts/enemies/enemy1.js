var Enemy = function (opt) {


    const material = new THREE.MeshPhongMaterial({ color: "rgb(50, 250, 250)" })
    const geometry = new THREE.SphereGeometry(50, 32, 32);;
    // this.material = new THREE.MeshLambertMaterial({ color: "rgb(128,128,0)" });

    THREE.Mesh.call(this, geometry, material);

};

Enemy.prototype = Object.create(THREE.Mesh.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.getMesh = function () {

    return this.mesh;

}
module.exports = Enemy