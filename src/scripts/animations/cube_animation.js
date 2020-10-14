var lim = 100;
var clock = new THREE.Clock();
var speed = 20;
var dir = new THREE.Vector3(0, 0, 1).normalize();
var move = new THREE.Vector3();
var pos = new THREE.Vector3();
var lookAt = new THREE.Vector3();



function cubeAnimation(renderer){
    renderer.setAnimationLoop(() => {
        debugger
        move.copy(dir).multiplyScalar(speed * clock.getDelta());


        pos.copy(group.position).add(move);

        if (Math.abs(pos.length()) >= lim) {


            dir.negate();


        }
        group.position.copy(pos);
        lookAt.copy(pos).add(dir);
        // group.lookAt(lookAt);

        // renderer.render(scene, camera);
    })
}

module.exports = cubeAnimation