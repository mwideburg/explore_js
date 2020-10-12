class Ship{
    constructor(){
        var geometry = new THREE.BoxGeometry();
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });



        this.ship = new THREE.Mesh(geometry, material);
    }
}

module.exports =  Ship;