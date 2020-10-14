var Top = function (opt) {
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load('./src/images/tree.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(5, 5);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
    var verticesOfCube = [
        -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
        -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
    ];

    var indicesOfFaces = [
        2, 1, 0, 0, 3, 2,
        0, 4, 7, 7, 3, 0,
        0, 1, 5, 5, 4, 0,
        1, 2, 6, 6, 5, 1,
        2, 3, 7, 7, 6, 2,
        4, 5, 6, 6, 7, 4,
        
    ];

    this.geometry = new THREE.PolyhedronBufferGeometry(verticesOfCube, indicesOfFaces, 30, 2);
    
    this.material = new THREE.MeshLambertMaterial({ color: "rgb(34, 139, 34)" });
    THREE.Mesh.call(this, this.geometry, groundMaterial);


};

Top.prototype = Object.create(THREE.Mesh.prototype);
Top.prototype.constructor = Top;
Top.prototype.getMesh = function () {
    
    return this.mesh;

}
module.exports = Top