function SoundEngine(camera, keyDown) {
    var listener = new THREE.AudioListener();
    var sound = new THREE.Audio(listener);
    var move = new THREE.Audio(listener);
    var health = new THREE.Audio(listener);
    var ammo = new THREE.Audio(listener);
    console.log(keyDown)
    
    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    this.objects = {
        listener: listener,
        audioLoader: audioLoader,
        sound: sound,
        move: move,
        health: health,
        ammo: ammo,
        keyDown: keyDown,

    }
    camera.add(listener);

    // create a global audio source
    
    
    
    this.background = this.background.bind(this)
    this.move = this.move.bind(this)
    this.health = this.health.bind(this)

};
SoundEngine.prototype.background = function(){
    const that = this.objects
    
    that.audioLoader.load('./src/sounds/background.mp3', function (buffer) {
        that.sound.setBuffer(buffer);
        that.sound.setLoop(true);
        that.sound.setLoopEnd(10000);
        that.sound.setVolume(.2);
        
        that.sound.play();
    });
}

SoundEngine.prototype.move = function(keyDown){
    const that = this.objects
    
    that.audioLoader.load('./src/sounds/footsteps.mp3', function (buffer) {
        that.move.setBuffer(buffer);
        that.move.setLoop(true);
        // that.move.setLoopStart(10000)
        that.move.setVolume(.7);
        // that.move.play();
        if(keyDown && !that.move.isPlaying){
            that.move.play()
        }else if(!keyDown){
            that.move.pause()
        }
        
        
    });
    
}


SoundEngine.prototype.health = function(){
    const that = this.objects
    
    that.audioLoader.load('./src/sounds/health.mp3', function (buffer) {
        that.health.setBuffer(buffer);
        that.health.setLoop();
        that.health.setVolume(.5);
        that.health.play();
    });
}
SoundEngine.prototype.ammo = function(){
    const that = this.objects
    
    that.audioLoader.load('./src/sounds/ammo.mp3', function (buffer) {
        that.ammo.setBuffer(buffer);
        that.ammo.setLoop();
        that.ammo.setVolume(.5);
        that.ammo.play();
    });
}





SoundEngine.prototype.constructor = SoundEngine;

module.exports = SoundEngine



