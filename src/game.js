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
        this.p = 72 / 100;

        this.draw();

        scene.add.existing(this.bar);
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
        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x, this.y, 72, 7);

        if (this.value < 30)
        {
            this.bar.fillStyle(0xf53333);
        } else if(this.value < 50) {
            this.bar.fillStyle(0xedad4c);
        }
        else
        {
            this.bar.fillStyle(0x7eed5f);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x, this.y, d, 7);
    }
}

class Game extends Phaser.Scene {
    constructor(){
        super({ key: 'Game' });
        this.firebaseApp = initializeApp(FBconfig);
        this.db = getDatabase(this.firebaseApp);
        this.playerData = {};
        this.prevShoot = -100;
        this.bulletImgs = {};
        this.otherPlayer;
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
        this.load.image('player1_text','assets/player-1-text.png');
        this.load.image('player2_text','assets/player-2-text.png');
        this.load.image('health','assets/health-bar.png');
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

        this.add.image(30,20,"player1_text").setOrigin(0,0);
        this.add.image(770,20,"player2_text").setOrigin(1,0);
        this.add.image(20,100,"health").setOrigin(0,0);
        this.add.image(780,100,"health").setOrigin(1,0);

        if (this.playerCount == 1){
            this.player = this.physics.add.sprite(100, 450, this.playerChar).setDepth(1000);
        }
        else{
            this.player = this.physics.add.sprite(700, 450, this.playerChar).setDepth(1000);
        }

        this.player.setBounce(0.2);
        this.player.body.setGravityY(700);
        this.player.setCollideWorldBounds(true);

        if (this.playerCount == 1){
            this.playerHealth = new HealthBar(this, 46, 107);
        }
        else{
            this.playerHealth = new HealthBar(this, 706, 107);
        }
        

        this.anims.create({
            key: 'siamese-left',
            frames: this.anims.generateFrameNumbers("siamese", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'siamese-leftpause',
            frames: [ { key: "siamese", frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'siamese-right',
            frames: this.anims.generateFrameNumbers("siamese", { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'siamese-rightpause',
            frames: [ { key: "siamese", frame: 2 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'tabby-left',
            frames: this.anims.generateFrameNumbers("tabby", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'tabby-leftpause',
            frames: [ { key: "tabby", frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'tabby-right',
            frames: this.anims.generateFrameNumbers("tabby", { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'tabby-rightpause',
            frames: [ { key: "tabby", frame: 2 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'grey-left',
            frames: this.anims.generateFrameNumbers("grey", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grey-leftpause',
            frames: [ { key: "grey", frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'grey-right',
            frames: this.anims.generateFrameNumbers("grey", { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grey-rightpause',
            frames: [ { key: "grey", frame: 2 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'black-left',
            frames: this.anims.generateFrameNumbers("black", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'black-leftpause',
            frames: [ { key: "black", frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'black-right',
            frames: this.anims.generateFrameNumbers("black", { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'black-rightpause',
            frames: [ { key: "black", frame: 2 } ],
            frameRate: 20
        });



        this.physics.add.collider(this.player, this.platforms);

        // FIrebase player stuff

        const allPlayersRef = ref(this.db, `${this.gameCode}/players`);

        onChildAdded(allPlayersRef, (snapshot) => { // draw all the other players
            const addedPlayer = snapshot.val();
            if(addedPlayer.playerCount==1) this.add.image(70,70,addedPlayer.character);
            else this.add.image(730,70,addedPlayer.character);
            if (addedPlayer.id != this.playerNumber){
                console.log("ON CHILD ADDED");
                console.log(addedPlayer.id);
                var newChar = this.physics.add.sprite(addedPlayer.x, addedPlayer.y, addedPlayer.character);
                this.physics.add.collider(newChar, this.platforms);
                this.physics.add.collider(newChar, this.drawnPlatform);
                newChar.setBounce(0.2);
                newChar.body.setGravityY(700);
                if (this.playerCount == 1){
                    newChar.otherplayerHealth = new HealthBar(this, 706, 107);
                }
                else{
                    newChar.otherplayerHealth = new HealthBar(this, 46, 107);
                }
                // newChar.otherplayerHealth = new HealthBar(this, 706, 107);
                newChar.id = addedPlayer.id;
                newChar.x = addedPlayer.x;
                newChar.y = addedPlayer.y;
                this.playerData[addedPlayer.id] = newChar;
                this.otherPlayer = addedPlayer.id;
            }
            // var par = document.getElementById("box");
            // var bt = document.createElement("button");
            // bt.textContent = addedPlayer.x;
            // par.appendChild(bt);
        });

        onValue(allPlayersRef, (snapshot) => {  // update location of all the other players
            this.players = snapshot.val() || {};
            Object.keys(this.players).forEach(characterKey => {
                if (characterKey != this.playerNumber){
                    console.log("ON VALUE");
                    const updatedPlayer = this.players[characterKey];
                    const curPlayer = this.playerData[characterKey];
                    curPlayer.x = updatedPlayer.x;
                    curPlayer.y = updatedPlayer.y;
                    curPlayer.body.velocity.x = 0;
                    curPlayer.body.velocity.y = 0;
                    curPlayer.x = updatedPlayer.x;
                    curPlayer.y = updatedPlayer.y;
                    curPlayer.otherplayerHealth.value = updatedPlayer.health;
                    curPlayer.otherplayerHealth.draw();
                    curPlayer.anims.play(updatedPlayer.animation, true);

                    if (curPlayer.otherplayerHealth.value === 0){
                        this.add.text(400,200,"you win!",{fontFamily: 'minecraft '}).setOrigin(0.5);
                        this.scene.pause();
                    }
                }
            })
        });

        onChildChanged(ref(this.db, `${this.gameCode}/bullets`), (snapshot) => {
            const bullet = snapshot.val();
            if(bullet.owner != this.playerNumber) {
                if(this.bulletImgs[bullet.id]) this.bulletImgs[bullet.id].destroy();
                if(bullet.status) {
                    this.bulletImgs[bullet.id] = this.add.image(bullet.x,bullet.y,'orb');
                    //console.log(bullet.x+" "+bullet.y+" "+this.player.x+" "+this.player.y)
                    if(bullet.x >= this.player.x - 12 && bullet.x <= this.player.x + 12 && bullet.y >= this.player.y - 12 && bullet.y <= this.player.y + 12) {
                        console.log("collision");
                        console.log(bullet.id);
                        console.log(this.gameCode);

                        var res = this.playerHealth.decrease(10);

                        // console.log("healhtvalue : "+ this.otherplayerNumber + " "+ this.playerData[this.otherPlayer].otherplayerHealth.value);

                        set(ref(getDatabase(initializeApp(FBconfig)), `${this.gameCode}/bullets/${bullet.id}`), {
                            x: bullet.x,
                            y: bullet.y,
                            id: bullet.id,
                            status: false,
                            owner:bullet.owner
                        });
                        update(this.uref, {health: this.playerHealth.value});

                        if (res == true){
                            this.add.text(400,200,"you lose",{fontFamily: 'minecraft '}).setOrigin(0.5);
                            this.scene.pause();
                        }
                    }
                }
            }
        });
     
        // Bullet Class
        var Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'orb');
                this.speed = Phaser.Math.GetSpeed(500, 1);
            },
    
            fire: function (gameCode, id, x, y, rise, run, owner)
            {
                this.setPosition(x, y);

                this.rise = rise/(Math.sqrt(rise*rise+run*run));
                this.run = run/Math.sqrt(rise*rise+run*run);
                this.id = id;
                this.gameCode = gameCode;
                this.owner = owner;

                this.setActive(true);
                this.setVisible(true);
            },
    
            update: function (time, delta)
            {
                this.x += this.speed * delta * this.run;
                this.y += this.speed * delta * this.rise;
    
                if (this.x > 800 || this.x < 0 || this.y > 600 || this.y < 0)
                {
                    this.setActive(false);
                    this.setVisible(false);
                    update(ref(getDatabase(initializeApp(FBconfig)), `${this.gameCode}/bullets/${this.id}`), { status: false });
                    //if(this.id) ref(getDatabase(initializeApp(FBconfig)), `${this.gameCode}/bullets`).child(this.id).remove()
                }
                var status = true;
                get(child(ref(getDatabase(initializeApp(FBconfig))), this.gameCode+`/bullets/${this.id}`)).then((data) => {
                    for(var key in data.val()) {
                        if(key=='status') status = data.val()[key];
                    }
                });
                // console.log(status);
                if(this.gameCode && status) {
                    set(ref(getDatabase(initializeApp(FBconfig)), `${this.gameCode}/bullets/${this.id}`), {
                        x: this.x,
                        y: this.y,
                        id: this.id,
                        status: true,
                        owner:this.owner
                    });
                }

            },
        });
    
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 30,
            runChildUpdate: true
        });

        
        function f (a, b) {
            a.setActive(false);
            a.setVisible(false);
            update(ref(getDatabase(initializeApp(FBconfig)), `${this.gameCode}/bullets/${a.id}`), { status: false });
            //if(a.id) this.firebaseApp.database().ref(`${this.gameCode}/bullets/${a.id}`).remove();
            //console.log(a.id);
            //if(a.id) (ref(this.db,`${this.gameCode}/bullets/${a.id}`)).remove();
            // console.log(this.players[this.otherPlayer]+" "+this.otherPlayer+" "+this.players[this.otherPlayer].id);
        }
/*
        function g(a, b) {
            a.setActive(false);
            a.setVisible(false);
            update(ref(getDatabase(initializeApp(FBconfig)), `${this.gameCode}/bullets/${a.id}`), { status: false });
            var otherHealth = this.playerData[this.otherPlayer].health - 5;
            update(ref(getDatabase(initializeApp(FBconfig)), `${this.gameCode}/players/${this.otherPlayer}`), { health: otherHealth });
        }*/

        function g (a, b) {
            a.setActive(false);
            a.setVisible(false);
        }

        this.physics.add.overlap(this.bullets, this.platforms, f, null, this);
        //this.physics.add.overlap(this.bullets, this.players[this.otherPlayer], g, null, this);

        this.physics.add.collider(this.bullets, this.platforms);
        //this.physics.add.collider(this.bullets, this.players[this.otherPlayer]);

        this.physics.add.overlap(this.bullets, this.playerData[this.otherPlayer], g, null, this);
        this.physics.add.collider(this.bullets, this.playerData[this.otherPlayer]);
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
                this.player.anims.play(this.playerChar+'-right', true);
            }
            else{
                this.player.anims.play(this.playerChar+'-left', true);
            }
        }
        else if (cursors.right.isDown)
        {
            this.player.setVelocityX(200);

            if (pointer.worldX > this.player.x){
                this.player.anims.play(this.playerChar+'-right', true);
            }
            else{
                this.player.anims.play(this.playerChar+'-left', true);
            }
        }
        else
        {
            this.player.setVelocityX(0);

            if (pointer.worldX > this.player.x){
                this.player.anims.play(this.playerChar+'-rightpause');
            }
            else{
                this.player.anims.play(this.playerChar+'-leftpause');
            }
        }

        if (cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-500);
        }

        if (pointer.primaryDown)
        {
            var bullet = this.bullets.get();
            if (bullet)
            {
                if(this.prevShoot == -100 || (Date.now() - this.prevShoot)/1000 >= 1) {
                    bullet.fire(this.gameCode,Math.random().toString().split('.')[1], this.player.x, this.player.y, (pointer.worldY - this.player.y)/Math.abs(pointer.worldX - this.player.x), (pointer.worldX - this.player.x)/Math.abs(pointer.worldX - this.player.x), this.playerNumber);
                    this.prevShoot = Date.now();
                }
            }
            
        } else {
            this.prevShoot = -100;
        }

        // update ur position in firebase
        if (Math.round(this.player.x) != this.previousX || Math.round(this.player.y) != this.previousY || this.player.anims.currentAnim.key != this.prevAnim) {
            this.uref = ref(this.db, `${this.gameCode}/players/${this.playerNumber}`);
            update(this.uref, {
                id: this.playerNumber,
                playerCount: this.playerCount,
                character: this.playerChar,
                x: Math.round(this.player.x),
                y: Math.floor(this.player.y),
                animation: this.player.anims.currentAnim.key,
            })
        }
        this.previousX = Math.round(this.player.x);
        this.previousY = Math.round(this.player.y);
        this.prevAnim = this.player.anims.currentAnim.key;


    }
}


export default Game;