import { Physics } from "phaser";
import Game from './game';
import MainMenu from './mainmenu';
import Lobby from './lobby';

var config = {
    type: Phaser.AUTO,
    autoCenter: true,
    disableContextMenu: true,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: [MainMenu,Lobby,Game]
};

function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}

loadFont("minecraft", "assets/Minecraft.ttf");

(() => new Phaser.Game(config))();