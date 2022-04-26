class Collectible {
    constructor(scene, x, height, bounceSize = 10, bounceSpeed = 1) {
        this.scene = scene;
        this.height = height;
        this.bounceSize = bounceSize;
        this.bounceSpeed = bounceSpeed;
        // this.body = scene.matter.bodies.circle(x, y, 16, {ignoreGravity: true});
        // this.body.collisionFilter.mask;
        // this.body.collisionFilter.
        this.sprite = scene.add.image(x, 0, 'collectible').setOrigin(.5);
        scene.collectibles.push(this);
    }

    update(time, delta) {

        if (this.scene.toScreenX(this.sprite.x) < -32) {
            this.destroy();
        }

        const distanceToPlayer = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
        if (distanceToPlayer < 32) {
            this.scene.player.collectibleCount += 1;
            this.scene.collectibleCount += 1;
            this.destroy();
        }

        if (this.isDestroyed) {
            return;
        }

        this.sprite.x -= delta * .1;

        const closestPlatform = this.scene.getClosestPlatform(this.sprite.x);
        if (closestPlatform) {
            // this.scene.matter.body.setPosition(this.body, {});
            this.sprite.y = closestPlatform.getElevationFromPositionX(this.sprite.x) - 32 - (Math.sin(time * .01 * this.bounceSpeed) * .5 + 1) * this.bounceSize - this.height;
        }
        
    }

    destroy() {
        this.sprite.destroy();
        this.isDestroyed = true;
    }
}