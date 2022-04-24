const config = {
    type: Phaser.AUTO,
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
            gravity: { y: 1 },
            debug: {
                showBody: true,
                showStaticBody: false
            }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth * window.devicePixelRatio,
        height: window.innerHeight * window.devicePixelRatio
    },
    scene: [Menu, Background, Play, UI],
}

const game = new Phaser.Game(config);

// camera offset from player
let cameraOffsetX = 100;

// Center Y value of the game
let gameCenterY = config.scale.height / 2;

// width of the vein
let gameRadius = 120;

// platform cell size
let gamePlatformSize = 128;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// scale ratio for game assets
const scaleRatio = window.devicePixelRatio / 3;

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
