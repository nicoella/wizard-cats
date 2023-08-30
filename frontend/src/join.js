class Join extends Phaser.Scene {
  constructor() {
    super({ key: "Join" });
    this.gameCode;
    this.username = [];
  }

  preload() {
    this.load.image("bg", "assets/simple_background.png");
    this.load.image("title", "assets/title.png");
    this.load.image("enter", "assets/enter.png");
    this.load.image("join", "assets/join.png");
    this.load.html("text", "assets/text.html");
    this.load.image("return", "assets/return.png");
    this.load.image("profile", "assets/profile.png");
  }

  create() {
    this.add.image(400, 300, "bg");
    this.add.image(400, 290, "title");
    this.add.image(350, 320, "enter");
    this.add.image(400, 400, "join");
    document.getElementById("input").style.display = "block";

    this.add.image(400, 580, "profile").setOrigin(0.5, 1);
    this.username = [
      this.add
        .text(403, 560, "GUEST", { fontFamily: "halfBold", color: "#000000" })
        .setOrigin(0.5, 0.5),
      this.add
        .text(405, 558, "GUEST", { fontFamily: "halfBold", color: "#e1d9ff" })
        .setOrigin(0.5, 0.5),
    ];
    this.add.image(30, 30, "return").setOrigin(0, 0);

    this.input.on(
      "pointerdown",
      function (pointer) {
        if (
          this.game.input.mousePointer.x >= 326 &&
          this.game.input.mousePointer.x <= 474 &&
          this.input.mousePointer.y >= 371 &&
          this.input.mousePointer.y <= 429
        ) {
          console.log("join -> lobby");
          this.gameCode = document.getElementById("input").value;
          console.log(this.gameCode);
          document.getElementById("input").style.display = "none";
          this.scene.start("Lobby", {
            gameCode: this.gameCode,
            playerCount: 2,
          });
        } else if (
          this.game.input.mousePointer.y >= 30 &&
          this.game.input.mousePointer.y <= 58 &&
          this.game.input.mousePointer.x >= 30 &&
          this.game.input.mousePointer.x <= 120
        ) {
          // return to main menu
          this.scene.start("MainMenu");
          document.getElementById("input").style.display = "none";
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

export default Join;
