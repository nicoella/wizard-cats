class Profile extends Phaser.Scene {
  constructor() {
    super({ key: "Profile" });
    this.state = "not-logged-in"; // states: not-logged-in, sign-up, login, profile
    this.title;
    this.buttons;
    this.inputs;
    this.user = null;
    this.username = [];
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
    this.load.image("profile-title", "assets/profile-title.png");
    this.load.image("stats", "assets/stats.png");
    this.load.image("logout", "assets/logout.png");
  }

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
    this.add.image(400, 290, "title");
    this.add.image(30, 30, "return").setOrigin(0, 0);
    this.title = this.add.image(400, 240, "not-logged-in");
    this.buttons = [
      this.add.image(355, 300, "sign-up"),
      this.add.image(460, 300, "login"),
    ];
    this.inputs = [];
    this.texts = [];
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
          if (this.user == null) {
            this.state = "not-logged-in";
          }
          document.getElementById("username").style.display = "none";
          document.getElementById("password").style.display = "none";
        } else if (
          this.game.input.mousePointer.x >= 360 &&
          this.game.input.mousePointer.x <= 440 &&
          this.game.input.mousePointer.y >= 430 &&
          this.game.input.mousePointer.y <= 470
        ) {
          if (this.state === "sign-up") {
            this.signUp();
          } else if (this.state === "login") {
            this.logIn();
          } else if (this.state === "profile") {
            this.state = "not-logged-in";
            this.user = null;
          }
        }
      },
      this
    );
  }

  update() {
    this.clearContent();
    if (this.state == "not-logged-in") {
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      this.resetUsername();
      this.title = this.add.image(400, 240, "not-logged-in");
      this.buttons = [
        this.add.image(355, 300, "sign-up"),
        this.add.image(460, 300, "login"),
      ];
    } else if (this.state == "sign-up") {
      this.resetUsername();
      this.title = this.add.image(400, 240, "sign-up-title");
      this.buttons = [this.add.image(400, 450, "sign-up")];
      this.inputs = [
        this.add.image(300, 310, "username"),
        this.add.image(300, 358, "password"),
      ];
    } else if (this.state == "login") {
      this.resetUsername();
      this.title = this.add.image(400, 240, "login-title");
      this.buttons = [this.add.image(400, 450, "login")];
      this.inputs = [
        this.add.image(300, 310, "username"),
        this.add.image(300, 358, "password"),
      ];
    } else if (this.state == "profile") {
      this.username = [
        this.add
          .text(403, 560, this.user.username, {
            fontFamily: "halfBold",
            color: "#000000",
          })
          .setOrigin(0.5, 0.5),
        this.add
          .text(405, 558, this.user.username, {
            fontFamily: "halfBold",
            color: "#e1d9ff",
          })
          .setOrigin(0.5, 0.5),
      ];
      this.title = this.add.image(400, 240, "profile-title");
      this.inputs = [
        this.add.image(295, 310, "username").setOrigin(0, 0.5),
        this.add.image(295, 350, "stats").setOrigin(0, 0.5),
      ];
      this.buttons = [this.add.image(400, 450, "logout")];
      this.texts = [
        this.add
          .text(430, 310, this.user.username, {
            fontFamily: "halfBold",
            color: "#e1d9ff",
          })
          .setOrigin(0, 0.5),
        this.add
          .text(385, 340, this.user.gamesPlayed + " games played", {
            fontFamily: "halfBold",
            color: "#e1d9ff",
          })
          .setOrigin(0, 0),
        this.add
          .text(385, 365, this.user.wins + " wins", {
            fontFamily: "halfBold",
            color: "#e1d9ff",
          })
          .setOrigin(0, 0),
      ];
    }
  }

  signUp() {
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");

    var username = usernameInput.value;
    var password = passwordInput.value;

    const validUsername = this.checkUsernameReqs(username);
    const validPassword = this.checkPasswordReqs(password);

    if (!validUsername) {
      // invalid username
      alert(
        "Error! Username must have a length between 3 and 20 characters and only contain alphanumeric characters."
      );
    } else if (!validPassword) {
      // invalid password
      alert("Error! Password must have a length between 6 and 30 characters.");
    } else {
      // register user
      const url = "/api/users/register";

      const userData = {
        username: username,
        password: password,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };

      fetch(url, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 409) {
            throw new Error("Username already exists.");
          } else {
            throw new Error("An unknown error occurred.");
          }
        })
        .then((data) => {
          console.log("Response:", data);
          this.user = data;
          this.state = "profile";
        })
        .catch((error) => {
          console.error("Error:", error.message);
          alert(error.message);
        });
    }
  }

  logIn() {
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");

    var username = usernameInput.value;
    var password = passwordInput.value;

    const url = "/api/users/signIn";

    const userData = {
      username: username,
      password: password,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401 || response.status === 404) {
          throw new Error("Username or password is incorrect.");
        } else {
          throw new Error("An unknown error occurred.");
        }
      })
      .then((data) => {
        console.log("Response:", data);
        this.user = data;
        this.state = "profile";
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
  }

  checkUsernameReqs(username) {
    if (typeof username !== "string" || username.trim().length === 0) {
      return false;
    }
    const minLength = 3;
    const maxLength = 20;
    if (username.length < minLength || username.length > maxLength) {
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return false;
    }
    return true;
  }

  checkPasswordReqs(password) {
    if (typeof password !== "string" || password.trim().length === 0) {
      return false;
    }
    const minLength = 6;
    const maxLength = 30;
    if (password.length < minLength || password.length > maxLength) {
      return false;
    }
    return true;
  }

  resetUsername() {
    this.username = [
      this.add
        .text(403, 560, "GUEST", { fontFamily: "halfBold", color: "#000000" })
        .setOrigin(0.5, 0.5),
      this.add
        .text(405, 558, "GUEST", { fontFamily: "halfBold", color: "#e1d9ff" })
        .setOrigin(0.5, 0.5),
    ];
  }

  clearContent() {
    if (this.state != "sign-up" && this.state != "login") {
      document.getElementById("username").style.display = "none";
      document.getElementById("password").style.display = "none";
    }
    this.title.destroy();
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].destroy();
    }
    this.buttons = [];
    for (var i = 0; i < this.inputs.length; i++) {
      this.inputs[i].destroy();
    }
    this.inputs = [];
    for (var i = 0; i < this.texts.length; i++) {
      this.texts[i].destroy();
    }
    this.texts = [];
    for (var i = 0; i < this.username.length; i++) {
      this.username[i].destroy();
    }
  }
}
export default Profile;
