# Wizard Cats
An online 1 vs 1 shooter game.

## Usage
Create a new Firebase project (https://firebase.google.com).

Add a Web App to the project. Keep all settings default.

Copy and paste the code within the `const firebaseConfig = {};`.

Finish setting up the Web App by keeping all settings default.

Add a new Authentication method. Enable Anonymous authentication.

Add a new Realtime Database. Choose the United States as your location.

Start in `test mode`. Note you will have to update the security settings eventually to continue using the database.

Clone the repository:
```
$ git clone https://github.com/nicoella/wizard-cats
$ cd wizard-cats
```

Edit the `src/lobby.js` and `src/game.js` files with the code copied earlier.

Run the site:
```
$ npm run br
```
Visit the site at `http://localhost:5051`.

Alternatively, change the port in the `package.json` file.

## Authors
* [Justin Zhu](https://github.com/astrocat879)
* [Nicole Han](https://github.com/nicoella)
