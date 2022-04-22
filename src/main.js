 let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu ]
    }

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let hiScore = 0;