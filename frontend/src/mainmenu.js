class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenu" });
    this.username = [];
  }

  preload() {
    this.load.image("mainmenu", "assets/mainmenu.png");
    this.load.image("tutorial-hover", "assets/tutorial-hover.png");
    this.load.image("create-hover", "assets/create-hover.png");
    this.load.image("profile", "assets/profile.png");
  }

  create() {
    this.add.image(400, 300, "mainmenu");
    this.add.image(400, 580, "profile").setOrigin(0.5, 1);
    this.username = [
      this.add
        .text(403, 560, "GUEST", { fontFamily: "halfBold", color: "#000000" })
        .setOrigin(0.5, 0.5),
      this.add
        .text(405, 558, "GUEST", { fontFamily: "halfBold", color: "#e1d9ff" })
        .setOrigin(0.5, 0.5),
    ];

    this.input.on(
      "pointerdown",
      function (pointer) {
        if (
          this.game.input.mousePointer.y >= 380 &&
          this.game.input.mousePointer.y <= 482
        ) {
          if (
            this.game.input.mousePointer.x >= 116 &&
            this.game.input.mousePointer.x <= 262
          ) {
            //tutorial
            console.log("tutorial");
            alert("Feature still a work in progress, please check back later!");
          } else if (
            this.game.input.mousePointer.x >= 328 &&
            this.game.input.mousePointer.x <= 474
          ) {
            //create a new game
            console.log("create a new game");
            var i = 0;
            var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var gameCode = "";
            while (i < 4) {
              gameCode += alpha.charAt(
                Math.floor(Math.random() * alpha.length)
              );
              i++;
            }
            this.scene.start("Lobby", { gameCode: gameCode, playerCount: 1 });
          } else if (
            this.game.input.mousePointer.x >= 536 &&
            this.game.input.mousePointer.x <= 682
          ) {
            //join a game
            this.scene.start("Join");
            console.log("join a game");
          }
        } else if (
          this.game.input.mousePointer.y >= 540 &&
          this.game.input.mousePointer.y <= 580 &&
          this.game.input.mousePointer.x >= 310 &&
          this.game.input.mousePointer.x <= 490
        ) {
          // profile button
          this.scene.start("Profile");
        }
      },
      this
    );
  }
  update() {
    for (var i = 0; i < this.username.length; i++) {
      this.username[i].destroy();
    }
    const user = this.scene.get("Profile").user;
    if (user != null) {
      this.username = [
        this.add
          .text(403, 560, user.username, {
            fontFamily: "halfBold",
            color: "#000000",
          })
          .setOrigin(0.5, 0.5),
        this.add
          .text(405, 558, user.username, {
            fontFamily: "halfBold",
            color: "#e1d9ff",
          })
          .setOrigin(0.5, 0.5),
      ];
    } else {
      this.username = [
        this.add
          .text(403, 560, "GUEST", { fontFamily: "halfBold", color: "#000000" })
          .setOrigin(0.5, 0.5),
        this.add
          .text(405, 558, "GUEST", { fontFamily: "halfBold", color: "#e1d9ff" })
          .setOrigin(0.5, 0.5),
      ];
    }
  }
}

export default MainMenu;
