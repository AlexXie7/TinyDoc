const config = {
    type: Phaser.AUTO,
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
            gravity: { y: 1 },
            debug: {
                showBody: true,
                showStaticBody: true
            }
        }
    },
    width: 640,
    height: 480,
    scene: [Menu, Play, UI],
}

const game = new Phaser.Game(config);


let gameCenterY = config.height / 2;
let gameRadius = 120;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
