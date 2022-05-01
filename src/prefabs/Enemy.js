class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = 3;
        this.isDestroyed = false;
        this.body = scene.matter.add.circle(x, y, 32, {ignoreGravity : true});
 
        this.isCured = false;
    }

    update(time, delta) {
        //this.x -= this.moveSpeed;

        if(this.x <= this.scene.player.sprite.x - this.width) {
            console.log('destroying sprite');
            this.destroy();
        }
        this.scene.matter.body.setPosition(this.body, {x: this.x, y:this.y});
    }

    destroy(){

        if (this.scene) { // fixes issue where sprite is destroyed on scene start / restart
            if (!this.isCured) {
                this.scene.addDamage(this.points * .25);
            }
    
            this.isDestroyed = true;
            this.scene.matter.world.remove(this.body);
            this.body = undefined;
        }
        
        super.destroy();
    }

    cured() {
        this.isCured = true;
        this.scene.sound.play('enemyKilled');
        this.scene.addScore(this.points);
        this.destroy();
    }

}