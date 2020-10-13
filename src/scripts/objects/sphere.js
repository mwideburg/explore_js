function Sphere(pos1, pos2, pos3){
    var geometry = new THREE.SphereGeometry(pos1, pos2, pos3);
    var material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    
    this.sphere = new THREE.Mesh(geometry, material);
    // this.sphere.translate(0 , 5, -5)
    
    return this.sphere
    // this.sphere.rotation.x += 0.01;
    // this.sphere.rotation.y += 0.01;
}


Sphere.prototype.move = () => {
    console.log("hey")
}

module.exports = Sphere;