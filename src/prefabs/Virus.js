class Virus extends Enemy {
    constructor(scene, x, y, texture, frame, pointValue, scale = .3){
        super(scene, x, y, texture, frame, pointValue);
        this.scale = scale;
        this.setScale(scale);
        console.log(this.body);
        this.body.circleRadius = scale * 750;
    }    


    destroy(){
        if(this.scale > 0.1 && !this.isDestroyed){
            var newScale = this.scale/3;
            if (newScale < 0.1){
                newScale = 0.1;
            }
            this.scene.enemies.push(new Virus(this.scene, this.x, this.y, 'EnemyGreen', 0, 30, newScale));
            this.isDestroyed = true;
        }
        super.destroy();
    }
}