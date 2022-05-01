class UI extends Phaser.Scene {
    constructor() {
        super('uiScene');
    }
    
    preload() {
        this.load.image('medicine1', './assets/medicine1.png');
        this.load.image('medicine2', './assets/medicine2.png');
        this.load.image('medicine3', './assets/medicine3.png');
        this.load.image('medicineSelect', './assets/medicine-select.png');
        this.load.image('healthContainer', './assets/health-container.png');
        this.load.image('healthBar', './assets/health-bar.png');
    }

    create() {
        this.playScene = this.scene.get('playScene');

        // creates the medicine options in the bottom left
        this.add.image(20, game.config.height - 20, 'medicine1').setOrigin(0,1);
        this.add.image(20 + 64 + 10, game.config.height - 20, 'medicine2').setOrigin(0,1);
        this.add.image(20 + (64 + 10) * 2, game.config.height - 20, 'medicine3').setOrigin(0,1);

        // creates the medicine selection brackets in the bottom left
        this.medicineSelect = this.add.image(20, game.config.height - 20, 'medicineSelect').setOrigin(0,1);

        // adds patient health bar
        this.add.text(game.config.width - 20, game.config.height - 64, 'patient health').setOrigin(1,1);
        this.healthBar = this.add.image(game.config.width - 20 - 128, game.config.height - 20, 'healthBar').setOrigin(0,1);
        this.add.image(game.config.width - 20, game.config.height - 20, 'healthContainer').setOrigin(1,1);
        
        // health bar's scale matches the health's percentage
        this.healthBar.scaleX = 1;
        this.healthBar.defaultY = this.healthBar.y;
        this.healthBarShake = 0;

        this.scoreText = this.add.text(20, 20, '0', {
            fontSize: '64px',
            stroke: '#000',
            strokeThickness: 4
        });
        this.scoreText.defaultY = this.scoreText.y;
        this.scoreLabel = this.add.text(20, 84, 'SCORE');
        this.scoreShake = 0;

        // level up text
        this.levelUpText = this.add.text(game.config.width / 2, game.config.height / 2, 'LEVEL UP', {
            fontSize: '80px',
            stroke: '#000',
            strokeThickness: 8,
            color: '#FF0'
        }).setOrigin(.5);
        this.levelUpText.setVisible(false);
        this.levelUpText.defaultY = this.levelUpText.y;

        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.menuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }

    update(time, delta) {

        this.scoreShake -= this.scoreShake * .1 * delta;
        this.scoreText.y = this.scoreText.defaultY + Math.sin(time) * this.scoreShake;

        this.healthBarShake -= this.healthBarShake * .1 * delta;
        this.healthBar.y = this.healthBar.defaultY + Math.sin(time) * this.healthBarShake;

        if (this.levelUpText.progress < 1) {
            this.levelUpText.progress += delta * .001;
            this.levelUpText.y = this.levelUpText.defaultY - this.levelUpText.progress * 100;
            this.levelUpText.setAlpha(1 - this.levelUpText.progress);
            if (this.levelUpText.progress >= 1) {
                this.levelUpText.setVisible(false);
            }
        }

        if (this.playScene.gameOver && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
            this.scene.start('playScene');
        }

        if (this.playScene.gameOver && Phaser.Input.Keyboard.JustDown(this.menuKey)) {
            this.scene.start('menuScene');
        }
    }

    // sets the health bar's scale based on percentage
    setHealth(percent) {
        const difference = this.healthBar.scaleX - percent;
        this.healthBar.scaleX = percent;
        this.healthBarShake = difference * 200;
    }

    // moves the medicine select brackets based on the medicine index (0, 1, 2)
    setMedicine(i) {
        this.medicineSelect.x = 20 + (64 + 10) * i;
    }

    // sets the score text
    setScore(score, shakeAmount = 10) {
        this.scoreText.text = score;
        this.scoreShake = shakeAmount;
    }

    // show level up notification
    levelUp(level) {
        this.levelUpText.text = 'LEVEL UP - ' + level.toString();
        this.levelUpText.progress = 0;
        this.levelUpText.setVisible(true);
    }

    // show game over results
    showResults() {
        this.levelUpText.setVisible(false);
        const titleConfig = {
            fontSize: '128px',
            stroke: '#000',
            strokeThickness: 8,
            color: '#F00'
        };
        const resultsConfig = {
            fontSize: '64px',
            stroke: '#000',
            strokeThickness: 6
        };
        this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', titleConfig).setOrigin(.5, 1);
        this.add.text(game.config.width / 2, game.config.height / 2, 'Final Score: ' + this.scoreText.text, resultsConfig).setOrigin(.5, 0);
        this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press R to Restart', resultsConfig).setOrigin(.5, 0);
        this.add.text(game.config.width / 2, game.config.height / 2 + 128, 'Press M to return to Menu', resultsConfig).setOrigin(.5, 0);
    }

}