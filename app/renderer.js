// Your web app's Firebase configuration
const { ipcRenderer } = require("electron");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

var admin = require("firebase-admin");

var serviceAccount = require("./desktopchatapp-7d77c-firebase-adminsdk-1brzy-0eecc09bae.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://desktopchatapp-7d77c.firebaseio.com",
});

var firebaseConfig = {
  apiKey: "AIzaSyA2wD-c_irTkrlUYU5ri7TE1IA4nGBdUmo",
  authDomain: "desktopchatapp-7d77c.firebaseapp.com",
  databaseURL: "https://desktopchatapp-7d77c.firebaseio.com",
  projectId: "desktopchatapp-7d77c",
  storageBucket: "desktopchatapp-7d77c.appspot.com",
  messagingSenderId: "993313812580",
  appId: "1:993313812580:web:4231da3c52a7170f8cef71",
  measurementId: "G-YQBMVSYM6P",
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

signIn = () => {
  var email = document.getElementById("inputEmail").value;
  var password = document.getElementById("inputPassword").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function () {
      var user = firebase.auth().currentUser;
      if (user.emailVerified) {
        ipcRenderer.send("message-dialog", "info", "Sucessfully login.");
        window.location.href = "index.html";
      } else {
        ipcRenderer.send(
          "message-dialog",
          "info",
          "Email verification incomplete."
        );
      }
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      ipcRenderer.send("message-dialog", "error", errorMessage);
    });
};

signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      ipcRenderer.send("message-dialog", "info", "Sign out successfully !");
      window.location.href = "sign-in.html";
    })
    .catch(function (error) {
      ipcRenderer.send("message-dialog", "error", error);
    });
};

writeUserData = (userId, firstName, lastName, email) => {
  firebase
    .database()
    .ref("users/" + userId)
    .set(
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
      function (error) {
        if (error) {
          ipcRenderer.send("message-dialog", "error", error);
        }
      }
    );
};

signUp = () => {
  var email = document.getElementById("inputEmail").value;
  var password = document.getElementById("inputPassword").value;
  var firstName = document.getElementById("inputFirstName").value;
  var lastName = document.getElementById("inputLastName").value;
  window.flag = false;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function () {
      var user = firebase.auth().currentUser;
      user
        .sendEmailVerification()
        .then(function () {
          ipcRenderer.send("message-dialog", "info", "Verification Email Sent");
          window.flag = true;
          //window.location.href = "sign-in.html";
        })
        .catch(function (error) {
          ipcRenderer.send("message-dialog", "error", "Invalid Email Address");
        });
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      //ipcRenderer.send("message-dialog", "error", errorMessage);
    });
  console.log(window.flag);

  //writeUserData(user.uid, firstName, lastName, email);
};

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
  } else {
    // No user is signed in.
  }
});

// Up to 1000 users can be imported at once.

hello = () => {
  let userImportRecords = [
    {
      uid: "uid6",
      email: "user6@example.com",
      passwordHash: Buffer.from("passwordHash1"),
    },
    {
      uid: "uid7",
      email: "user7@example.com",
      passwordHash: Buffer.from("passwordHash2"),
    },
    //...
  ];
  admin
    .auth()
    .importUsers([
      {
        uid: "mann",
        displayName: "John Doe",
        email: "mann@gmail.com",
        emailVerified: true,
        // Set this user as admin.
        password: "mann",
        customClaims: { admin: true },
        // User with Google provider.
      },
    ])
    .then(function (results) {
      results.errors.forEach(function (indexedError) {
        console.log("Error importing user " + indexedError.index);
      });
    })
    .catch(function (error) {
      console.log("Error importing users:", error);
    });
};
