class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {

        this.load.image('player', './assets/player.png');
        this.load.spritesheet('syringe', './assets/syringe.png', {
            frameWidth: 128,
            frameHeight: 64
        });
        this.load.image('syringeHands', './assets/syringe-hands.png');

        this.load.image('surface', './assets/surface.png');

        this.load.image('flesh', './assets/flesh.png');

        this.load.image('projectile', './assets/medicine-particle.png');
        this.load.image('medicineParticle', './assets/medicine-particle.png');


        this.load.image('collectable', './assets/sugar.png');

        this.load.spritesheet('EnemyGreen', './assets/greenEnemy1SpriteSheet.png', {
            frameWidth: 240, frameHeight: 223,
            startFrame: 0, endFrame: 5
        });
        this.load.image('EnemyOrange', './assets/EnemyOrange.png');
        this.load.image('EnemyPurpleHead', './assets/EnemyPurpleHead.png');
        this.load.image('EnemyPurpleBody', './assets/EnemyPurpleBody.png');
        this.load.image('EnemyPurpleTail', './assets/EnemyPurpleTail.png');


        // load sounds
        this.load.audio('playerRun', './assets/foot steps.wav');
        this.load.audio('playerShoot', './assets/squirting.wav');
        this.load.audio('playerSwitchMedicine', './assets/switch medicine.wav');
        this.load.audio('collectable', './assets/fat collecting.wav');
        this.load.audio('enemyKilled', './assets/Enemy killed.wav');
        this.load.audio('damaged', './assets/score loss health.wav');
    }

    create() {
        // launch background and ui scene
        this.scene.launch('backgroundScene');
        this.backgroundScene = this.scene.get('backgroundScene');
        this.scene.launch('uiScene');
        this.uiScene = this.scene.get('uiScene');
        
        // set camera view size
        this.cameras.resize(game.config.width * 5, 1080);
        this.camera = this.cameras.main;

        // create arrays to store platforms and projectiles
        this.platforms = [];
        this.projectiles = [];
        this.collectables = [];
        this.enemies = [];

        // create player
        this.player = new Player(this);

        // create initial platforms
        for (let i = 0; i < Math.floor(game.config.width / gamePlatformSize) + 3; i++) {
            this.createPlatform();
        }

        // set the distance that the game shifts when the player is too far from the origin
        this.gameShiftDistance = game.config.width * 4;

        // set switch medicine keys
        this.medicine1key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.medicine2key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.medicine3key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        this.nextCollectableTime = 1000;
        this.collectableTimer = 0;
        this.collectableCount = 0; // number of collected collectables, not number of total collectables

        this.nextEnemyTime = 1500;
        this.enemyTimer = 0;

        this.score = 0;
        this.damage = 0;

        this.gameOver = false;
    }   


    update(time, delta) {

        if (this.gameOver) {
            // this.scene.pause();
            return;
        }

        // checks if the player is a distance from the origin, and shift the entire game back
        if (this.player.body.position.x > this.gameShiftDistance + 128) {
            this.shiftGame();
        }

        // update all platforms every frame
        for (let i = 0; i < this.platforms.length; i++) {
            const platform = this.platforms[i];
            if (platform.isDestroyed) {
                this.platforms.splice(0, 1);
                i -= 1;
                this.createPlatform();
            } else {
                platform.update(time, delta);
            }
        }

        // update the player
        this.player.update(time, delta);
        
        // make the main camera follow the player
        this.camera.x = -this.player.body.position.x + cameraOffsetX;

        // update all projectiles every frame
        for (let i = 0; i < this.projectiles.length; i++) {
            const projectile = this.projectiles[i];
            if (projectile.isDestroyed) {
                this.projectiles.splice(0, 1);
                i -= 1;
            } else {
                projectile.update(time, delta);
            }
        }

        // update all collectables every frame
        for (let i = 0; i < this.collectables.length; i++) {
            const collectable = this.collectables[i];
            if (collectable.isDestroyed) {
                this.collectables.splice(0, 1);
                i -= 1;
            } else {
                collectable.update(time, delta);
            }
        }
        

        // spawns a collectable at random intervals
        if (this.collectableTimer >= this.nextCollectableTime) {
            this.spawnCollectable();            
            this.collectableTimer -= this.nextCollectableTime;
            this.nextCollectableTime = Math.random() * 2000 + 1000; // sets the delay for the next collectable to spawn
        }
        this.collectableTimer += delta;

        // spawns enemies at random intervals
        if (this.enemyTimer >= this.nextEnemyTime) {
            const enemyHeight = Math.random() * gameRadius;
            const enemyBounceSize = 30;
            const enemyBounceSpeed = .5;
            
            // creates new enemy
            this.spawnEnemy();
            
            this.enemyTimer -= this.nextEnemyTime;
            this.nextEnemyTime = Math.random() * 2000 + 6000; // sets the delay for the next enemy to spawn
        }
        this.enemyTimer += delta;



        // Enemy update
        // update all enemies every frame
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            if (enemy.isDestroyed) {
                this.enemies.splice(0, 1);
                i -= 1;
            } else {
                enemy.update(time, delta);
            }
        }


        // change medicine when specific keys are down
        if (Phaser.Input.Keyboard.JustDown(this.medicine1key)) {
            this.sound.play('playerSwitchMedicine', {volume: .5});
            this.uiScene.setMedicine(0); // changes the medicine selector in the UI
            this.player.setMedicine(0); // changes the medicine in the player's syringe
        } else if (Phaser.Input.Keyboard.JustDown(this.medicine2key)) {
            this.sound.play('playerSwitchMedicine', {volume: .5});
            this.uiScene.setMedicine(1);
            this.player.setMedicine(1);
        } else if (Phaser.Input.Keyboard.JustDown(this.medicine3key)) {
            this.sound.play('playerSwitchMedicine', {volume: .5});
            this.uiScene.setMedicine(2);
            this.player.setMedicine(2);
        }


        // lose condition
        // pause scene and update ui
        if (this.damage >= 100) {
            this.gameOver = true;
            this.sound.stopAll();
            
            this.backgroundScene.scene.pause();
            this.uiScene.showResults();
        }

    }

    // shifts the entire game back, including platforms, players, enemies, items, etc
    shiftGame() {
        console.log('shifting game')
        for (const platform of this.platforms) {
            platform.translateX(-this.gameShiftDistance);
        }
        for (const projectile of this.projectiles) {
            this.matter.body.translate(projectile.body, {x: -this.gameShiftDistance, y:0});
        }
        for (const collectable of this.collectables) {
            collectable.sprite.x -= this.gameShiftDistance;
        }

        //enemy shift
        for (const enemy of this.enemies) {
            enemy.x -= this.gameShiftDistance;
        }

        this.matter.body.translate(this.player.body, {x: -this.gameShiftDistance, y: 0});
    }

    // creates a new platform next to the last created platform in the platforms array
    createPlatform() {
        
        let previousPlatform = this.platforms.length > 0 ? this.platforms[this.platforms.length - 1] : undefined;

        // x is the platform's position
        // startY is the platform's start elevation relative to the origin
        // endY is the playform's end elevation relative to the origin
        let x, startY, endY;

        if (previousPlatform) {
            x = previousPlatform.x + gamePlatformSize;
            startY = previousPlatform.endY;
        } else {
            x = 0;
            startY = 0;
        }

        // increments the read on the sin function for creating the platform curves
        this.sinProgress = this.sinProgress !== undefined ? this.sinProgress + Math.random() * .5 : 0;

        endY = Math.sin(this.sinProgress) * gameCurviness; // adjusts the curviness ex: 30 is pretty smooth and light
        
        // creates the platform and adds it to the platform array
        const platform = new Platform(this, x, startY, endY);
        this.platforms.push(platform);
        
    }

    // convert screen X position to a world X position
    toWorldX(screenX) {
        return screenX - cameraOffsetX + this.player.body.position.x;
    }

    // convert world X position to a screen X position
    toScreenX(worldX) {
        return worldX - (this.player.body.position.x - cameraOffsetX);
    }

    // gets the closest platform in the world based on world X position
    getClosestPlatform(x) {
        const index = Math.round((x - this.platforms[0].x) / gamePlatformSize);
        return index >= 0 && index < this.platforms.length ? this.platforms[index] : undefined; 
    }

    // gets the closest platform in the world based on screen X position
    getClosestPlatformFromScreen(screenX) {
        return this.getClosestPlatform(this.toWorldX(screenX));
    }


    // score functions
    // set current score
    setScore(score) {
        this.score = score;
        this.uiScene.setScore(this.score);
    }

    // add to current score
    addScore(amount) {
        this.score += amount;
        this.uiScene.setScore(this.score);
    }

    // add damage
    addDamage(amount) {
        this.damage = Math.max(this.damage + amount, 0);
        const percent = 1 - (this.damage / 100);
        this.uiScene.setHealth(percent);
        this.backgroundScene.setTintFromHealth(percent);
        this.sound.play('damaged');
    }

    // spawns a collectable to the scene
    spawnCollectable() {
        const collectableHeight = Math.random() * gameRadius;
        const collectableBounceSize = 30;
        const collectableBounceSpeed = .5;
        
        // creates new collectable
        const collectable = new Collectable(this, this.player.body.position.x + config.scale.width, collectableHeight, collectableBounceSize, collectableBounceSpeed);
        collectable.onCollectCallback = () => {
            this.addScore(100);
            this.player.onCollect();
            this.collectableCount += 1;
        }
        return collectable;
    }

    spawnEnemy(){
        let enemyType = Math.random();
        let numParas = 5; //index starts at zero

        if(enemyType <= 0){
            this.enemies.push(new Bacteria(this, this.player.body.position.x + config.scale.width, gameCenterY, 'EnemyOrange', 0, 30));
        } else if(enemyType <= 0) {
            this.enemies.push(new Virus(this, this.player.body.position.x + config.scale.width, gameCenterY, 'EnemyGreen', 0, 30));
        } else {
            console.log("Spawning paras")
            let prev = null;
            for(let i = 0; i < numParas; i++){
                prev = new Parasite(this, this.player.body.position.x + config.scale.width + (32*i), gameCenterY, 'EnemyGreen', 0, 30, i, prev);
                this.enemies.push(prev);
            }
        }
        //this.enemies[this.enemies.length-1].setScale(.1);
    }
}