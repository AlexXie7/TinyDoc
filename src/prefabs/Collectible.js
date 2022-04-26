class Collectible {
    constructor(scene, x, height, bounceSize = 10, bounceSpeed = 1) {
        this.scene = scene;
        this.height = height;
        this.bounceSize = bounceSize;
        this.bounceSpeed = bounceSpeed;

        this.onCollectCallback;
        
        this.sprite = scene.add.image(x, 0, 'collectible').setOrigin(.5);
        scene.collectibles.push(this);
    }

    update(time, delta) {

        if (this.scene.toScreenX(this.sprite.x) < -32) {
            this.destroy();
        }

        // uses distance to check if the player is touching
        const distanceToPlayer = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
        if (distanceToPlayer < 32) {

            // if distance is close enough, it will call the callback if defined, and destroy
            if (this.onCollectCallback) {
                this.onCollectCallback();
            }

            this.destroy();
        }

        if (this.isDestroyed) {
            return;
        }

        this.sprite.x -= delta * .1;

        // sets the height of the collectible
        const closestPlatform = this.scene.getClosestPlatform(this.sprite.x);
        if (closestPlatform) {
            this.sprite.y = closestPlatform.getElevationFromPositionX(this.sprite.x) - 32 - (Math.sin(time * .01 * this.bounceSpeed) * .5 + 1) * this.bounceSize - this.height;
        }
        
    }

    destroy() {
        this.sprite.destroy();
        this.isDestroyed = true;
    }
}