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

        this.background = this.add.tileSprite(0,0,config.scale.width, config.scale.height, 'background').setOrigin(0);


        const particles = this.add.particles('bloodCell');

        this.emitter = particles.createEmitter({
            angle: {min: 180, max:180},
            lifespan: 10000,
            scale: {min: .5, max: 1},
            rotate: {min: 0, max: 180},
            maxVelocityY: 0,
            frequency: 300
        });

        this.emitter.onParticleEmit((p) => {
            const offsetY = (Math.random() * gameRadius * 2 - gameRadius) * .8;
            p.x = config.scale.width + 64;
            p.y = gameCenterY + offsetY;
            p.offsetY = offsetY;
            p.velocityX = -400 + Math.random() * 100;
            p.defaultVelocityX = p.velocityX;
            p.spinDirection = Math.random() > .5 ? -1 : 1;
            p.tint = 0xFFFFFF;
        });

        this.emitter.start();

        this.bloodVelocityScale = 1;
        this.targetBloodVelocityScale = 1;

        this.tintColor = new Phaser.Display.Color(255, 255, 255);
        this.targetRG = 255;
        this.colorRG = 255;
        
        this.setTintFromHealth(1);
    }

    update(time, delta) {

        // ease in the tint color to the target color
        this.colorRG -= (this.colorRG - this.targetRG) * .01;
        this.tintColor.red = this.colorRG;
        this.tintColor.green = this.colorRG;
        

        // set the background's tint
        this.background.tint = this.tintColor.color;
        
        // ease the blood cell's velocity to the target velocity
        this.bloodVelocityScale -= (this.bloodVelocityScale - this.targetBloodVelocityScale) * .05;

        if (this.playScene) {
            this.emitter.forEachAlive((p) => {

                p.velocityX = p.defaultVelocityX * this.bloodVelocityScale;
                p.tint = this.tintColor.color;

                let closestPlatform = this.playScene.getClosestPlatformFromScreen(p.x);
                if (closestPlatform) {
                    const targetY =  closestPlatform.getElevationFromPositionX(this.playScene.toWorldX(p.x)) + p.offsetY - gameRadius;
                    p.y = targetY;
                    p.angle += .3 * p.spinDirection;
                }
            });
        }
    }

    // health from 1 to 0 
    setTintFromHealth(health) {
        this.targetRG = health * 255;
    }

    setBloodVelocityScale(v) {
        this.targetBloodVelocityScale = v;
    }
};