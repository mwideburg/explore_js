var Orb = function (opt) {


    const material = new THREE.MeshBasicMaterial({ color: "rgb(0, 0, 0)" })
    const geometry = new THREE.SphereGeometry(5, 32, 32);;
    // this.material = new THREE.MeshLambertMaterial({ color: "rgb(128,128,0)" });

    THREE.Mesh.call(this, geometry, material);

};

Orb.prototype = Object.create(THREE.Mesh.prototype);
Orb.prototype.constructor = Orb;
Orb.prototype.getMesh = function () {

    return this.mesh;

}
module.exports = Orb