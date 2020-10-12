function Sphere(){
    var geometry = new THREE.SphereGeometry(5, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    return this.sphere = new THREE.Mesh(geometry, material);
    // this.sphere.rotation.x += 0.01;
    // this.sphere.rotation.y += 0.01;
}


Sphere.prototype.move = () => {
    console.log("hey")
}

module.exports = Sphere;