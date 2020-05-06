// Your web app's Firebase configuration
const { ipcRenderer } = require("electron");

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
firebase.analytics();

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

signUp = () => {
  var email = document.getElementById("inputEmail").value;
  var password = document.getElementById("inputPassword").value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function () {
      var user = firebase.auth().currentUser;
      user
        .sendEmailVerification()
        .then(function () {
          ipcRenderer.send("message-dialog", "info", "Verification Email Sent");
          window.location.href = "sign-in.html";
        })
        .catch(function (error) {
          ipcRenderer.send("message-dialog", "error", "Invalid Email Address");
        });
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      ipcRenderer.send("message-dialog", "error", errorMessage);
    });
};

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(user.uid);
  } else {
    // No user is signed in.
  }
});
