

function GameView(scene) {
    this.scene = scene;
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    
}

GameView.prototype.controls = () => {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    var onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true; break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                jump
                break;
        }
    };
    var onKeyUp = function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
            case 32: // space
                jumpdown
                break;
        }
    };
}

GameView.prototype.animate = () => {
    const that = this;
    this.controls;
    requestAnimationFrame(that.animate());
    if (moveForward) { camera.position.z -= 0.5; }
    if (moveBackward) { camera.position.z += 0.5; }
    if (moveLeft) { camera.position.x -= 0.5; }
    if (moveRight) { camera.position.x += 0.5; }
    if (jump) { camera.position.y += 0.5; }
    if (jumpdown) { camera.position.y -= 0.5; }
    renderer.render(scene, camera);

}


module.exports = GameView;