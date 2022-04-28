class Virus extends Enemy {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame, pointValue);
        this.setScale(.1);
    }    
}