class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = 3;
        this.isDestroyed = false;
        this.body = scene.matter.add.circle(x, y, 32, {ignoreGravity : true});

        this.body.onCollideCallback = (e) => {
            console.log(e);
            if(e.bodyB.isProjectile)
                this.cured();
        }
    }

    update(time, delta) {
        //this.x -= this.moveSpeed;

        if(this.x <= this.scene.player.sprite.x - this.width) {
            console.log('destroying sprite');
            this.destroy();
        }
    }

    destroy(){
        this.isDestroyed = true;
        this.scene.matter.world.remove(this.body);
        this.body = undefined;
        super.destroy();
    }

    cured(){
        //console.log(this.scene);
        this.scene.addScore(this.points);
        this.destroy();
    }

}