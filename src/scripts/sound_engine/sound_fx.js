function SoundFX(camera) {
    var listener = new THREE.AudioListener();
    var sound = new THREE.Audio(listener);
    var hit = new THREE.Audio(listener);
    
    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    this.objects = {
        listener: listener,
        audioLoader: audioLoader,
        sound: sound,
        hit: hit
    }
    camera.add(listener);

    // create a global audio source
    
    
    this.shoot = this.shoot.bind(this)
    this.hitPlayer = this.hitPlayer.bind(this)

};

SoundFX.prototype.shoot = function(){
    const that = this.objects
    
    that.audioLoader.load('./src/sounds/shoot.mp3', function (buffer) {
        var gainNode = that.sound.context.createGain()
        // gainNode.detune();
        that.sound.setBuffer(buffer);
        that.sound.setLoop(false);
        that.sound.setVolume(.5);
        
        that.sound.isPlaying ? null : that.sound.play();
    });
}
SoundFX.prototype.hitPlayer = function () {
    const that = this.objects

    that.audioLoader.load('./src/sounds/playerHit.mp3', function (buffer) {
        that.hit.setBuffer(buffer);
        that.hit.setLoop(false);
        that.hit.setVolume(1);
        
        that.hit.isPlaying ? null : that.hit.play();
    });
}
// SoundFX.prototype.move = function(keyDown){
//     const that = this.objects
//     debugger
//     that.audioLoader.load('./src/sounds/footsteps.mp3', function (buffer) {
//         that.sound.setBuffer(buffer);
//         that.sound.setLoop(false);
//         that.sound.setVolume(.5);
//         that.sound.play();
//     });
//     if(!keyDown){
//         that.sound.stop()
//     }
// }
// SoundFX.prototype.boss = function(){
//     const that = this.objects
//     debugger
//     that.audioLoader.load('./src/sounds/boss.mp3', function (buffer) {
//         that.sound.setBuffer(buffer);
//         that.sound.setLoop(true);
//         that.sound.setVolume(.5);
//         that.sound.play();
//     });
// }
// SoundFX.prototype.machines = function(){
//     const that = this.objects
//     debugger
//     that.audioLoader.load('./src/sounds/machines.mp3', function (buffer) {
//         that.sound.setBuffer(buffer);
//         that.sound.setLoop(true);
//         that.sound.setVolume(.5);
//         that.sound.play();
//     });
// }



SoundFX.prototype.constructor = SoundFX;

module.exports = SoundFX



