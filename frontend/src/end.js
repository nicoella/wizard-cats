class End extends Phaser.Scene {
  constructor() {
    super({ key: "End" });
    this.username = [];
    this.rendered = false;
    this.state = "";
  }

  preload() {}

  create() {
    this.add.image(400, 300, "bg");
    this.add.image(400, 580, "profile").setOrigin(0.5, 1);
    this.username = [
      this.add
        .text(403, 560, "GUEST", { fontFamily: "halfBold", color: "#000000" })
        .setOrigin(0.5, 0.5),
      this.add
        .text(405, 558, "GUEST", { fontFamily: "halfBold", color: "#e1d9ff" })
        .setOrigin(0.5, 0.5),
    ];
  }

  gameEnd() {
    this.rendered = true;
    var winAdd = 0;
    if (this.state === "win") {
      winAdd = 1;
      this.add.image(400, 100, "you-win").setOrigin(0.5).setScale(1.5);
    } else {
      this.add.image(400, 100, "you-lose").setOrigin(0.5).setScale(1.5);
      this.add.image(400, 200, "main-menu-button").setOrigin(0.5);
    }

    this.add.image(400, 200, "main-menu-button").setOrigin(0.5);
    this.input.on(
      "pointerdown",
      function (pointer) {
        if (
          this.game.input.mousePointer.x >= 326 &&
          this.game.input.mousePointer.x <= 474 &&
          this.game.input.mousePointer.y >= 171 &&
          this.game.input.mousePointer.y <= 229
        ) {
          this.scene.start("MainMenu");
        }
      },
      this
    );

    const user = this.scene.get("Profile").user;
    if (user) {
      const url = "/api/users/updateStats?playedAdd=1&winsAdd=" + winAdd;

      const userData = {
        username: user.username,
        password: user.password,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };
      fetch(url, requestOptions)
        .then((response) => {})
        .then((data) => {})
        .catch((error) => {});
      user.wins = user.wins + winAdd;
      user.gamesPlayed = user.gamesPlayed + 1;
    }
  }

  update() {
    if (!this.rendered) {
      this.rendered = true;
      this.gameEnd();
    }
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

export default End;
