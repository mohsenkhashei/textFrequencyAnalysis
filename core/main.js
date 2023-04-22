// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.webContents.openDevTools();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on("fileData", (event, data) => {
    console.log(data);
    console.log("here");
    // You can perform further operations with the file data in the main process, such as saving it to a file, processing it, etc.
  });
});
ipcMain.on("form-submission", (event, data) => {
  // const fileInput = document.getElementById('fileInput');
  // const file = fileInput.files[0]; // Get the selected file
  // if (file) {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const fileData = e.target.result; // Get the file data as ArrayBuffer, DataURL, etc.
  //     // You can use the fileData variable to perform further operations with the file data, such as sending it to the main process via IPC or displaying it in the user interface.
  //     console.log(fileData);
  //   };
  //   reader.readAsText(file);
  //   console.log("Form submitted:", data);
  //   let dataToSend = {
  //     text: data.text,
  //     language: data.language,
  //     processType: data.processType,
  //     shiftCount: data.shiftCount,
  //   };
  //   const startProcess = require("./encryptOrDecrypt")(dataToSend);
  //   console.log(startProcess);
  //   // Here you can handle the form submission data however you like
  //   // For this example, we'll just send back a message indicating success
  //   let processType = dataToSend.processType == 0 ? "Encrypt" : "Decrypt";
  //   let language = "";
  //   switch (dataToSend.language) {
  //     case 0:
  //       language = "English";
  //       break;
  //     case 1:
  //       language = "French";
  //       break;
  //     case 2:
  //       language = "Spanish";
  //       break;
  //     case 3:
  //       language = "Turkish";
  //       break;
  //     default:
  //       language = "English";
  //   }
  //   let template = `
  //   <div class="alert alert-info" ><p>input: ${dataToSend.shiftCount}:${dataToSend.processType}:${dataToSend.language}:${dataToSend.text}</p></div>
  // <div class="alert alert-success" role="alert">
  //   <h4 class="alert-heading">Done!</h4>
  //   <p>${processType}ing the "<b>${dataToSend.text}</b>" text with shift count of <b>${dataToSend.shiftCount}</b> in <b>${language}</b> language</p>
  //   <hr>
  //   <p class="mb-0">${processType}ed text is: <b>${startProcess}</b></p>
  // </div>`;
  //   event.sender.send("form-submission-reply", { message: template });
  // event.reply("form-submission-reply", { message: template });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
