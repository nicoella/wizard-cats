# Wizard Cats

An online 1 vs 1 shooter game.

## Usage

Clone the repository:

```
$ git clone https://github.com/nicoella/wizard-cats
$ cd wizard-cats
```

### Firebase Setup

Create a new Firebase project (https://firebase.google.com).

Add a Web App to the project. Keep all settings default.

Copy and paste the code within the `const firebaseConfig = {};`.

Finish setting up the Web App by keeping all settings default.

Add a new Authentication method. Enable Anonymous authentication.

Add a new Realtime Database. Choose the United States as your location.

Start in `test mode`. Note you will have to update the security settings eventually to continue using the database.

Edit the `src/lobby.js` and `src/game.js` files with the copied Firebase code.

### Backend

Install MySQL if not already installed (https://dev.mysql.com/downloads/).

Start MySQL server.

Run the setup file (you may be prompted to enter your password set up at installation):

Optional: Change the Admin user username and password in the `setup_mysql.sh` file and `src/main/resources/applications.properties` file.

```
$ cd backend
$ chmod +x setup_mysql.sh
$ ./setup_mysql.sh
```

Run the backend:

```
$ cd backend
$ chmod +x run.sh
$ ./run.sh
```

### Frontend

Run the frontend:

```
$ cd frontend
$ npm run br
```

Visit the site at `http://localhost:5051`.

Alternatively, change the port in the `package.json` file.

## Authors

- [Justin Zhu](https://github.com/astrocat879)
- [Nicole Han](https://github.com/nicoella)
