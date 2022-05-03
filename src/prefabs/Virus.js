class Virus extends Enemy {
    constructor(scene, x, y, texture, frame, pointValue, scale = .6){
        super(scene, x, y, texture, frame, pointValue);
        this.scale = scale;
        this.setScale(scale);
        this.scene.matter.world.remove(this.body);
        this.body = scene.matter.add.circle(x, y, scale * 75, {ignoreGravity : true});
        this.body.onCollideCallback = (e) => {
            // console.log(e);
            if(e.bodyB.isProjectile && e.bodyB.medicine == 2 && this.isCured == false)
                this.cured();
        }

    }    


    destroy(){
        if(this.scale > 0.3 && !this.isDestroyed){
            var newScale = this.scale/3;
            if (newScale < 0.3){
                newScale = 0.3;
            }
            this.scene.enemies.push(new Virus(this.scene, this.x + 100, this.y, 'EnemyGreen', 0, 30, newScale));
            this.isDestroyed = true;
        }
        super.destroy();
    }
}