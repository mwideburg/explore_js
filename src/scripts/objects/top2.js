var Top = function (opt) {
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load('./src/images/tree2.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(5, 5);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
    const t = (1 + Math.sqrt(5)) / 2;
    const r = 1 / t;
    const vertices = [

        // (±1, ±1, ±1)
        - 1, - 1, - 1, - 1, - 1, 1,
        - 1, 1, - 1, - 1, 1, 1,
        1, - 1, - 1, 1, - 1, 1,
        1, 1, - 1, 1, 1, 1,

        // (0, ±1/φ, ±φ)
        0, - r, - t, 0, - r, t,
        0, r, - t, 0, r, t,

        // (±1/φ, ±φ, 0)
        - r, - t, 0, - r, t, 0,
        r, - t, 0, r, t, 0,

        // (±φ, 0, ±1/φ)
        - t, 0, - r, t, 0, - r,
        - t, 0, r, t, 0, r
    ];

    const indices = [
        3, 11, 7, 3, 7, 15, 3, 15, 13,
        7, 19, 17, 7, 17, 6, 7, 6, 15,
        17, 4, 8, 17, 8, 10, 17, 10, 6,
        8, 0, 16, 8, 16, 2, 8, 2, 10,
        0, 12, 1, 0, 1, 18, 0, 18, 16,
        6, 10, 2, 6, 2, 13, 6, 13, 15,
        2, 16, 18, 2, 18, 3, 2, 3, 13,
        18, 1, 9, 18, 9, 11, 18, 11, 3,
        4, 14, 12, 4, 12, 0, 4, 0, 8,
        11, 9, 5, 11, 5, 19, 11, 19, 7,
        19, 5, 14, 19, 14, 4, 19, 4, 17,
        1, 12, 14, 1, 14, 5, 1, 5, 9]

    this.geometry = new THREE.PolyhedronBufferGeometry(vertices, indices, 40, 0);
    
    this.material = new THREE.MeshLambertMaterial({ color: "rgb(34, 139, 34)" });
    THREE.Mesh.call(this, this.geometry, groundMaterial);


};

Top.prototype = Object.create(THREE.Mesh.prototype);
Top.prototype.constructor = Top;
Top.prototype.getMesh = function () {
    
    return this.mesh;

}
module.exports = Top