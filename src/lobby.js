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

class Lobby extends Phaser.Scene {
    constructor(){
        super({ key: 'Lobby' });
        this.firebaseApp = initializeApp(FBconfig);
        this.auth = getAuth(this.firebaseApp);
        this.db = getDatabase(this.firebaseApp);
        this.playerNumber = Math.random().toString().split('.')[1]
        this.selected = [];
        this.playerData = {};
        this.selected["black"] = false;
        this.selected["tabby"] = false;
        this.selected["gray"] = false;
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
        console.log('init', data);
        if(this.gameCode == "" && data.gameCode!=undefined) {
            this.gameCode = data.gameCode;
            this.playerCount = data.playerCount;
        }
    }

    preload (){
        this.load.image('bg', 'assets/simple_background.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('select','assets/player-select.png');
        this.load.image('selected','assets/selected.png');
        this.load.image('start','assets/start-button.png');
        this.load.image('player1_text','assets/player-1-text.png');
        this.load.image('player2_text','assets/player-2-text.png');
        this.load.image('you_text','assets/you.png');
        this.load.image('waiting_text','assets/waiting.png');
        this.load.image('select_text','assets/character-select-text.png');
        this.load.image('link_text','assets/game-link-text.png');
        this.load.image('p-black','assets/portrait-black.png');
        this.load.image('p-tabby','assets/portrait-tabby.png');
        this.load.image('p-gray','assets/portrait-gray.png');
        this.load.image('p-siamese','assets/portrait-siamese.png');
        this.load.image('none','assets/portrait-none.png');
    }



    create (){
        onAuthStateChanged(this.auth, (user) => {
            if (user != null) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uref = ref(this.db, `${this.gameCode}/players/${this.playerNumber}`);

                set(uref, {
                    id: this.playerNumber,
                    x: Math.floor(Math.random() * 100),
                    y: Math.floor(Math.random() * 100),
                    animation: 0,
                })
                
                set(ref(this.db, `${this.gameCode}/properties`), {
                    start: false
                })
                
            } else {
                // User is signed out
                console.log("nope");
            }
            onDisconnect(allPlayersRef).remove();
        });
        
        signInAnonymously(this.auth)
            .then(() => {
            // Signed in..
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
            });


        this.add.image(400, 300, 'bg');
        this.add.image(400,290,'title');
        this.add.image(400,235,'select_text').setOrigin(0.5);
        this.add.image(400,300,'select');
        
        this.add.image(30,200,'player1_text').setOrigin(0,0);
        this.temp = this.add.image(115,200,'you_text').setOrigin(0,0);
        this.add.image(30,230,'none').setOrigin(0,0);

        this.waiting = this.add.image(770,180,'waiting_text').setOrigin(1,0);
        this.add.image(770,230,'none').setOrigin(1,0);

        this.add.image(300,435,'link_text').setOrigin(0);
        this.add.text(460,443,this.gameCode.charAt(0)+" "+this.gameCode.charAt(1)+" "+this.gameCode.charAt(2)+" "+this.gameCode.charAt(3),{fontFamily: 'minecraft '}).setOrigin(0.5);;
        this.add.image(400,500,'start');

        // firebase stuff
        var thisPlayerRef = ref(this.db, this.gameCode+'/players/' + this.playerNumber);
        const allPlayersRef = ref(this.db, this.gameCode+'/players');
        onValue(allPlayersRef, (snapshot) => {  // update location of all the other players
            this.players = snapshot.val() || {};
        })

        onChildAdded(allPlayersRef, (snapshot) => {
            const addedPlayer = snapshot.val();            
            get(child(ref(this.db), this.gameCode+`/players`)).then((data) => {
                  for(var key in data.val()) {
                    for(var item in data.val()[key]) {
                      if(item=='character') {
                        var char = data.val()[key][item];
                        this.selected[char] = true;
                        if(char=="black") {
                            if(!this.portraits["black"]) this.portraits["black"] = this.add.image(291,300,'selected');
                            this.selected["black"] = true;
                            if(this.playerCount==2) {
                                this.add.image(30,230,'p-black').setOrigin(0,0);  
                            }
                        } else if(char=="tabby") {
                            if(!this.portraits["tabby"]) this.portraits["tabby"] = this.add.image(364,300,'selected');
                            this.selected["tabby"] = true;
                            if(this.playerCount==2) {
                                this.add.image(30,230,'p-tabby').setOrigin(0,0);  
                            }
                        } else if(char=="gray") {
                            if(!this.portraits["gray"]) this.portraits["gray"] = this.add.image(437,300,'selected');
                            this.selected["gray"] = true;
                            if(this.playerCount==2) {
                                this.add.image(30,230,'p-gray').setOrigin(0,0);  
                            }
                        } else if(char=="siamese") {
                            if(!this.portraits["siamese"]) this.portraits["siamese"] = this.add.image(510,300,'selected');
                            this.seleted["siamese"] = true;
                            if(this.playerCount==2) {
                                this.add.image(30,230,'p-siamese').setOrigin(0,0);  
                            }
                        }
                      }
                    }
                  }
              });
            if (this.playerCount == 1 && addedPlayer.id != this.playerNumber) {
                this.waiting.destroy();
                this.add.image(770, 200, 'player2_text').setOrigin(1, 0);
            } else if(this.playerCount==2) {
                this.waiting.destroy();
                this.add.image(705, 200, 'player2_text').setOrigin(1, 0);
                this.add.image(765, 200, 'you_text').setOrigin(1, 0);
                this.temp.destroy();
            }
        })

        const propertiesRef = ref(this.db, `${this.gameCode}/properties`);
        onChildChanged(propertiesRef, (snapshot) => {
            const update = snapshot.val();
            console.log(update);
            if(update == true) {
                this.scene.start("Game", { playerNumber: this.playerNumber, playerChar: this.prevSelect, gameCode: this.gameCode, playerCount: this.playerCount});
            }
        });

        onChildChanged(allPlayersRef, (snapshot) => {
            const player = snapshot.val();
            if(player.id != this.playerNumber) {
                if(player.character) {
                    this.selected["black"] = false;
                    this.selected["gray"] = false;
                    this.selected["tabby"] = false;
                    this.selected["siamese"] = false;
                    this.selected[player.character] = true;
                    this.selected[this.prevSelect] = true;
                    if(player.character=="black") {
                        this.portraits["black"] = this.add.image(291,300,'selected');
                    } else if(player.character=="tabby") {
                        this.portraits["tabby"] = this.add.image(364,300,'selected');
                    } else if(player.character=="gray") {
                        this.portraits["gray"] = this.add.image(437,300,'selected');
                    } else if(player.character=="siamese") {
                        this.portraits["siamese"] = this.add.image(510,300,'selected');
                    }
                }
                if(player.playerCount == 1) {
                    if(player.character=="black") {
                        this.add.image(30,230,'p-black').setOrigin(0,0);  
                    } else if(player.character=="tabby") {
                        this.add.image(30,230,'p-tabby').setOrigin(0,0);  
                    } else if(player.character=="gray") {
                        this.add.image(30,230,'p-gray').setOrigin(0,0);  
                    } else if(player.character=="siamese") {
                        this.add.image(30,230,'p-siamese').setOrigin(0,0);  
                    }
                } else {
                    if(player.character=="black") {
                        this.add.image(770,230,'p-black').setOrigin(1,0);  
                    } else if(player.character=="tabby") {
                        this.add.image(770,230,'p-tabby').setOrigin(1,0);  
                    } else if(player.character=="gray") {
                        this.add.image(770,230,'p-gray').setOrigin(1,0);  
                    } else if(player.character=="siamese") {
                        this.add.image(770,230,'p-siamese').setOrigin(1,0);  
                    }
                }
            }
            if(!this.selected["black"] && this.portraits["black"]) this.portraits["black"].destroy();
            if(!this.selected["tabby"] && this.portraits["tabby"]) this.portraits["tabby"].destroy();
            if(!this.selected["gray"] && this.portraits["gray"]) this.portraits["gray"].destroy();
            if(!this.selected["siamese"] && this.portraits["siamese"]) this.portraits["siamese"].destroy();
            
        })

        this.input.on('pointerdown', function(pointer) { //kinda buggy
            if(this.game.input.mousePointer.y >= 266 && this.game.input.mousePointer.y <= 334) {
                if(this.game.input.mousePointer.x >= 257 && this.game.input.mousePointer.x <= 326) {
                    if(this.prevSelect != "black" && !this.selected["black"]) {
                        this.selected["black"] = true;
                        this.portraits["black"] = this.add.image(291,300,'selected');
                        if(this.playerCount==1) {
                            this.add.image(30,230,'p-black').setOrigin(0,0);  
                        } else {
                            this.add.image(770,230,'p-black').setOrigin(1,0);  
                        }                  
                        set(ref(this.db, `${this.gameCode}/players/${this.playerNumber}`), {
                            character: "black",
                            id: this.playerNumber,
                            x: Math.floor(Math.random() * 100),
                            y: Math.floor(Math.random() * 100),
                            playerCount: this.playerCount,
                            animation: 0
                        })
                        if(this.prevSelect && this.prevSelect != "black") {
                            this.portraits[this.prevSelect].destroy();
                            
                            this.selected[this.prevSelect] = false;
                        }
                        this.prevSelect = "black";
                    }
                    
                    
                } else if(this.game.input.mousePointer.x >= 330 && this.game.input.mousePointer.x <= 399) {
                    if(this.prevSelect != "tabby" && !this.selected["tabby"]) {
                        this.selected["tabby"] = true;
                        this.portraits["tabby"] = this.add.image(364,300,'selected');
                        if(this.playerCount==1) {
                            this.add.image(30,230,'p-tabby').setOrigin(0,0);  
                        } else {
                            this.add.image(770,230,'p-tabby').setOrigin(1,0);  
                        } 
                        set(ref(this.db, `${this.gameCode}/players/${this.playerNumber}`), {
                            character: "tabby",
                            id: this.playerNumber,
                            x: Math.floor(Math.random() * 100),
                            y: Math.floor(Math.random() * 100),
                            playerCount: this.playerCount,
                            animation: 0
                        })
                        if(this.prevSelect && this.prevSelect != "tabby") {
                            this.portraits[this.prevSelect].destroy();
                            this.selected[this.prevSelect] = false;
                        }
                        this.prevSelect = "tabby";
                    }
                    
                    
                } else if(this.game.input.mousePointer.x >= 403 && this.game.input.mousePointer.x <= 472) {
                    if(this.prevSelect != "gray" && !this.selected["gray"]) {
                        this.selected["gray"] = true;
                        this.portraits["gray"] = this.add.image(437,300,'selected');
                        if(this.playerCount==1) {
                            this.add.image(30,230,'p-gray').setOrigin(0,0);  
                        } else {
                            this.add.image(770,230,'p-gray').setOrigin(1,0);  
                        } 
                        set(ref(this.db, `${this.gameCode}/players/${this.playerNumber}`), {
                            character: "gray",
                            id: this.playerNumber,
                            x: Math.floor(Math.random() * 100),
                            y: Math.floor(Math.random() * 100),
                            playerCount: this.playerCount,
                            animation: 0
                        })
                        if(this.prevSelect && this.prevSelect != "gray") {
                            this.portraits[this.prevSelect].destroy();
                            this.selected[this.prevSelect] = false;
                        }
                        this.prevSelect = "gray";
                    }
                    
                    
                } else if(this.game.input.mousePointer.x >= 476 && this.game.input.mousePointer.x <= 545) {
                    if(this.prevSelect != "siamese" && !this.selected["siamese"]) {
                        this.selected["siamese"] = true;
                        this.portraits["siamese"] = this.add.image(510,300,'selected');
                        if(this.playerCount==1) {
                            this.add.image(30,230,'p-siamese').setOrigin(0,0);  
                        } else {
                            this.add.image(770,230,'p-siamese').setOrigin(1,0);  
                        } 
                        set(ref(this.db, `${this.gameCode}/players/${this.playerNumber}`), {
                            character: "siamese",
                            id: this.playerNumber,
                            x: Math.floor(Math.random() * 100),
                            y: Math.floor(Math.random() * 100),
                            playerCount: this.playerCount,
                            animation: 0
                        })
                        if(this.prevSelect && this.prevSelect != "siamese") {
                            this.portraits[this.prevSelect].destroy();
                            this.selected[this.prevSelect] = false;
                        }
                        this.prevSelect = "siamese";
                    }
                    
                }
            }
        }, this);

        this.input.on('pointerdown', function(pointer) {
            if(this.game.input.mousePointer.x >= 326 && this.game.input.mousePointer.x <= 474 && this.input.mousePointer.y >= 471 && this.input.mousePointer.y <= 529) {
                console.log("lobby -> game");
                set(ref(this.db, `${this.gameCode}/properties`), {
                    start: true
                })
                this.scene.start("Game", { playerNumber: this.playerNumber, playerChar: this.prevSelect, gameCode: this.gameCode, playerCount: this.playerCount});
                
            }
        }, this);
    }

    update (){
    }
}

export default Lobby;