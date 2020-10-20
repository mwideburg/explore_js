const { Vector3 } = require("three");
const Wall = require("./wall");

var Habitat = function () {


    var left = new Wall(5, 80, 100)
    var right = new Wall(5, 80, 100)
    var back = new Wall(100, 80, 5)
    var front = new Wall(100, 80, 5)
    var roof = new Wall(100, 5, 100)
    var floor = new Wall(100, 5, 100)
    left.position.z = 700
    left.position.x = -50
    right.position.z = 700
    right.position.x = 50
    front.position.z = 650
    back.position.z = 750
    roof.position.y = 40
    roof.position.z = 700
    floor.position.y = 0
    floor.position.z = 700
    
    
    this.group = new THREE.Group();
    this.group.add(left)
    this.group.add(right)
    this.group.add(back)
    this.group.add(front)
    this.group.add(roof)
    this.group.add(floor)

};



Habitat.prototype = Object.create(THREE.Mesh.prototype);
Habitat.prototype.constructor = Habitat;
Habitat.prototype.getMesh = function () {

    return this.mesh;

}

module.exports = Habitat