class Player {
    constructor(scene) {
        this.scene = scene;

        // create matter body
        this.body = scene.matter.add.circle(100, gameCenterY, 16);
        this.body.collisionFilter.category = 0x10;
        this.body.collisionFilter.mask = 0x01;

        // setup sprites
        this.spriteOffsetY = -42;
        this.syringeOffsetY = 6;
        this.sprite = scene.add.sprite(0, this.body.position.y + this.spriteOffsetY, 'player', 0).setOrigin(.5);
        this.syringeSprite = scene.add.sprite(0, this.sprite.y + this.syringeOffsetY, 'syringe', 0).setOrigin(.5);
        this.syringeHandsSprite = scene.add.sprite(0, this.syringeSprite.y, 'syringeHands', 0).setOrigin(.5);

        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // check if the body is touching the ground
        this.body.onCollideActiveCallback = (e) => {
            if (e.bodyB.platformType === 'ground') {
                this.body.touchingGround = true;
            }
        }

        this.body.onCollideEndCallback = (e) => {
            this.body.touchingGround = false;
        }

        // equipped medicine
        this.medicine = 0;
    }

    update(time, delta) {
        
        // gets mouse pointer
        const pointer = game.input.activePointer;

        // move forward if touching hte ground
        if (this.body.touchingGround) {
            this.scene.matter.body.applyForce(this.body, this.body.position, {x: .0035, y: 0});
        }

        // jump if touching the ground
        if (this.jumpKey.isDown) {
            if (this.body.touchingGround) {
                this.scene.matter.body.applyForce(this.body, this.body.position, {x: .005, y: -.02});
            }
        }

        // shoot if mouse is pressed
        if (pointer.isDown && pointer.button === 0) {
            this.fireMedicine();
            
        }

        // move sprites to the correct place
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y + this.spriteOffsetY;
        this.syringeSprite.x = this.body.position.x;
        this.syringeSprite.y -= (this.syringeSprite.y - (this.sprite.y + this.syringeOffsetY)) * .5;
        this.syringeHandsSprite.setPosition(this.syringeSprite.x, this.syringeSprite.y);
        
        // rotate the syringe to point towards the mouse
        const rotation = Math.atan((pointer.y - this.syringeSprite.y) / (pointer.x - cameraOffsetX))
        this.syringeSprite.rotation = rotation;
        this.syringeHandsSprite.rotation = rotation;
    }

    get position() {
        return this.body.position;
    }

    get touchingGround() {
        return this.body.touchingGround;
    }

    // sets the current medicine with an index
    setMedicine(i) {
        this.medicine = i;
        this.syringeSprite.setFrame(this.medicine * 2);
    }

    fireMedicine() {
        if (this.isFiring) {
            return;
        }

        this.syringeSprite.setFrame(this.medicine * 2 + 1);

        // fire a projectile of medicine
        const pointer = game.input.activePointer;
        const projectile = new Projectile(this.scene, this.syringeSprite.x, this.syringeSprite.y, pointer.x - cameraOffsetX ,pointer.y - this.syringeSprite.y);
        
        // create timer to reset syringe
        this.timer = setTimeout(() => {
            this.isFiring = false;
            this.syringeSprite.setFrame(this.medicine * 2);
        }, 1000);

        this.isFiring = true;
    }
}