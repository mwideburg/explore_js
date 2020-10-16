var EnemyOrb = function (opt) {


    const material = new THREE.MeshBasicMaterial({ color: "rgb(50, 200, 100)" })
    const geometry = new THREE.SphereGeometry(5, 32, 32);;
    // this.material = new THREE.MeshLambertMaterial({ color: "rgb(128,128,0)" });

    THREE.Mesh.call(this, geometry, material);
    
};

EnemyOrb.prototype = Object.create(THREE.Mesh.prototype);
EnemyOrb.prototype.constructor = EnemyOrb;
EnemyOrb.prototype.getMesh = function () {

    return this.mesh;

}

// EnemyOrb.prototype.animateEnmey = () => {
//     const limit = 100
//     const pos = new THREE.Vector3();
//     let dir = new THREE.Vector3(0, 1, 0).normalize();
//     let lookAt = new THREE.Vector3();
//     this.position.copy(pos).multiplyScalar(speed * clock.getDelta())
//     if (Math.abs(this.pos.length()) >= limit) {
//         dir.negate();
//     }
//     this.position.copy(pos);
//     lookAt.copy(pos).add(dir);
// }
module.exports = EnemyOrb