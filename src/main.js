/*
Tiny Doc - Endless Runner
Completed: 5/2/2022
Collaborators: Alex Xie,  Matthew Chen, Daphne Cheng, Lixian Zhao
Creative Tilt:
    Our game uses matter js for sloped platforms, which matches the theme of running through a vein.
    The game also uses multiple scenes launched at once to create layers, such as a background, play, and UI layer.
    However, due to weird collisions, we opted to shift the game backwards at a certain distance rather than scroll.
    This keeps the collisions more consistent, and makes enemies' and items' positions more natural.
    Look into the Platform.js and Play.js files to see how platforms are created to give the illusion of a smooth vein.
    Visually, it uses a cartoon style with different colored shading.
    One of the cooler things is the purple enemy which twists like a worm.
    The music and some sound effects are created using free software like Audacity and Bosca Ceoil.
*/


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

// sharpness of the vein
let gameCurviness = 50;

// platform cell size
let gamePlatformSize = 128;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// scale ratio for game assets
const scaleRatio = window.devicePixelRatio / 3;

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
