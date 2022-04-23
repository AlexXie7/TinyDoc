class Platform {
    constructor(scene, x, startY, endY = startY) {
        this.scene = scene;
        
        this.x = x;
        this.startY = startY;
        this.endY = endY;

        this.isSlope = startY !== endY;
        this.textureKey = startY === endY ? 'flat' : 'slope';

        const gamePlatformSizeHalf = gamePlatformSize / 2;

        const differenceY = endY - startY;
        this.verticesArray = [
            {x: 0, y: 0},
            {x: gamePlatformSize, y: differenceY},
            {x: gamePlatformSize, y: differenceY + gamePlatformSize},
            {x: 0, y: gamePlatformSize}
        ];
        this.y = gameCenterY + differenceY;
        
        // create and move platform bodies
        this.bottomPlatformBody = scene.matter.add.fromVertices(this.x, gameCenterY + startY + gameRadius + gamePlatformSizeHalf, this.verticesArray, {isStatic: true});
        this.topPlatformBody = scene.matter.add.fromVertices(this.x, gameCenterY + startY - gameRadius - gamePlatformSizeHalf, this.verticesArray, {isStatic: true});
        scene.matter.body.translate(this.bottomPlatformBody, {x: 0, y: differenceY / 2});
        scene.matter.body.translate(this.topPlatformBody, {x: 0, y: differenceY / 2});

        // create flesh filler on the outsides
        this.fleshImage = scene.add.tileSprite(this.x, 0, gamePlatformSize, config.scale.height, 'flesh').setOrigin(.5,0);
        const shape = new Phaser.GameObjects.Graphics(scene);
        shape.fillStyle(0xFFFFFF);
        shape.fillPoints([
            {x:this.x - gamePlatformSizeHalf,y: this.topPlatformBody.position.y + gamePlatformSizeHalf - differenceY / 2},
            {x:this.x - gamePlatformSizeHalf + gamePlatformSize,y:this.topPlatformBody.position.y + gamePlatformSizeHalf + differenceY / 2},
            {x:this.x - gamePlatformSizeHalf + gamePlatformSize,y:this.bottomPlatformBody.position.y - gamePlatformSizeHalf + differenceY / 2},
            {x:this.x - gamePlatformSizeHalf,y:this.bottomPlatformBody.position.y - gamePlatformSizeHalf - differenceY / 2}
        ], true, true);
        this.fleshImage.mask = shape.createGeometryMask();
        this.fleshImage.mask.invertAlpha = true;
        this.fleshMaskShape = shape;


        // create and move platform sprites / images
        this.bottomSurfaceImage = scene.add.image(this.x, this.bottomPlatformBody.position.y -gamePlatformSizeHalf, 'surface').setOrigin(.5);
        this.bottomSurfaceImage.scale = gamePlatformSize / this.bottomSurfaceImage.width;
        this.bottomSurfaceImage.y += this.bottomSurfaceImage.height * this.bottomSurfaceImage.scale / 2;
        this.bottomSurfaceImage.rotation = Math.asin(differenceY / gamePlatformSize);

        this.topSurfaceImage = scene.add.image(this.x, this.topPlatformBody.position.y + gamePlatformSizeHalf, 'surface').setOrigin(.5);
        this.topSurfaceImage.scale = gamePlatformSize / this.topSurfaceImage.width;
        this.topSurfaceImage.y -= this.topSurfaceImage.height * this.topSurfaceImage.scale / 2;
        this.topSurfaceImage.rotation = Math.asin(differenceY / gamePlatformSize);

        this.bottomPlatformBody.platformType = 'ground';
    }

    update(time, delta) {

        // destroy platform when the platform is a certain distance behind the player
        if (this.scene.player.body.position.x - this.bottomPlatformBody.position.x > 100 + gamePlatformSize) {
            this.destroy();
        }

        if (this.isDestroyed) {
            return;
        }

        // prevent player from falling through platform
        if (Math.abs(this.scene.player.body.position.x - this.bottomPlatformBody.position.x) < gamePlatformSize / 2) {
            const differenceY = this.scene.player.body.position.y + this.scene.player.body.circleRadius - (this.bottomPlatformBody.position.y - gamePlatformSize / 2);
            if (differenceY > 3) {
                // console.debug('fixing player position');
                this.scene.matter.body.translate(this.scene.player.body, {x:0,y:-differenceY});
            }
        }

    }

    // destroys the platform
    destroy() {
        
        this.scene.matter.world.remove(this.bottomPlatformBody);
        this.scene.matter.world.remove(this.topPlatformBody);
        this.bottomSurfaceImage.destroy();
        this.topSurfaceImage.destroy();

        this.fleshImage.destroy();
        this.fleshMaskShape.destroy();
        
        this.isDestroyed = true;
        // console.log('destroyed')

    }

    // translates the platform on the x axis
    translateX(x) {
        
        this.x += x;
        this.scene.matter.body.translate(this.bottomPlatformBody, {x, y: 0});
        this.scene.matter.body.translate(this.topPlatformBody, {x, y: 0});
        this.bottomSurfaceImage.x += x;
        this.topSurfaceImage.x += x;

        this.fleshImage.x += x;
        this.fleshMaskShape.x += x;
    }
}