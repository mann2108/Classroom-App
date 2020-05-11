// Your web app's Firebase configuration
const { ipcRenderer } = require("electron");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
//const xlsxFile = require("read-excel-file/node");
//var excel = require("excel4node");
//var admin = require("firebase-admin");

//var serviceAccount = require("./desktopchatapp-7d77c-firebase-adminsdk-1brzy-0eecc09bae.json");

var loginUser;

/*admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://desktopchatapp-7d77c.firebaseio.com",
});*/

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

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
  } else {
    // No user is signed in.
  }
});


defaultLoadings = ()  => {
	if(!loginUser){
		window.location.href = "sign-in.html";
		ipcRenderer.send("message-dialog", "error", "Connection Time Out");
	}
	document.getElementById("name").innerHTML = loginUser.displayName;
	document.getElementById("email").innerHTML = loginUser.email;
	document.getElementById("type").innerHTML = "STUDENT";
	if(loginUser.email[loginUser.email.length-4]=='c'){
		document.getElementById("type").innerHTML = "FACULTY";	
	}
	document.getElementById("lastLogin").innerHTML = loginUser.metadata.lastSignInTime;
}

initialize = () => {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			loginUser = user;
		}
	});
	setTimeout(function(){
		var user = firebase.auth().currentUser;
		loginUser = user;
		defaultLoadings();
	}, 2000);
}
