class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {

        this.load.image('player', './assets/player.png');


        this.load.image('surface', './assets/surface.png');

        this.load.image('flesh', './assets/flesh.png');
    }

    create() {
        this.scene.launch('backgroundScene');
        this.scene.launch('uiScene');
        this.uiScene = this.scene.get('uiScene');
        
        this.cameras.resize(game.config.width * 5, 1080);
        this.camera = this.cameras.main;

        this.platforms = [];
        this.nextPlatforms = [];
        this.destroyPlatforms = [];

        this.player = new Player(this);


        for (let i = 0; i < Math.floor(game.config.width / gamePlatformSize) + 3; i++) {
            this.createPlatform();
        }


        this.gameShiftDistance = game.config.width * 4;

    }   


    update(time, delta) {

        // checks if the player is a distance from the origin, and shift the entire game back
        if (this.player.body.position.x > this.gameShiftDistance + 128) {
            this.shiftGame();
        }

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

        this.player.update(time, delta);

        this.camera.x = -this.player.body.position.x + 100;

        if (this.uiScene?.label) {
            this.uiScene.label.text = this.player.body.position.x.toFixed(2);
        }
    }

    // shifts the entire game back, including platforms, players, enemies, items, etc
    shiftGame() {
        console.log('shifting game')
        for (const platform of this.platforms) {
            platform.translateX(-this.gameShiftDistance);
        }

        this.matter.body.translate(this.player.body, {x: -this.gameShiftDistance, y: 0});
        // this.matter.world.engine.gravity.y = 0;
    }

    createPlatform() {
        
        let previousPlatform = this.platforms.length > 0 ? this.platforms[this.platforms.length - 1] : undefined;

        let x, startY, endY;

        if (previousPlatform) {
            x = previousPlatform.x + gamePlatformSize;
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

        endY = Math.sin(this.sinProgress) * 30; // adjusts the curviness ex: 30 is pretty smooth and light
        
        const platform = new Platform(this, x, startY, endY);
        this.platforms.push(platform);
        
    }

    getClosestPlatformFromScreen(screenX) {
        const index = Math.floor(screenX / gamePlatformSize);
        return index >= 0 && index < this.platforms.length ? this.platforms[index] : undefined; 
    }
}