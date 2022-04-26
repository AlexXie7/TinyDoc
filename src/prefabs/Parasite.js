

class Parasite extends Enemy {
    
    constructor(scene, x, y, texture, frame, pointValue, index) {
        super(scene, x, y, texture, frame, pointValue);
        this.next = null;
        this.index = index;
        console.log('hello');
        //this.create();

        this.max = this.scene.platforms[this.scene.platforms.length - 1].startY + gameRadius;
        this.min = this.scene.platforms[this.scene.platforms.length - 1].startY;

        this.rising = false;


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
    
    update() {
        this.maxMin = gameCenterY + gameRadius + Math.sin(this.scene.sinProgress) * 15;
        //this.x -= 0.5;
        // this.y = this.maxMin - this.index * 14;

        if(this.rising) {
            console.log('rising');
            console.log(this.y);
            console.log('max');
            console.log(this.max);
            this.y -= 14;
        } else {
            console.log('falling');
            console.log(this.y);
            console.log('min');
            console.log(this.min);
            this.y += 14;
        }

        if(this.y >= this.min) {
            this.rising = true;
        }
        if (this.y <= this.max){
            this.rising = false;
        }

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