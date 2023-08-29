class Profile extends Phaser.Scene {
  constructor() {
    super({ key: "Profile" });
    this.state = "not-logged-in"; // states: not-logged-in, sign-up, login
    this.title;
    this.buttons;
    this.inputs;
  }

  preload() {
    this.load.image("bg", "assets/simple_background.png");
    this.load.image("title", "assets/title.png");
    this.load.image("return", "assets/return.png");
    this.load.image("not-logged-in", "assets/not-logged-in.png");
    this.load.image("sign-up", "assets/sign-up.png");
    this.load.image("login", "assets/login.png");
    this.load.image("sign-up-title", "assets/sign-up-title.png");
    this.load.image("login-title", "assets/login-title.png");
    this.load.image("username", "assets/username.png");
    this.load.image("password", "assets/password.png");
  }

  create() {
    this.add.image(400, 300, "bg");
    this.add.image(400, 580, "profile").setOrigin(0.5, 1);
    this.add
      .text(403, 560, "GUEST", { fontFamily: "halfBold", color: "#000000" })
      .setOrigin(0.5, 0.5);
    this.add
      .text(405, 558, "GUEST", { fontFamily: "halfBold", color: "#e1d9ff" })
      .setOrigin(0.5, 0.5);
    this.add.image(400, 290, "title");
    this.add.image(30, 30, "return").setOrigin(0, 0);
    this.title = this.add.image(400, 240, "not-logged-in");
    this.buttons = [
      this.add.image(355, 300, "sign-up"),
      this.add.image(460, 300, "login"),
    ];
    this.inputs = [];
    this.input.on(
      "pointerdown",
      function (pointer) {
        if (this.state != "login" && this.state != "sign-up") {
          document.getElementById("username").style.display = "none";
          document.getElementById("password").style.display = "none";
        }
        if (
          this.state === "not-logged-in" &&
          this.game.input.mousePointer.y >= 280 &&
          this.game.input.mousePointer.y <= 320
        ) {
          if (
            this.game.input.mousePointer.x >= 420 &&
            this.game.input.mousePointer.x <= 500
          ) {
            // login
            this.state = "login";
            document.getElementById("username").style.display = "block";
            document.getElementById("password").style.display = "block";
          } else if (
            this.game.input.mousePointer.x >= 307 &&
            this.game.input.mousePointer.x <= 402
          ) {
            // sign up
            this.state = "sign-up";
            document.getElementById("username").style.display = "block";
            document.getElementById("password").style.display = "block";
          }
        } else if (
          this.game.input.mousePointer.y >= 30 &&
          this.game.input.mousePointer.y <= 58 &&
          this.game.input.mousePointer.x >= 30 &&
          this.game.input.mousePointer.x <= 120
        ) {
          // return to main menu
          this.scene.start("MainMenu");
          this.state = "not-logged-in";
          document.getElementById("username").style.display = "none";
          document.getElementById("password").style.display = "none";
        } else if (
          this.game.input.mousePointer.x >= 360 &&
          this.game.input.mousePointer.x <= 440 &&
          this.game.input.mousePointer.y >= 430 &&
          this.game.input.mousePointer.y <= 470
        ) {
          if (this.state === "sign-up") {
            alert("sign up");
          } else if (this.state === "login") {
            alert("Login");
          }
        }
      },
      this
    );
  }

  update() {
    this.clearContent();
    if (this.state == "not-logged-in") {
      this.title = this.add.image(400, 240, "not-logged-in");
      this.buttons = [
        this.add.image(355, 300, "sign-up"),
        this.add.image(460, 300, "login"),
      ];
    } else if (this.state == "sign-up") {
      this.title = this.add.image(400, 240, "sign-up-title");
      this.buttons = [this.add.image(400, 450, "sign-up")];
      this.inputs = [
        this.add.image(300, 310, "username"),
        this.add.image(300, 358, "password"),
      ];
    } else if (this.state == "login") {
      this.title = this.add.image(400, 240, "login-title");
      this.buttons = [this.add.image(400, 450, "login")];
      this.inputs = [
        this.add.image(300, 310, "username"),
        this.add.image(300, 358, "password"),
      ];
    }
  }

  clearContent() {
    this.title.destroy();
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].destroy();
    }
    this.buttons = [];
    for (var i = 0; i < this.inputs.length; i++) {
      this.inputs[i].destroy();
    }
    this.inputs = [];
  }
}
export default Profile;
