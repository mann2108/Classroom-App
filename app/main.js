// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  nativeImage,
  Menu,
  MenuItem,
} = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

const template = [
   {
      label: 'Edit',
      submenu: [
         {
            role: 'undo'
         },
         {
            role: 'redo'
         },
         {
            type: 'separator'
         },
         {
            role: 'cut'
         },
         {
            role: 'copy'
         },
         {
            role: 'paste'
         }
      ]
   },
   
   {
      label: 'View',
      submenu: [
         {
            role: 'reload'
         },
         {
            role: 'toggledevtools'
         },
         {
            type: 'separator'
         },
         {
            role: 'resetzoom'
         },
         {
            role: 'zoomin'
         },
         {
            role: 'zoomout'
         },
         {
            type: 'separator'
         },
         {
            role: 'togglefullscreen'
         }
      ]
   },
   
   {
      role: 'window',
      submenu: [
         {
            role: 'minimize'
         },
         {
            role: 'close'
         }
      ]
   },
   
   {
      role: 'help',
      submenu: [
         {
            label: 'Learn More'
         }
      ]
   }
]

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1010,
    height: 600,
    minWidth: 1010,
    minHeight: 600,
    show: false,
    icon: path.join(__dirname, "/Charusat2.png"),
  });

  // and load the index.html of the app.
  mainWindow.loadFile("./app/sign-in.html");
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}


const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("open-dialog", (event, arg) => {
  dialog.showOpenDialog(
    {
      properties: ["openDirectory", "openFile", "multiSelections"],
      filters: [{ name: "Image", extensions: ["jpeg", "png", "gif"] }],
    },
    (filePaths) => {
      if (filePaths) event.sender.send("selected-items", filePaths);
    }
  );
});
ipcMain.on("save-file-dialog", (event, args) => {
  dialog.showSaveDialog(
    {
      title: "Save Dialog",
      defaultPath:
        process.platform === "darwin"
          ? "/Users/haidermalik504/downloads/test/greet.txt"
          : "windows_path",
      filters: [{ name: "Text", extensions: "txt" }],
      buttonLabel: "Save",
    },
    (filename) => {
      console.log(filename);
      fs.writeFile(filename, "Hello there!", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File saved!");
      });
    }
  );
});

const errorIcon = nativeImage.createFromPath("images/error.png");
const infoIcon = nativeImage.createFromPath("images/info.png");
const questionIcon = nativeImage.createFromPath("images/question.png");

ipcMain.on("message-dialog", (event, dialogType, messageDetail) => {
  // console.log(dialogType);
  let iconType = "";
  switch (dialogType) {
    case "error":
      iconType = errorIcon;
      break;
    case "question":
      iconType = questionIcon;
      break;
    case "info":
      iconType = infoIcon;
      break;
    default:
      break;
  }
  dialog.showMessageBox(
    {
      type: dialogType,
      icon: iconType,
      defaultId: 1,
      title: dialogType,
      // detail: '',
      message: messageDetail,
      buttons: ["Cancel"], //right to left
    },
    (response) => {
      console.log(response);
    }
  );
});
ipcMain.on("error-box", () => {
  dialog.showErrorBox("Opps", "something went wrong");
});
