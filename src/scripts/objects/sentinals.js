var Sentinal = function (opt) {
    var geometry = new THREE.ParametricGeometry(THREE.ParametricGeometries.klein, 25, 25);
    var material = new THREE.MeshBasicMaterial({ color: "rgb(255, 172, 77)" });
    var klein = new THREE.Mesh(geometry, material);
    

    
    // this.material = new THREE.MeshLambertMaterial({ color: "rgb(128,128,0)" });

    THREE.Mesh.call(this, this.geometry, this.material);

};

Sentinal.prototype = Object.create(THREE.Mesh.prototype);
Sentinal.prototype.constructor = Sentinal;
Sentinal.prototype.getMesh = function () {

    return this.mesh;

}
module.exports = Sentinal