class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {

        this.load.image('player', './assets/player.png');


        this.load.image('surface', './assets/surface.png');

        //temp enemy
        this.load.image('red', './assets/red.png');


    }

    create() {
        this.scene.launch('uiScene');
        this.uiScene = this.scene.get('uiScene');
        
        this.cameras.resize(4000, 1080);
        this.camera = this.cameras.main;

        this.platforms = [];

        this.player = new Player(this);


        for (let i = 0; i < Math.floor(game.config.width / 64) + 2; i++) {
            this.createPlatform();
        }

        this.paras = new Parasite(this, 500, gameCenterY, 'red', 0, 30, 0);
        this.temptimer = 0;


    }   


    update(time, delta) {

        this.player.update(time, delta);


        for (let i = 0; i < this.platforms.length; i++) {
            const platform = this.platforms[i];
            if (platform.isDestroyed) {
                this.platforms.splice(0, 1);
                i -= 1;
                this.createPlatform();
            } else {
                platform.update(time, delta);
            }
        }


        this.camera.x = -this.player.body.position.x + 100;

        if (this.player.body.position.x > game.config.width * 4) {
            this.shiftGame();
        }


        // temp enemy generation
        this.temptimer += 1;
        if(this.temptimer / 300 == 1){
            this.paras = new Parasite(this, 1500, gameCenterY, 'red', 0, 30, 0);
            // this.temp.setScale(1)
        }
        this.paras.update();
        if(this.paras.x < this.player.x){
            this.paras.destroy();
        }
    }

    shiftGame() {
        console.log('shifting game')
        for (const platform of this.platforms) {
            platform.addPositionX(-game.config.width * 3);
        }
        this.matter.body.translate(this.player.body, {x: -game.config.width * 3,y: 0});
    }

    createPlatform() {
        
        let previousPlatform = this.platforms.length > 0 ? this.platforms[this.platforms.length - 1] : undefined;

        let x, startY, endY;

        if (previousPlatform) {
            x = previousPlatform.x + 64;
            startY = previousPlatform.endY;
        } else {
            x = 0;
            startY = 0;
        }

        this.sinProgress = this.sinProgress !== undefined ? this.sinProgress + Math.random() * .5 : 0;

        // if (Math.random() > .3) {
        //     endY = startY;
        // } else {
        //     endY = startY + Math.random() * 100 - 50;
        // }

        endY = Math.sin(this.sinProgress) * 30;
        
        const platform = new Platform(this, x, startY, endY);
        this.platforms.push(platform);
        
    }
}