// import { initializeApp } from 'firebase/app';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// const firebaseConfig = {
//     apiKey: "AIzaSyCICPepb-VHI8gyp7lnExZ7LDXHHBzrC20",
//     authDomain: "wiz-cats.firebaseapp.com",
//     databaseURL: "https://wiz-cats-default-rtdb.firebaseio.com",
//     projectId: "wiz-cats",
//     storageBucket: "wiz-cats.appspot.com",
//     messagingSenderId: "160626562720",
//     appId: "1:160626562720:web:55a12ada7c9952e98e5bc5"
// };
  
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// onAuthStateChanged(auth, (user) => {
// if (user != null) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     console.log('logged in');
//     // ...
// } else {
//     console.log('no user');
// }
// });
import { Physics } from "phaser";
import Game from './game';

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
    scene: [Game]
};

(() => new Phaser.Game(config))();