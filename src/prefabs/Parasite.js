

class Parasite extends Enemy {
    
    constructor(scene, x, y, texture, frame, pointValue, index = 0, prev = null) {
        super(scene, x, y, texture, frame, pointValue);
        this.prev = prev;
        this.index = index;

        this.lastY = y;
        this.bounceSize = gameRadius;
        this.bounceSpeed = .7;

        this.setScale(.3);
        // console.log(this.body)

        this.body.onCollideCallback = (e) => {
            console.log(e);
            if(e.bodyB.isProjectile && e.bodyB.medicine == 1)
                this.cured();
        }

    }
    
    update(time, delta) {

        // sets the height of the enemy
        const closestPlatform = this.scene.getClosestPlatform(this.x);
        if (closestPlatform) {
            if(this.index == 0){
                this.y = closestPlatform.getElevationFromPositionX(this.x) - (Math.sin(time * .01 * this.bounceSpeed) * .5 + 1)      * this.bounceSize;
            } else {
                this.y = closestPlatform.getElevationFromPositionX(this.x) - (Math.sin(time * .01 * this.bounceSpeed + this.index) * .5 + 1)      * this.bounceSize;
            }
            this.scene.matter.body.setPosition(this.body, {x: this.x, y:this.y});
        }

        
        if (this.scene.toScreenX(this.x) < -32) {
            this.destroy();
        }

    }
    
}