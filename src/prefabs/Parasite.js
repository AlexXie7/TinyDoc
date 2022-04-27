

class Parasite extends Enemy {
    
    constructor(scene, x, y, texture, frame, pointValue, index = 0) {
        super(scene, x, y, texture, frame, pointValue);
        this.next = null;
        this.index = index;
        //console.log('hello');
        //this.create();

        // this.max = this.scene.platforms[this.scene.platforms.length - 1].getElevationFromPositionX(this.x);
        // this.min = this.max - gameRadius;

        // console.log(this.max);
        // console.log(this.min);

        this.rising = false;
        this.moveSpeed = 0;

        this.bounceSize = gameRadius;
        this.bounceSpeed = .7;


        //this.maxMin = gameCenterY + gameRadius + Math.sin(this.scene.sinProgress) * 15;
        
        // if(this.index < 5) {
        //     this.next = new Parasite(this.scene, this.x - 14, this.y - 14, 'red', 0, 30, this.index + 1);
        // }
    }



    preload(){
        //scene.load.image('red', './assets/red.png');
    }

    create() {
        // var head = scene.matter.add.image(game.config.width - 100, maxMin,'red');
        // var temp = head;
        // head.index = 0;

        // for (var i = 1; i < 5; i++){
        //      var bodySec = scene.matter.add.image(temp.x - 14, temp.y - 14, 'red');
        //      temp.next = bodySec;
        //      temp = bodySec;
        //      temp.index = i;
        // }


        // temp.next = null;

        console.log('fifteen')

    }
    
    update(time, delta) {
        // this.maxMin = gameCenterY + gameRadius + Math.sin(this.scene.sinProgress) * 15;
        // this.x ;
        // this.y = this.maxMin - this.index * 14;
        // console.log(this.scene);

        // sets the height of the collectible
        const closestPlatform = this.scene.getClosestPlatform(this.x);
        if (closestPlatform) {
            this.y = closestPlatform.getElevationFromPositionX(this.x) - (Math.sin(time * .01 * this.bounceSpeed) * .5 + 1) * this.bounceSize;
        }

        // this.x -= delta * .1;        
        
        if (this.scene.toScreenX(this.x) < -32) {
            this.destroy();
        }




        // if(this.rising) {
        //     // console.log('rising');
        //     // console.log(this.y);
        //     // console.log('max');
        //     // console.log(this.max);
        //     this.y -= 10;
        // } else {
        // //     // console.log('falling');
        // //     // console.log(this.y);
        // //     // console.log('min');
        // //     // console.log(this.min);
        // //     this.y += 1;
        // }

        // if(this.y >= this.min) {
        //     this.rising = true;
        //     // console.log('rising');
        // }
        // if (this.y <= this.max){
        //     this.rising = false;
        //     // console.log('falling');
        // }

        // temp = head.next;
        // temp.x = head.x - 14;
        // temp.y = head.y - 14;
        // while(temp.next !== null){
        //     temp.next.x = temp.x - 14;
        //     temp.next.y = temp.y - 14;
        //     temp = temp.next;
        // }
        // if (this.x <= 0){
        //     let temp = this.next;
        //     while(temp !== null) {
        //         temp.destroy();
        //     }
        // }
    }
    
}