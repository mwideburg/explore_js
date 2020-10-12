// CAMERA
const GameView = require('./scripts/game/game_view.js');
const Scene = require('./scripts/scenes/scene');


document.addEventListener("DOMContentLoaded", () => {
    




    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, 700, 900);

    const scene = new Scene();
    new GameView(scene).animate();


    // let asteroid = new Asteroid({ pos: [250, 250]});
    // console.log(asteroid);
    // asteroid.draw(ctx);
    //     setInterval(function(){
    //         asteroid.move(ctx);
    //         ctx.clearRect(0, 0, canEle.width, canEle.height)
    //         ctx.fillStyle = "black";
    //         ctx.fillRect(0, 0, 700, 900);
    //         asteroid.draw(ctx);
    //     }, 100)
});