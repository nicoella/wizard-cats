import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  getDatabase,
  set,
  ref,
  onValue,
  onChildAdded,
  onDisconnect,
  remove,
  update,
  push,
  onChildChanged,
  get,
  child,
  db,
} from "firebase/database";

const FBconfig = {
  apiKey: "AIzaSyD7kDoMivEAcS7wpknNcpIvKPxvMvIJ8V0",
  authDomain: "wizard-cats-cf2a4.firebaseapp.com",
  projectId: "wizard-cats-cf2a4",
  storageBucket: "wizard-cats-cf2a4.appspot.com",
  messagingSenderId: "759561339478",
  appId: "1:759561339478:web:262dad035f4e61782e71f7",
  measurementId: "G-1F9NRXZKF6",
};

class Lobby extends Phaser.Scene {
  constructor() {
    super({ key: "Lobby" });
    this.firebaseApp = initializeApp(FBconfig);
    this.auth = getAuth(this.firebaseApp);
    this.db = getDatabase(this.firebaseApp);
    this.playerNumber = Math.random().toString().split(".")[1];
    this.selected = [];
    this.playerData = {};
    this.selected["black"] = false;
    this.selected["tabby"] = false;
    this.selected["grey"] = false;
    this.selected["siamese"] = false;
    this.portraits = [];
    this.prevSelect;
    this.playerCount = 0;
    this.db = getDatabase();
    this.waiting;
    this.temp;
    this.gameCode = "";
  }

  init(data) {
    console.log("init", data);
    if (this.gameCode == "" && data.gameCode != undefined) {
      this.gameCode = data.gameCode;
      this.playerCount = data.playerCount;
    }
  }

  preload() {
    this.load.image("bg", "assets/simple_background.png");
    this.load.image("title", "assets/title.png");
    this.load.image("select", "assets/player-select.png");
    this.load.image("selected", "assets/selected.png");
    this.load.image("start", "assets/start-button.png");
    this.load.image("player1_text", "assets/player-1-text.png");
    this.load.image("player2_text", "assets/player-2-text.png");
    this.load.image("you_text", "assets/you.png");
    this.load.image("waiting_text", "assets/waiting.png");
    this.load.image("select_text", "assets/character-select-text.png");
    this.load.image("link_text", "assets/game-link-text.png");
    this.load.image("p-black", "assets/portrait-black.png");
    this.load.image("p-tabby", "assets/portrait-tabby.png");
    this.load.image("p-grey", "assets/portrait-grey.png");
    this.load.image("p-siamese", "assets/portrait-siamese.png");
    this.load.image("none", "assets/portrait-none.png");
    this.load.image("return", "assets/return.png");
  }

  create() {
    onAuthStateChanged(this.auth, (user) => {
      if (user != null) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uref = ref(
          this.db,
          `${this.gameCode}/players/${this.playerNumber}`
        );

        set(uref, {
          id: this.playerNumber,
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
          health: 100,
          animation: 0,
        });

        set(ref(this.db, `${this.gameCode}/properties`), {
          start: false,
        });
      } else {
        // User is signed out
        console.log("nope");
      }
      onDisconnect(ref(this.db, `${this.gameCode}`)).remove();
    });

    signInAnonymously(this.auth)
      .then(() => {})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

    this.add.image(400, 300, "bg");
    this.add.image(400, 290, "title");
    this.add.image(400, 235, "select_text").setOrigin(0.5);
    this.add.image(400, 300, "select");

    this.add.image(30, 200, "player1_text").setOrigin(0, 0);
    this.temp = this.add.image(115, 200, "you_text").setOrigin(0, 0);
    this.add.image(30, 230, "none").setOrigin(0, 0);

    this.waiting = this.add.image(770, 180, "waiting_text").setOrigin(1, 0);
    this.add.image(770, 230, "none").setOrigin(1, 0);

    this.add.image(300, 415, "link_text").setOrigin(0);
    this.add
      .text(
        460,
        423,
        this.gameCode.charAt(0) +
          this.gameCode.charAt(1) +
          this.gameCode.charAt(2) +
          this.gameCode.charAt(3),
        { fontFamily: "halfBold" }
      )
      .setOrigin(0.5);
    this.add.image(400, 480, "start");

    this.add.image(400, 580, "profile").setOrigin(0.5, 1);
    this.add
      .text(403, 560, "GUEST", { fontFamily: "halfBold", color: "#000000" })
      .setOrigin(0.5, 0.5);
    this.add
      .text(405, 558, "GUEST", { fontFamily: "halfBold", color: "#e1d9ff" })
      .setOrigin(0.5, 0.5);

    this.add.image(30, 30, "return").setOrigin(0, 0);

    // firebase
    var thisPlayerRef = ref(
      this.db,
      this.gameCode + "/players/" + this.playerNumber
    );
    const allPlayersRef = ref(this.db, this.gameCode + "/players");
    onValue(allPlayersRef, (snapshot) => {
      // update location of all the other players
      this.players = snapshot.val() || {};
    });

    onChildAdded(allPlayersRef, (snapshot) => {
      const addedPlayer = snapshot.val();
      get(child(ref(this.db), this.gameCode + `/players`)).then((data) => {
        for (var key in data.val()) {
          for (var item in data.val()[key]) {
            if (item == "character") {
              var char = data.val()[key][item];
              this.selected[char] = true;
              if (char == "black") {
                if (!this.portraits["black"])
                  this.portraits["black"] = this.add.image(
                    291,
                    300,
                    "selected"
                  );
                this.selected["black"] = true;
                if (this.playerCount == 2) {
                  this.add.image(30, 230, "p-black").setOrigin(0, 0);
                }
              } else if (char == "tabby") {
                if (!this.portraits["tabby"])
                  this.portraits["tabby"] = this.add.image(
                    364,
                    300,
                    "selected"
                  );
                this.selected["tabby"] = true;
                if (this.playerCount == 2) {
                  this.add.image(30, 230, "p-tabby").setOrigin(0, 0);
                }
              } else if (char == "grey") {
                if (!this.portraits["grey"])
                  this.portraits["grey"] = this.add.image(437, 300, "selected");
                this.selected["grey"] = true;
                if (this.playerCount == 2) {
                  this.add.image(30, 230, "p-grey").setOrigin(0, 0);
                }
              } else if (char == "siamese") {
                if (!this.portraits["siamese"])
                  this.portraits["siamese"] = this.add.image(
                    510,
                    300,
                    "selected"
                  );
                this.selected["siamese"] = true;
                if (this.playerCount == 2) {
                  this.add.image(30, 230, "p-siamese").setOrigin(0, 0);
                }
              }
            }
          }
        }
      });
      if (this.playerCount == 1 && addedPlayer.id != this.playerNumber) {
        this.waiting.destroy();
        this.add.image(770, 200, "player2_text").setOrigin(1, 0);
      } else if (this.playerCount == 2) {
        this.waiting.destroy();
        this.add.image(705, 200, "player2_text").setOrigin(1, 0);
        this.add.image(765, 200, "you_text").setOrigin(1, 0);
        this.temp.destroy();
      }
    });

    const propertiesRef = ref(this.db, `${this.gameCode}/properties`);
    onChildChanged(propertiesRef, (snapshot) => {
      const update = snapshot.val();
      console.log(update);
      if (update == true) {
        this.scene.start("Game", {
          playerNumber: this.playerNumber,
          playerChar: this.prevSelect,
          gameCode: this.gameCode,
          playerCount: this.playerCount,
          character: this.prevSelect,
        });
      }
    });

    onChildChanged(allPlayersRef, (snapshot) => {
      const player = snapshot.val();
      if (player.id != this.playerNumber) {
        if (player.character) {
          this.selected["black"] = false;
          this.selected["grey"] = false;
          this.selected["tabby"] = false;
          this.selected["siamese"] = false;
          this.selected[player.character] = true;
          this.selected[this.prevSelect] = true;
          if (player.character == "black") {
            this.portraits["black"] = this.add.image(291, 300, "selected");
          } else if (player.character == "tabby") {
            this.portraits["tabby"] = this.add.image(364, 300, "selected");
          } else if (player.character == "grey") {
            this.portraits["grey"] = this.add.image(437, 300, "selected");
          } else if (player.character == "siamese") {
            this.portraits["siamese"] = this.add.image(510, 300, "selected");
          }
        }
        if (player.playerCount == 1) {
          if (player.character == "black") {
            this.add.image(30, 230, "p-black").setOrigin(0, 0);
          } else if (player.character == "tabby") {
            this.add.image(30, 230, "p-tabby").setOrigin(0, 0);
          } else if (player.character == "grey") {
            this.add.image(30, 230, "p-grey").setOrigin(0, 0);
          } else if (player.character == "siamese") {
            this.add.image(30, 230, "p-siamese").setOrigin(0, 0);
          }
        } else {
          if (player.character == "black") {
            this.add.image(770, 230, "p-black").setOrigin(1, 0);
          } else if (player.character == "tabby") {
            this.add.image(770, 230, "p-tabby").setOrigin(1, 0);
          } else if (player.character == "grey") {
            this.add.image(770, 230, "p-grey").setOrigin(1, 0);
          } else if (player.character == "siamese") {
            this.add.image(770, 230, "p-siamese").setOrigin(1, 0);
          }
        }
      }
      if (!this.selected["black"] && this.portraits["black"])
        this.portraits["black"].destroy();
      if (!this.selected["tabby"] && this.portraits["tabby"])
        this.portraits["tabby"].destroy();
      if (!this.selected["grey"] && this.portraits["grey"])
        this.portraits["grey"].destroy();
      if (!this.selected["siamese"] && this.portraits["siamese"])
        this.portraits["siamese"].destroy();
    });

    this.input.on(
      "pointerdown",
      function (pointer) {
        if (
          this.game.input.mousePointer.y >= 266 &&
          this.game.input.mousePointer.y <= 334
        ) {
          if (
            this.game.input.mousePointer.x >= 257 &&
            this.game.input.mousePointer.x <= 326
          ) {
            if (this.prevSelect != "black" && !this.selected["black"]) {
              this.selected["black"] = true;
              this.portraits["black"] = this.add.image(291, 300, "selected");
              if (this.playerCount == 1) {
                this.add.image(30, 230, "p-black").setOrigin(0, 0);
              } else {
                this.add.image(770, 230, "p-black").setOrigin(1, 0);
              }
              set(
                ref(this.db, `${this.gameCode}/players/${this.playerNumber}`),
                {
                  character: "black",
                  id: this.playerNumber,
                  x: Math.floor(Math.random() * 100),
                  y: Math.floor(Math.random() * 100),
                  playerCount: this.playerCount,
                  animation: 0,
                  health: 100,
                }
              );
              if (this.prevSelect && this.prevSelect != "black") {
                this.portraits[this.prevSelect].destroy();

                this.selected[this.prevSelect] = false;
              }
              this.prevSelect = "black";
            }
          } else if (
            this.game.input.mousePointer.x >= 330 &&
            this.game.input.mousePointer.x <= 399
          ) {
            if (this.prevSelect != "tabby" && !this.selected["tabby"]) {
              this.selected["tabby"] = true;
              this.portraits["tabby"] = this.add.image(364, 300, "selected");
              if (this.playerCount == 1) {
                this.add.image(30, 230, "p-tabby").setOrigin(0, 0);
              } else {
                this.add.image(770, 230, "p-tabby").setOrigin(1, 0);
              }
              set(
                ref(this.db, `${this.gameCode}/players/${this.playerNumber}`),
                {
                  character: "tabby",
                  id: this.playerNumber,
                  x: Math.floor(Math.random() * 100),
                  y: Math.floor(Math.random() * 100),
                  playerCount: this.playerCount,
                  animation: 0,
                  health: 100,
                }
              );
              if (this.prevSelect && this.prevSelect != "tabby") {
                this.portraits[this.prevSelect].destroy();
                this.selected[this.prevSelect] = false;
              }
              this.prevSelect = "tabby";
            }
          } else if (
            this.game.input.mousePointer.x >= 403 &&
            this.game.input.mousePointer.x <= 472
          ) {
            if (this.prevSelect != "grey" && !this.selected["grey"]) {
              this.selected["grey"] = true;
              this.portraits["grey"] = this.add.image(437, 300, "selected");
              if (this.playerCount == 1) {
                this.add.image(30, 230, "p-grey").setOrigin(0, 0);
              } else {
                this.add.image(770, 230, "p-grey").setOrigin(1, 0);
              }
              set(
                ref(this.db, `${this.gameCode}/players/${this.playerNumber}`),
                {
                  character: "grey",
                  id: this.playerNumber,
                  x: Math.floor(Math.random() * 100),
                  y: Math.floor(Math.random() * 100),
                  playerCount: this.playerCount,
                  animation: 0,
                  health: 100,
                }
              );
              if (this.prevSelect && this.prevSelect != "grey") {
                this.portraits[this.prevSelect].destroy();
                this.selected[this.prevSelect] = false;
              }
              this.prevSelect = "grey";
            }
          } else if (
            this.game.input.mousePointer.x >= 476 &&
            this.game.input.mousePointer.x <= 545
          ) {
            if (this.prevSelect != "siamese" && !this.selected["siamese"]) {
              this.selected["siamese"] = true;
              this.portraits["siamese"] = this.add.image(510, 300, "selected");
              if (this.playerCount == 1) {
                this.add.image(30, 230, "p-siamese").setOrigin(0, 0);
              } else {
                this.add.image(770, 230, "p-siamese").setOrigin(1, 0);
              }
              set(
                ref(this.db, `${this.gameCode}/players/${this.playerNumber}`),
                {
                  character: "siamese",
                  id: this.playerNumber,
                  x: Math.floor(Math.random() * 100),
                  y: Math.floor(Math.random() * 100),
                  playerCount: this.playerCount,
                  animation: 0,
                  health: 100,
                }
              );
              if (this.prevSelect && this.prevSelect != "siamese") {
                this.portraits[this.prevSelect].destroy();
                this.selected[this.prevSelect] = false;
              }
              this.prevSelect = "siamese";
            }
          }
        } else if (
          this.game.input.mousePointer.y >= 30 &&
          this.game.input.mousePointer.y <= 58 &&
          this.game.input.mousePointer.x >= 30 &&
          this.game.input.mousePointer.x <= 120
        ) {
          // return to main menu
          this.scene.start("MainMenu");
        }
      },
      this
    );

    this.input.on(
      "pointerdown",
      function (pointer) {
        if (
          this.game.input.mousePointer.x >= 326 &&
          this.game.input.mousePointer.x <= 474 &&
          this.input.mousePointer.y >= 451 &&
          this.input.mousePointer.y <= 509
        ) {
          console.log("lobby -> game");
          set(ref(this.db, `${this.gameCode}/properties`), {
            start: true,
          });
        }
      },
      this
    );
  }

  update() {}
}

export default Lobby;
