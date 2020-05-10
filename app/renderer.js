// Your web app's Firebase configuration
const { ipcRenderer } = require("electron");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const xlsxFile = require("read-excel-file/node");
var excel = require("excel4node");
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

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
  } else {
    // No user is signed in.
  }
});

writeUserData = (userId, email, name, dateCreated) => {
  firebase
    .database()
    .ref("users/" + userId)
    .set(
      {
        name: name,
        email: email,
        type: "faculty",
        dataCreated: dateCreated,
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

  setTimeout(function () {
    console.log(window.flag);
    if (window.flag) {
      var user = firebase.auth().currentUser;
      writeUserData(user.uid, firstName, lastName, email);
    }
  }, 3000);
};

// Up to 1000 users can be imported at once.


createSingleUser = (email,password,name) => {
  admin.auth().createUser({
  email: email,
  emailVerified: true,
  //phoneNumber: '+917621093509',
  password: password,
  displayName: name,
  //photoURL: 'http://www.example.com/12345678/photo.png',
  disabled: false
})
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);
  })
  .catch(function(error) {
    console.log('Error creating new user:', error);
  });
};


/*
ListAllUserAtAuthenticationSection = (nextPageToken) => {
	// List batch of users, 1000 at a time.
  	admin.auth().listUsers(1000, nextPageToken).then(function(listUsersResult) {
  		listUsersResult.users.forEach(function(userRecord) {
    		console.log('user', userRecord.toJSON());
  		});
  		if (listUsersResult.pageToken) {
    		// List next batch of users.
    		listAllUsers(listUsersResult.pageToken);
  		}
    }).catch(function(error) {
      	console.log('Error listing users:', error);
    });
}
*/


/*AdddingUserIntoAthenticationSection = () => {
    // 2019_20_Even_sem_Unit_Test_data
	xlsxFile('FacultyData.xlsx').then((rows) => {
		var cnt = 0
		for (i in rows){
			email = rows[cnt][0];
			name = rows[cnt][1];
       		createSingleUser(email,"password",name);
       		// console.log(email);
       		// console.log(name);
   			cnt++;
   		}
	});
}*/

// Fetching user authenticated data from the firebase

// createExcelFile = (nextPageToken) => {
// 	var workbook = new excel.Workbook();
// 	var worksheet = workbook.addWorksheet('17IT_Faculty');
// 	worksheet.cell(1,1).string('EMAIL');
// 	worksheet.cell(1,2).string('UID');
// 	worksheet.cell(1,3).string('NAME');
// 	var cnt = 1;
// 	admin.auth().listUsers(1000, nextPageToken).then(function(listUsersResult) {
//   		listUsersResult.users.forEach(function(userRecord) {
  			
//   			var userRecordJsonObject = userRecord.toJSON();
//   			var email = userRecordJsonObject.email;
//   			if(email[email.length-4]=='c'){
//   				cnt++;
//   				console.log(userRecordJsonObject.email);
//   				worksheet.cell(cnt,1).string(userRecordJsonObject.email);
//     			worksheet.cell(cnt,2).string(userRecordJsonObject.uid);
//     			worksheet.cell(cnt,3).string(userRecordJsonObject.displayName);
//   			}

//   		});
//   		if (listUsersResult.pageToken) {
//     		// List next batch of users.
//     		createExcelFile(listUsersResult.pageToken);
//   		}
//     }).catch(function(error) {
//       	console.log('Error listing users:', error);
//     });
//     setTimeout(function(){ workbook.write('UserData2.xlsx'); }, 5000);
// }


insertUsersIntoRD = () => {
  let std_dateCreated = firebase.database.ServerValue.TIMESTAMP;
  xlsxFile("FacultyData.xlsx").then((rows) => {
    let cnt = 0;
    for (i in rows) {
      let std_email = rows[cnt][0].toString();
      let std_uid = rows[cnt][1].toString();
      let std_name = rows[cnt][2].toString();
      console.log("Email:" + std_email);
      writeUserData(std_uid, std_email, std_name, std_dateCreated);
      cnt += 1;
    }
  });
}

/*firebase
    .database()
    .ref("users/" + "1234567890")
    .set(
      {
        Name: "mann",
        Type: "student",
        DateCreated: dateCreated,
      },
      function (error) {
        if (error) {
          ipcRenderer.send("message-dialog", "error", error);
        }
      }
    );*/
//};

initialize = () => {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
    		//ipcRenderer.send("message-dialog", "info", user.email);
    		document.getElementById("email").value = user.email;
  		} else {
    		// No user is signed in.
  		}
	});
}


