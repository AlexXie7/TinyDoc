class Player {
    constructor(scene) {
        this.scene = scene;

        this.body = scene.matter.add.circle(100, gameCenterY, 16);
        this.sprite = scene.add.sprite(0, 0, 'player', 0).setOrigin(.5);

        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.body.onCollideActiveCallback = (e) => {
            if (e.bodyB.platformType === 'ground') {
                this.body.touchingGround = true;
            }
        }

        this.body.onCollideEndCallback = (e) => {
            this.body.touchingGround = false;
        }
    }

    update(time, delta) {
        
        if (this.body.touchingGround) {
            this.scene.matter.body.applyForce(this.body, this.body.position, {x: .0008, y: 0});
        }

        if (this.jumpKey.isDown) {
            if (this.body.touchingGround) {
                this.scene.matter.body.applyForce(this.body, this.body.position, {x: .01, y: -.02});
            }
        }

        this.sprite.setPosition(this.body.position.x, this.body.position.y);
        
    }

    get position() {
        return this.body.position;
    }

    get touchingGround() {
        return this.body.touchingGround;
    }
}