var Sentinel = function (opt) {
    
    
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    const geometry = new THREE.SphereGeometry(5, 32, 32);;
    // this.material = new THREE.MeshLambertMaterial({ color: "rgb(128,128,0)" });

    THREE.Mesh.call(this, geometry, material);

};

Sentinel.prototype = Object.create(THREE.Mesh.prototype);
Sentinel.prototype.constructor = Sentinel;
Sentinel.prototype.getMesh = function () {

    return this.mesh;

}
module.exports = Sentinel