class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){

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

        // start key, change to what u would like
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
            this.scene.start('playScene');
        }
    }
}