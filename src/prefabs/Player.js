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

        // medicine cooldown
        this.cooldownTime = 800;
        this.cooldownTimer = 0;

        // equipped medicine
        this.medicine = 0;

        // amount of collectables collected
        this.collectableCount = 0;
        this.targetCollectableCount = 3;
        this.level = 0;
        this.jumpForce = .02;
        this.projectileForce = .08;
        this.projectileCount = 1;

        // this.scene.sound.play('playerRun', {volume: .5, loop: true});
        this.runSound = this.scene.sound.add('playerRun', {volume: .5, loop: true})
        this.runSound.play();
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

        // move forward if touching the ground
        if (this.touchingGround) {
            if (this.body.velocity.x < 8) {
                this.scene.matter.body.applyForce(this.body, this.body.position, {x: .0035, y: 0});
            }
            this.runSound.resume();
        } else {
            this.runSound.pause();
        }

        // jump if touching the ground
        if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
            if (this.touchingGround) {
                this.scene.matter.body.setVelocity(this.body, {x: this.body.velocity.x, y: 0});
                this.scene.matter.body.applyForce(this.body, this.body.position, {x: .005, y: -this.jumpForce});
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

        // update cooldown timer
        if (this.cooldownTimer <= 0) {
            this.isFiring = false;
            this.syringeSprite.setFrame(this.medicine * 2);
            this.cooldownTimer += this.cooldownTime;
        }
        if (this.isFiring) {
            this.cooldownTimer -= delta;
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
        this.scene.sound.play('playerShoot', {volume: .5});

        // fire a projectile of medicine
        let tint;
        if (this.medicine === 0) {
            tint = 0xFF6A00;
        } else if (this.medicine === 1) {
            tint = 0xB200FF;
        } else if (this.medicine === 2) {
            tint = 0x00FF21;
        }
        
        for (let i = -1; i < this.projectileCount - 1; i++) {
            const tan = Math.tan(this.syringeSprite.rotation + i * .1);
            const projectile = new Projectile(
                this.scene,
                this.syringeSprite.x, this.syringeSprite.y, // the initial position of the projectile
                1, tan, // the initial direction of the projectile
                this.projectileForce, // the force / speed of the projectile on fire
                tint, // the color of the medicine in hex
                this.medicine // the medicine index the player has currently
            );
        }

        this.isFiring = true;
    }

    // called by collectable when the player collects it
    onCollect() {
        this.collectableCount += 1;
        this.scene.addDamage(-1);
        if (this.collectableCount >= this.targetCollectableCount) {
            console.log('level up');
            this.levelUp();
            this.scene.uiScene.levelUp(this.level);
            this.scene.addDamage(-10);
            this.collectableCount = 0;
            this.targetCollectableCount += 1;
        }
    }

    // upgrades player properties on level up
    levelUp() {
        this.level += 1;
        if (this.level < 5) {
            this.cooldownTime -= 50;
            this.jumpForce += .001;
            this.projectileForce += .001;
        } else if (this.level < 6) {
            this.projectileCount = 2;
        } else if (this.level < 10) {
            this.cooldownTime -= 20;
            this.jumpForce += .001;
            this.projectileForce += .001;
        } else if (this.level < 11) {
            this.projectileCount = 3;
        } else {
            this.cooldownTime = Math.max(this.cooldownTime - 10, 100);
            this.projectileForce += .001;
            this.jumpForce += .001;
        }
    }
}