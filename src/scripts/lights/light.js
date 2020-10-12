function Light(){
    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.position.set(100, 1000, 100);

    this.spotLight.castShadow = true;

    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;

    this.spotLight.shadow.camera.near = 500;
    this.spotLight.shadow.camera.far = 4000;
    this.spotLight.shadow.camera.fov = 30;
}



module.exports = Light;