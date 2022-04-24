class Projectile {
    constructor(scene, x, y, dx, dy, force = .07) {
        this.scene = scene;

        // create matter body
        this.body = scene.matter.add.circle(x, y, 16);
        this.body.collisionFilter.category = 0x100;
        this.body.collisionFilter.mask = 0x01;

        this.body.onCollideCallback = (e) => {
            this.destroy();
        }

        this.sprite = scene.add.image(x, y, 'projectile');

        // add to projectile list
        scene.projectiles.push(this);

        // applies an initial force based on the dx dy direction vector multiplied by the force
        const forceVector = new Phaser.Math.Vector2(dx, dy);
        forceVector.normalize();
        forceVector.scale(force);
        scene.matter.body.applyForce(this.body, this.body.position, {x: forceVector.x, y: forceVector.y});
    }

    update() {
        this.sprite.setPosition(this.body.position.x, this.body.position.y);
    }

    destroy() {
        this.scene.matter.world.remove(this.body);
        this.sprite.destroy();
        this.isDestroyed = true;
    }
}