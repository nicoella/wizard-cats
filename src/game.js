import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously} from 'firebase/auth';
import { getDatabase, set, ref, onValue, onChildAdded, onDisconnect, remove, update, push, onChildChanged, get, child, db } from "firebase/database";


const FBconfig = {
    apiKey: "AIzaSyCICPepb-VHI8gyp7lnExZ7LDXHHBzrC20",
    authDomain: "wiz-cats.firebaseapp.com",
    databaseURL: "https://wiz-cats-default-rtdb.firebaseio.com",
    projectId: "wiz-cats",
    storageBucket: "wiz-cats.appspot.com",
    messagingSenderId: "160626562720",
    appId: "1:160626562720:web:55a12ada7c9952e98e5bc5"
};

class HealthBar {

    constructor (scene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 146 / 100;

        this.draw();

        scene.add.existing(this.bar);

        this.playerData;
    }

    decrease (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 150, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 146, 12);

        if (this.value < 30)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }
}

class Game extends Phaser.Scene {
    constructor(){
        super({ key: 'Game' });
        this.firebaseApp = initializeApp(FBconfig);
        this.db = getDatabase(this.firebaseApp);
    }

    init(data)
    {
        console.log('init', data);
        this.playerNumber = data.playerNumber;
        this.gameCode = data.gameCode;
        this.playerChar = data.playerChar;
        this.playerCount = data.playerCount;
    }

    preload (){
        this.load.image('level', 'assets/level.png');
        this.load.image('health-bar', 'assets/health-bar.png');
        this.load.image('blackline','assets/blackline.png');
        this.load.image('orb', 'assets/orb.png');
        this.load.image('terrain', 'assets/terrain.png');
        this.load.image('platform1', 'assets/platform1.png');
        this.load.image('platform2', 'assets/platform2.png');
        this.load.image('vines','assets/vines.png');
        this.load.spritesheet('tabby', 
            'assets/cat-tabby.png',
            { frameWidth: 52, frameHeight: 48 }
        );
        this.load.spritesheet('siamese', 
            'assets/cat-siamese.png',
            { frameWidth: 52, frameHeight: 48 }
        );
        this.load.spritesheet('grey', 
            'assets/cat-grey.png',
            { frameWidth: 52, frameHeight: 48 }
        );
        this.load.spritesheet('black', 
            'assets/cat-black.png',
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

        this.player = this.physics.add.sprite(100, 450, this.playerChar).setDepth(1000);

        this.player.setBounce(0.2);
        this.player.body.setGravityY(400)
        this.player.setCollideWorldBounds(true);

        this.playerHealth = new HealthBar(this, 100, 100);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(this.playerChar, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'leftpause',
            frames: [ { key: this.playerChar, frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(this.playerChar, { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'rightpause',
            frames: [ { key: this.playerChar, frame: 2 } ],
            frameRate: 20
        });

        this.physics.add.collider(this.player, this.platforms);

        // FIrebase player stuff

        const allPlayersRef = ref(this.db, `${this.gameCode}/players`);
        onValue(allPlayersRef, (snapshot) => {  // update location of all the other players
            this.players = snapshot.val() || {};
            Object.keys(this.players).forEach(characterKey => {
                if (characterKey != this.playerNumber){
                    const updatedPlayer = this.players[characterKey];
                    const curPlayer = this.playerData[characterKey];
                    curPlayer.x = updatedPlayer.x;
                    curPlayer.y = updatedPlayer.y;
                    curPlayer.body.velocity.x = 0;
                    curPlayer.body.velocity.y = 0;
                    curPlayer.anims.play(updatedPlayer.animation, true);
                }
            })
        })

        onChildAdded(allPlayersRef, (snapshot) => { // draw all the other players
            const addedPlayer = snapshot.val();
            if (addedPlayer.id != this.playerNumber){
                var newChar = this.physics.add.sprite(addedPlayer.x, addedPlayer.y, addedPlayer.character);
                this.physics.add.collider(newChar, this.platforms);
                this.physics.add.collider(newChar, this.drawnPlatform);
                this.playerData[addedPlayer.id] = newChar;
            }
            // var par = document.getElementById("box");
            // var bt = document.createElement("button");
            // bt.textContent = addedPlayer.x;
            // par.appendChild(bt);
        })

        
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

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)))
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

        // update ur position in firebase
        if (Math.round(this.player.x) != this.previousX || Math.round(this.player.y) != this.previousY) {
            this.uref = ref(this.db, `${this.gameCode}/players/${this.playerNumber}`);
            set(this.uref, {
                id: this.playerNumber,
                playerCount: this.playerCount,
                character: this.playerChar,
                x: Math.round(this.player.x),
                y: Math.floor(this.player.y),
                animation: this.player.anims.currentAnim.key
            })
        }
        this.previousX = Math.round(this.player.x);
        this.previousY = Math.round(this.player.y);
    }
}


export default Game;