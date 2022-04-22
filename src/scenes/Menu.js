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
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }        
    }
}