class Background extends Phaser.Scene {
    constructor() {
        super('backgroundScene');
    }

    preload() {
        this.load.image('background', './assets/background.png');
        this.load.image('bloodCell','./assets/blood-cell.png');
    }

    create() {
        this.playScene = this.scene.get('playScene');

        this.add.tileSprite(0,0,config.scale.width, config.scale.height, 'background').setOrigin(0);


        const particles = this.add.particles('bloodCell');

        this.emitter = particles.createEmitter({
            angle: {min: 180, max:180},
            lifespan: 10000,
            scale: {min: .5, max: 1},
            rotate: {min: 0, max: 180},
            maxVelocityY: 0,
            frequency: 500
        });

        this.emitter.onParticleEmit((p) => {
            const offsetY = (Math.random() * gameRadius * 2 - gameRadius) * .8;
            p.x = config.scale.width + 64;
            p.y = gameCenterY + offsetY;
            p.offsetY = offsetY;
            p.velocityX = -400 + Math.random() * 100;
            p.spinDirection = Math.random() > .5 ? -1 : 1;
        });

        this.emitter.start();
    }

    update() {

        if (this.playScene) {
            this.emitter.forEachAlive((p) => {
                let closestPlatform = this.playScene.getClosestPlatformFromScreen(p.x);
                if (closestPlatform) {
                    const targetY =  closestPlatform.y + p.offsetY;
                    p.y -= (p.y - targetY) * .01;
                    p.angle += .3 * p.spinDirection;
                }
            });
        }   
    }
};