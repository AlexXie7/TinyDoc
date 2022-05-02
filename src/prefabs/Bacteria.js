class Bacteria extends Enemy {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame, pointValue);
        this.setScale(.1);

        this.body.onCollideCallback = (e) => {
            // console.log(e);
            if(e.bodyB.isProjectile && e.bodyB.medicine == 0 && !this.isCured)
                this.cured();
        }


    }

    update(time, delta) {
        this.x -= this.moveSpeed;
        
        this.scene.matter.body.setPosition(this.body, {x: this.x, y:this.y});

        if(this.x <= this.scene.player.sprite.x - this.width) {
            console.log('destroying sprite');
            this.destroy();
        }
    }
}