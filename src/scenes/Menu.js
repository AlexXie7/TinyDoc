class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        this.load.spritesheet('MenuVirus', './assets/ThreeVirusMenu.png', {
            frameWidth: 230,
            frameHeight: 244
        });
    }

    create(){
        //menu text config
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '64px',
            backgroundColor: '#F3B141',
            color: '#CC2006',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.anims.create({
            key: 'menuWiggle',
            frames: this.anims.generateFrameNumbers('MenuVirus', {start: 0, end: 5, first: 0}),
            frameRate: 6,
            repeat: -1
        });
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding*4,
        'TinyDoc', menuConfig).setOrigin(0.5);

        menuConfig.fontSize = '24px';

        this.add.text(game.config.width/2, game.config.height/2,
        'Mouse to Aim/Click to Shoot', menuConfig).setOrigin(0.5);

        this.add.text(game.config.width/2, game.config.height/2 + borderPadding*2,
        '[Z][X][C] to Change Medicines', menuConfig).setOrigin(0.5);

        this.add.text(game.config.width/2, game.config.height/2 + borderPadding*4,
        '[Space] to Jump', menuConfig).setOrigin(0.5);

        this.add.text(game.config.width/2, game.config.height/2 + borderPadding*8,
        'Press Space to Start', menuConfig).setOrigin(0.5);

        let wiggle1 = this.add.sprite(game.config.width/4, game.config.height/2, 'MenuVirus');
        wiggle1.anims.play('menuWiggle');
        let wiggle2 = this.add.sprite(game.config.width/4*3, game.config.height/2, 'MenuVirus');
        wiggle2.anims.play('menuWiggle');

        // start key, change to what u would like
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
            this.scene.start('playScene');
        }
    }
}