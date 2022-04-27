class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = 3;
        this.isDestroyed = false;
    }

    update(time, delta) {
        //this.x -= this.moveSpeed;

        if(this.x <= 0 - this.width) {
            this.destroy();
        }
    }

    destroy(){
        this.scene.addScore(this.pointValue);
        this.isDestroyed = true;
        super.destroy();
    }

}