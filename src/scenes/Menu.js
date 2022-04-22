class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        //audio goes here
    }

    create(){
        //menu text config
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding,
        'TinyDoc', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2,
        'Controls go here', menuConfig).setOrigin(0.5);

    }
}