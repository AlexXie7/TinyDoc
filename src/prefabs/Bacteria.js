class Bacteria extends Enemy {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame, pointValue);
        this.setScale(.7);

        scene.matter.world.remove(this.body);
        // this.body = scene.matter.add.circle(x, y, 32, {ignoreGravity : true});
        this.body = scene.matter.add.rectangle(x, y, this.width * this.scale * .7, this.height * this.scale * .6, {ignoreGravity: true});

        this.body.onCollideCallback = (e) => {
            // console.log(e);
            if(e.bodyB.isProjectile && e.bodyB.medicine == 0 && !this.isCured)
                this.cured();
        }


    }

    update(time, delta) {
        this.x -= this.moveSpeed * delta * .1;
        super.update(time, delta)
    }
}