

class Parasite extends Enemy {
    
    constructor(scene, x, y, texture, frame, pointValue, index = 0) {
        super(scene, x, y, texture, frame, pointValue);
        this.next = null;
        this.index = index;

        this.bounceSize = gameRadius;
        this.bounceSpeed = .7;

    }
    
    update(time, delta) {


        // sets the height of the enemy
        const closestPlatform = this.scene.getClosestPlatform(this.x);
        if (closestPlatform) {
            this.y = closestPlatform.getElevationFromPositionX(this.x) - (Math.sin(time * .01 * this.bounceSpeed) * .5 + 1) * this.bounceSize;
            this.scene.matter.body.setPosition(this.body, {x: 0, y:this.y});
        }

        
        if (this.scene.toScreenX(this.x) < -32) {
            this.destroy();
        }

    }
    
}