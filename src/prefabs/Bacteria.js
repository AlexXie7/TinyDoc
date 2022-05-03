class Bacteria extends Enemy {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame, pointValue);
        this.setScale(.33);

        this.body.onCollideCallback = (e) => {
            // console.log(e);
            if(e.bodyB.isProjectile && e.bodyB.medicine == 0 && !this.isCured)
                this.cured();
        }


    }

    update(time, delta) {
        this.x -= this.moveSpeed;
        super.update(time, delta)
    }
}