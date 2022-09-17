class Join extends Phaser.Scene {
    constructor(){
        super({ key: 'Join' });
        this.gameCode;
    }

    preload (){
        this.load.image('bg', 'assets/simple_background.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('enter','assets/enter.png');
        this.load.image('join','assets/join.png');
        this.load.html('text', 'assets/text.html');
    }

    create (){
        this.add.image(400, 300, 'bg');
        this.add.image(400,290,'title');
        this.add.image(350,320,'enter');
        this.add.image(400,400,'join');
        document.getElementById("input").style.display = "block";

        this.input.on('pointerdown', function(pointer) {
            if(this.game.input.mousePointer.x >= 326 && this.game.input.mousePointer.x <= 474 && this.input.mousePointer.y >= 371 && this.input.mousePointer.y <= 429) {
                console.log("join -> lobby");
                this.gameCode = document.getElementById("input").value;
                console.log(this.gameCode);
                document.getElementById("input").style.display = "none";
                this.scene.start("Lobby", { gameCode: this.gameCode});
            }
        }, this);
    }

    

    update (){
    }
}


export default Join;