class MainMenu extends Phaser.Scene {
    constructor(){
        super({ key: 'MainMenu' });
        
    }

    preload (){
        this.load.image('mainmenu', 'assets/mainmenu.png');
        this.load.image('tutorial-hover','assets/tutorial-hover.png');
        this.load.image('create-hover','assets/create-hover.png');
    }

    create (){
        this.add.image(400, 300, 'mainmenu');

        this.input.on('pointerdown', function(pointer) {
            if(this.game.input.mousePointer.y >= 380 && this.game.input.mousePointer.y <= 482) {
                if(this.game.input.mousePointer.x >= 116 && this.game.input.mousePointer.x <= 262) { //tutorial
                    console.log("tutorial");
                } else if(this.game.input.mousePointer.x >= 328 && this.game.input.mousePointer.x <= 474) { //create a new game
                    console.log("create a new game");
                    this.scene.start('Lobby');
                } else if(this.game.input.mousePointer.x >= 536 && this.game.input.mousePointer.x <= 682) { //unknown button
                    console.log("temp button");
                    this.scene.start("Game");
                }
            }
        }, this);
    }
    update (){
    }
}

export default MainMenu;