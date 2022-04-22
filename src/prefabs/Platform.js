class Platform {
    constructor(scene, x, startY, endY = startY) {
        this.scene = scene;
        
        this.x = x;
        this.startY = startY;
        this.endY = endY;

        this.isSlope = startY !== endY;
        this.textureKey = startY === endY ? 'flat' : 'slope';

        const differenceY = endY - startY;
        this.verticesArray = [
            {x: 0, y: 0},
            {x: 64, y: differenceY},
            {x: 64, y: differenceY + 64},
            {x: 0, y: 64}
        ];
        
        // create platform bodies
        this.bottomPlatformBody = scene.matter.add.fromVertices(this.x, gameCenterY + startY + gameRadius, this.verticesArray, {isStatic: true});
        this.topPlatformBody = scene.matter.add.fromVertices(this.x, gameCenterY + startY - gameRadius, this.verticesArray, {isStatic: true});
        scene.matter.body.translate(this.bottomPlatformBody, {x: 0, y: differenceY / 2});
        scene.matter.body.translate(this.topPlatformBody, {x: 0, y: differenceY / 2});

        // create platform images
        // if (!this.isSlope) {
        //     scene.add.image(this.x, gameCenterY + startY - 100, 'flat');
        // }
        this.bottomSurfaceImage = scene.add.image(this.x, gameCenterY + startY + gameRadius - 32 + differenceY / 2 + 8, 'surface').setOrigin(.5);
        this.bottomSurfaceImage.rotation = Math.asin(differenceY / 64);
        this.topSurfaceImage = scene.add.image(this.x, gameCenterY + startY - gameRadius + 32 + differenceY / 2 - 8, 'surface').setOrigin(.5);
        this.topSurfaceImage.rotation = Math.asin(differenceY / 64);

        this.bottomPlatformBody.platformType = 'ground';
    }

    update(time, delta) {

        if (this.scene.player.body.position.x - this.bottomPlatformBody.position.x > 128) {
            this.destroy();
        }

    }

    destroy() {
        
        this.scene.matter.world.remove(this.bottomPlatformBody);
        this.scene.matter.world.remove(this.topPlatformBody);
        this.bottomSurfaceImage.destroy();
        this.topSurfaceImage.destroy();
        
        this.isDestroyed = true;
        // console.log('destroyed')
    }

    addPositionX(x) {
        
        this.x += x;
        this.scene.matter.body.translate(this.bottomPlatformBody, {x, y: 0});
        this.scene.matter.body.translate(this.topPlatformBody, {x, y: 0});
        this.bottomSurfaceImage.x += x;
        this.topSurfaceImage.x += x;
    }

    // setPositionX(x) {
        
    //     this.bottomPlatformBody.position.x = x;
    //     this.x = x;
    // }
}