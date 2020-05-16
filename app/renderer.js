// Your web app's Firebase configuration
const { ipcRenderer, shell } = require("electron");
const {getCurrentWindow, globalShortcut} = require('electron').remote;
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
// const xlsxFile = require("read-excel-file/node");
// var excel = require("excel4node");
// var admin = require("firebase-admin");

// var serviceAccount = require("./desktopchatapp-7d77c-firebase-adminsdk-1brzy-7e7ee7b250.json");

var reload = ()=>{
  getCurrentWindow().reload()
}

globalShortcut.register('F5', reload);
globalShortcut.register('CommandOrControl+R', reload);
window.addEventListener('beforeunload', ()=>{
  globalShortcut.unregister('F5', reload);
  globalShortcut.unregister('CommandOrControl+R', reload);
})

var loginUser;
var currentChatId;
var currentChatName = "Please Select Room";
var allUsers = [];
var allUserEmail = [];
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://desktopchatapp-7d77c.firebaseio.com",
// });

var firebaseConfig = {
  apiKey: "*******************************************",
  authDomain: "*****************************************",
  databaseURL: "*******************************************",
  projectId: "*****************************************",
  storageBucket: "*********************************************",
  messagingSenderId: "*****************************************",
  appId: "****************************************************",
  measurementId: "*****************************************",
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
        //ipcRenderer.send("message-dialog", "info", "Sucessfully login.");

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
    .database()
    .ref("user/" + loginUser.uid + "/status")
    .set("offline");

  firebase
    .auth()
    .signOut()
    .then(function () {
      ipcRenderer.send("message-dialog", "info", "Signout successfully !");
      window.location.href = "sign-in.html";
    })
    .catch(function (error) {
      ipcRenderer.send("message-dialog", "error", error.toString());
    });
};

activateRoom = (room_name, room_id) => {
  document.getElementById("checkEmptyChat").style.display = "block";
  document.getElementById("showMembers").style.display = "none";
  document.getElementById("content").style.display = "none";
  document.getElementById("addMessagesHere").innerHTML = "";
  document.getElementById("containerChat").style.display = "block";
  currentChatId = room_id;
  currentChatName = room_name;

  document.getElementById("currentChatName").innerHTML = currentChatName;

  firebase
    .database()
    .ref("rooms/" + currentChatId + "/messages")
    .on("child_added", function (snapshot) {
      shell.beep();
      scrollToBottom(document.getElementById("scrollToView"));
      document.getElementById("checkEmptyChat").style.display = "none";
      document.getElementById("content").style.display = "block";
      var newMessage = snapshot.val();
      var dateAdded = new Date(newMessage.DateCreated);
      dateAddedString = dateAdded.toGMTString();
      if (newMessage.senderId == loginUser.uid) {
        document.getElementById("addMessagesHere").innerHTML +=
          '<div class="message me"><div class="text-main"><div class="text-group me"><div class="text me"><p>' +
          newMessage.message +
          "</p></div></div><span>" +
          dateAddedString +
          "</span></div></div>";
      } else {
        document.getElementById("addMessagesHere").innerHTML +=
          '<div class="message"><img class="avatar-md" src="dist/img/avatars/avatar-female-5.jpg" data-toggle="tooltip" data-placement="top" title=\'' +
          newMessage.senderName +
          '\' alt="avatar"><div class="text-main"><div class="text-group"><div class="text"><p>' +
          newMessage.message +
          "</p></div></div><span>" +
          dateAddedString +
          "</span></div></div>";
      }
    });
};

defaultLoadings = () => {
  if (!loginUser) {
    window.location.href = "sign-in.html";
    ipcRenderer.send("message-dialog", "error", "Connection Time Out");
  }
  document.getElementsByClassName("loginPerson")[0].innerHTML =
    loginUser.displayName;
  document.getElementsByClassName("loginPerson")[1].innerHTML =
    loginUser.displayName;
  //currentChatId = loginUser.uid;
  document.getElementById("currentChatName").innerHTML = currentChatName;
  document.getElementById("email").innerHTML = loginUser.email;
  document.getElementById("type").innerHTML = "STUDENT";
  if (loginUser.email[loginUser.email.length - 4] == "c") {
    document.getElementById("type").innerHTML = "FACULTY";
  }
  document.getElementById("lastLogin").innerHTML =
    loginUser.metadata.lastSignInTime;
};

GetSortOrder = (prop) => {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
};

initialize = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      loginUser = user;
    }
  });
  setTimeout(function () {
    var user = firebase.auth().currentUser;
    loginUser = user;
    defaultLoadings();

    firebase
      .database()
      .ref("user/" + loginUser.uid + "/status")
      .set("online");

    firebase
      .database()
      .ref("user/" + loginUser.uid + "/roomList")
      .on("child_added", function (snapshot, prevChildKey) {
        shell.beep();
        var newRoom = snapshot.val();
        var string_1 =
          "<a href='#list-chat' onclick=\"activateRoom('" +
          newRoom.roomName +
          "','" +
          newRoom.roomId;
        var string_2 =
          "')\" class='filterDiscussions all unread single active' id='list-chat-list' data-toggle='list' role='tab'><img class='avatar-md' src='dist/img/avatars/download1.png' data-toggle='tooltip' data-placement='top' title='classroom' alt='avatar'><div class='status'><i class='material-icons online'>fiber_manual_record</i></div><div class='data'><h5>" +
          newRoom.roomName +
          "</h5></div></a>";
        var final = string_1 + string_2;
        document.getElementById("chats").innerHTML += final;
      });

    setTimeout(showPage, 1000);
  }, 5000);

  firebase
    .database()
    .ref("user/")
    .once("value", function (snapshot) {
      snapshot.forEach(function (child) {
        //console.log(child.val());
        allUsers.push({
          uid: child.val().uid,
          email: child.val().email,
        });
        allUserEmail.push(child.val().email);
      });
    });

  setTimeout(function () {
    allUsers.sort(GetSortOrder("email"));
    //console.log(allUsers);
    var ddl = document.getElementById("selectMembers");
    for (var i = 0; i < allUsers.length; i++) {
      if (allUsers[i].uid == loginUser.uid) continue;
      var option = document.createElement("OPTION");
      option.innerHTML = allUsers[i].email;
      option.value = allUsers[i].uid;
      ddl.options.add(option);
    }
  }, 5000);
};

sendMessage = () => {
  var message = document.getElementById("message").value;
  document.getElementById("message").value = "";
  //var messageId = firebase.database().ref().child('rooms/'+currentChatId).push().key;
  let std_dateCreated = firebase.database.ServerValue.TIMESTAMP;
  firebase
    .database()
    .ref("rooms/" + currentChatId + "/messages")
    .push()
    .set(
      {
        senderId: loginUser.uid,
        senderName: loginUser.displayName,
        message: message,
        DateCreated: std_dateCreated,
      },
      function (error) {
        if (error) {
          ipcRenderer.send("message-dialog", "error", error);
        }
      }
    );
};

createRoom = () => {
  var selected = [];
  var object = {};
  for (var option of document.getElementById("selectMembers").options) {
    if (option.selected) {
      selected.push(option.value);
    }
  }

  if(selected.length<=0){
    ipcRenderer.send("message-dialog", "info", "No member selected!");
    return;
  }

  selected.push(loginUser.uid);

  var roomId = firebase.database().ref().child("rooms/").push().key;
  var roomOwner = loginUser.uid;
  var dateCreated = firebase.database.ServerValue.TIMESTAMP;
  var roomName = document.getElementById("roomName").value;

  firebase
    .database()
    .ref("rooms/" + roomId)
    .set({
      roomOwner: roomOwner,
      dateCreated: dateCreated,
      roomName: roomName,
    });

  for (var i = 0; i < selected.length; i++) {
    //console.log(selected[i]);
    firebase
      .database()
      .ref("rooms/" + roomId + "/members")
      .push()
      .set({
        userId: selected[i],
        dateCreated: dateCreated,
      });

    firebase
      .database()
      .ref("user/" + selected[i] + "/roomList")
      .push()
      .set({
        roomId: roomId,
        roomName: roomName,
      });
  }
};

resetPassword = () => {
  var auth = firebase.auth();
  var emailAddress = document.getElementById("inputEmail").value;
  //console.log(email);
  auth
    .sendPasswordResetEmail(emailAddress)
    .then(function () {
      ipcRenderer.send(
        "message-dialog",
        "info",
        "Reset your password email sent!"
      );
    })
    .catch(function (error) {
      ipcRenderer.send("message-dialog", "error", error.toString());
    });
};

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
  } else {
    // No user is signed in.
  }
});

scrollToBottom = (el) => {
  if (el) {
    //el.scrollTop = (el.scrollHeight);
    el.scrollIntoView();
  }
};

showMembers = () => {
  if (currentChatId == loginUser.uid) return;
  console.log("showMembers");
  document.getElementById("showMembers").style.display = "block";
  document.getElementById("checkEmptyChat").style.display = "none";
  document.getElementById("containerChat").style.display = "none";
  document.getElementById("content").style.display = "none";

  document.getElementById("showMembersList").innerHTML = "";
  var listOfMembers = [];
  firebase
    .database()
    .ref("rooms/" + currentChatId + "/members")
    .on("child_added", function (snapshot) {
      listOfMembers.push(snapshot.val().userId);
    });

  setTimeout(function () {
    console.log(listOfMembers);
    for (var i = 0; i < listOfMembers.length; i++) {
      firebase
        .database()
        .ref("user/" + listOfMembers[i])
        .once("value", function (snapshot) {
          var element =
            '<a href="#list-chat" class="filterDiscussions all unread single active" id="list-chat-list" data-toggle="list"role="tab"><img class="avatar-md" src="dist/img/avatars/download.jpg" data-toggle="tooltip" data-placement="top" alt="avatar"><h5>' +
            snapshot.val().email +
            " - " +
            snapshot.val().status +
            "</h5></a>";
          document.getElementById("showMembersList").innerHTML += element;
        });
    }
  }, 2000);
};

showPage = () => {
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainBlock").style.display = "block";
};
