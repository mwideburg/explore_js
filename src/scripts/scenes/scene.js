const Sphere = require('../objects/sphere')
const Light = require('../lights/light')

function Scene(){
    this.scene = new THREE.Scene();
    this.addShapes();
    this.addLights();
}

Scene.prototype.addShapes = () => {
    const sphere = new Sphere
    this.scene.add(sphere)
    
}


Scene.prototype.addLights = () => {
    const newSpot = new Light
    this.scene.add(newSpot)
    
}


module.exports = Scene;