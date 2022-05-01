class Projectile {
    constructor(scene, x, y, dx, dy, force = .07, tint = 0xFFFFFF, medicine = 0) {
        this.scene = scene;

        // create matter body
        this.body = scene.matter.add.circle(x, y, 16);
        this.body.collisionFilter.category = 0x100;
        this.body.collisionFilter.mask = 0x01;

        this.body.projectile = this;
        this.body.medicine = medicine;
        this.medicine = medicine;
        this.body.isProjectile = true;

        this.body.onCollideCallback = (e) => {
            this.destroy();
        }

        this.tint = tint;

        // create sprite
        this.sprite = scene.add.image(x, y, 'projectile');
        this.sprite.setTint(this.tint);

        // create particle emitter
        this.particles = scene.add.particles('medicineParticle');
        this.emitter = this.particles.createEmitter({
            speed: 100,
            lifespan: 500,
            scale: {start: 1, end: 0},
            rotate: {min: 0, max: 180},
            tint: this.tint,
            frequency: 80
        });

        this.emitter.onParticleDeath(() => {
            if (this.emitter.getAliveParticleCount() === 0) {
                this.particles.destroy();
            }
        });

        this.emitter.start();

        // add to projectile list
        scene.projectiles.push(this);

        // applies an initial force based on the dx dy direction vector multiplied by the force
        const forceVector = new Phaser.Math.Vector2(dx, dy);
        forceVector.normalize();
        forceVector.scale(force);
        scene.matter.body.applyForce(this.body, this.body.position, {x: forceVector.x, y: forceVector.y});

        //selfdeletes after 5 sec
        this.clock = this.scene.time.delayedCall(5000, () => { 
            if(!this.isDestroyed){
                console.log(this); 
                this.destroy(); 
            }

        }, null, this);
    }

    update() {
        this.sprite.setPosition(this.body.position.x, this.body.position.y);
        this.sprite.rotation += .1;
        this.emitter.setPosition(this.body.position.x, this.body.position.y);
    }

    destroy() {
        this.emitter.explode(10);
        this.scene.matter.world.remove(this.body);
        this.sprite.destroy();
        this.emitter.stop();
        this.isDestroyed = true;
    }
}