class Game extends Phaser.Scene {
    constructor(){
        super({ key: 'Game' });
    }

    preload (){
        this.load.image('level', 'assets/level.png');
        this.load.image('blackline','assets/blackline.png');
        this.load.image('orb', 'assets/orb.png');
        this.load.image('terrain', 'assets/terrain.png');
        this.load.image('platform1', 'assets/platform1.png');
        this.load.image('platform2', 'assets/platform2.png');
        this.load.image('vines','assets/vines.png');
        this.load.spritesheet('cat-tabby', 
            'assets/cat-tabby.png',
            { frameWidth: 52, frameHeight: 48 }
        );
    }

    create (){
        // Adding sprites
        this.add.image(400, 300, 'level');
        this.add.image(400,300,'blackline');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400,568,'terrain');
        this.platforms.create(192,416,'platform1');
        this.platforms.create(570,318,'platform2');
        
        this.add.image(400,300,'vines');
        

        let playerChar = 'cat-tabby';

        this.player = this.physics.add.sprite(100, 450, playerChar).setDepth(1000);

        this.player.setBounce(0.2);
        this.player.body.setGravityY(400)
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(playerChar, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'leftpause',
            frames: [ { key: playerChar, frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(playerChar, { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'rightpause',
            frames: [ { key: playerChar, frame: 2 } ],
            frameRate: 20
        });

        this.physics.add.collider(this.player, this.platforms);

        // Bullet Class
        var Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'orb');
    
                this.speed = Phaser.Math.GetSpeed(600, 1);
            },
    
            fire: function (x, y, dir)
            {
                this.setPosition(x, y);

                if (dir == 1){
                    if (this.speed > 0){
                        this.speed *= -1;
                    }
                }
                else{
                    if (this.speed < 0){
                        this.speed *= -1;
                    }
                }
    
                this.setActive(true);
                this.setVisible(true);
            },
    
            update: function (time, delta)
            {
                this.x += this.speed * delta;
    
                if (this.x > 800 || this.x < 0)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
    
        });
    
        this.bullets = this.add.group({
            classType: Bullet,
            maxSize: 30,
            runChildUpdate: true
        });
    }

    update (){
        var pointer = this.input.activePointer;
        let cursors = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D,
            spacebar:Phaser.Input.Keyboard.KeyCodes.SPACE
        });;

        if (cursors.left.isDown)
        {
            this.player.setVelocityX(-200);

            if (pointer.worldX > this.player.x){
                this.player.anims.play('right', true);
            }
            else{
                this.player.anims.play('left', true);
            }
        }
        else if (cursors.right.isDown)
        {
            this.player.setVelocityX(200);

            if (pointer.worldX > this.player.x){
                this.player.anims.play('right', true);
            }
            else{
                this.player.anims.play('left', true);
            }
        }
        else
        {
            this.player.setVelocityX(0);

            if (pointer.worldX > this.player.x){
                this.player.anims.play('rightpause');
            }
            else{
                this.player.anims.play('leftpause');
            }
        }

        if (cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-500);
        }

        if (pointer.isDown)
        {
            var bullet = this.bullets.get();
            if (bullet)
            {
                if (pointer.worldX > this.player.x){
                    bullet.fire(this.player.x, this.player.y, 0);
                }
                else{
                    bullet.fire(this.player.x, this.player.y, 1);
                }
            }
        }
    }
}


export default Game;