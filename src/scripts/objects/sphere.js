function Sphere(){
    var geometry = new THREE.SphereGeometry(5, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    this.sphere = new THREE.Mesh(geometry, material);
    // controls = new THREE.PointerLockControls(camera, renderer.domElement);
    // controls.addEventListener('change', render)

}

module.exports = Sphere;