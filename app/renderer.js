// Your web app's Firebase configuration
const { ipcRenderer } = require('electron');

var firebaseConfig = {
	apiKey: "AIzaSyA2wD-c_irTkrlUYU5ri7TE1IA4nGBdUmo",
	authDomain: "desktopchatapp-7d77c.firebaseapp.com",
	databaseURL: "https://desktopchatapp-7d77c.firebaseio.com",
	projectId: "desktopchatapp-7d77c",
	storageBucket: "desktopchatapp-7d77c.appspot.com",
	messagingSenderId: "993313812580",
	appId: "1:993313812580:web:4231da3c52a7170f8cef71",
	measurementId: "G-YQBMVSYM6P"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.analytics();


signIn = () => {
	var email = document.getElementById("inputEmail").value;
	var password = document.getElementById("inputPassword").value;
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
		console.log("success");
		ipcRenderer.send('message-dialog', 'info', 'Sucessfully Login');
		window.location.href = "index-2.html";
	}).catch(function(error) {
	  	var errorCode = error.code;
	  	var errorMessage = error.message;
	  	ipcRenderer.send('message-dialog', 'error', errorMessage);
	});
}

signUp = () => {
	var email = document.getElementById("inputEmail").value;
	var password = document.getElementById("inputPassword").value;
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
		console.log("success");
		ipcRenderer.send('message-dialog', 'info', 'Sucessfully Sign Up');
		window.location.href = "index-2.html";
	}).catch(function(error) {
	  	var errorCode = error.code;
	  	var errorMessage = error.message;
	  	ipcRenderer.send('message-dialog', 'error', errorMessage);
	});
}