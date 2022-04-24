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

        // this.label = this.add.text(20, 20, 'player distance');
    }

    update() {

        
    }

    // sets the health bar's scale based on percentage
    setHealth(percent) {
        this.healthBar.scaleX = percent;
    }

    // moves the medicine select brackets based on the medicine index (0, 1, 2)
    setMedicine(i) {
        this.medicineSelect.x = 20 + (64 + 10) * i;
    }
}