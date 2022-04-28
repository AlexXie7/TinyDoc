class Player {
    constructor(scene) {
        this.scene = scene;

        // create matter body
        this.body = scene.matter.add.circle(100, gameCenterY, 16);
        this.body.collisionFilter.category = 0x10;
        this.body.collisionFilter.mask = 0x00;

        // setup sprites
        this.spriteOffsetY = -42;
        this.syringeOffsetY = 6;
        this.sprite = scene.add.sprite(0, this.body.position.y + this.spriteOffsetY, 'player', 0).setOrigin(.5).setDepth(1);
        this.syringeSprite = scene.add.sprite(0, this.sprite.y + this.syringeOffsetY, 'syringe', 0).setOrigin(.5).setDepth(1);
        this.syringeHandsSprite = scene.add.sprite(0, this.syringeSprite.y, 'syringeHands', 0).setOrigin(.5).setDepth(1);

        // setup jump key
        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.coolDownTime = 100;

        // equipped medicine
        this.medicine = 0;

        this.collectableCount = 0;
    }

    update(time, delta) {
        
        // gets mouse pointer
        const pointer = game.input.activePointer;

        // set player's y position and prevent player from falling through platform, and set touching ground property
        this.closestPlatform = this.scene.getClosestPlatform(this.body.position.x);
        const forcedY = this.closestPlatform.getElevationFromPositionX(this.body.position.x) - this.body.circleRadius;
        if (this.body.position.y > forcedY) {
            this.scene.matter.body.translate(this.body, {x: 0, y: -(this.body.position.y - forcedY)});
            this.touchingGround = true;
        }

        // move forward if touching hte ground
        if (this.touchingGround) {
            if (this.body.velocity.x < 8) {
                this.scene.matter.body.applyForce(this.body, this.body.position, {x: .0035, y: 0});
            }
        }

        // jump if touching the ground
        if (this.jumpKey.isDown) {
            if (this.touchingGround) {
                this.scene.matter.body.setVelocity(this.body, {x: this.body.velocity.x, y: 0});
                this.scene.matter.body.applyForce(this.body, this.body.position, {x: .005, y: -.02});
                this.touchingGround = false;
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
        const rotation = Math.min(Math.PI/3, Math.max(-Math.PI/3, Math.atan((pointer.y - this.syringeSprite.y) / Math.max(0, (pointer.x - cameraOffsetX)))));
        this.syringeSprite.rotation = rotation;
        this.syringeHandsSprite.rotation = rotation;

        if (rotation > Math.PI / 6) {
            this.syringeHandsSprite.flipX = true;
            this.syringeHandsSprite.flipY = false;
        } else if (rotation < -Math.PI / 6) {
            this.syringeHandsSprite.flipX = true;
            this.syringeHandsSprite.flipY = true;
        } else {
            this.syringeHandsSprite.flipX = false;
            this.syringeHandsSprite.flipY = false;
        }
    }

    get position() {
        return this.body.position;
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
        let tint;
        if (this.medicine === 0) {
            tint = 0xFF6A00;
        } else if (this.medicine === 1) {
            tint = 0xB200FF;
        } else if (this.medicine === 2) {
            tint = 0x00FF21;
        }
        const tan = Math.tan(this.syringeSprite.rotation);
        const projectile = new Projectile(this.scene, this.syringeSprite.x, this.syringeSprite.y, 1, tan, .08, tint);
        
        // create timer to reset syringe
        this.timer = setTimeout(() => {
            this.isFiring = false;
            this.syringeSprite.setFrame(this.medicine * 2);
        }, this.coolDownTime);

        this.isFiring = true;
    }
}