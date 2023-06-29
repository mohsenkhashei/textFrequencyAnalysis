// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { init, processSwitchLetters } = require("./index");

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 1000,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
			devTools: false, // disable DevTools
			contextIsolation: false, // enable context isolation
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "index.html"));

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	ipcMain.on("fileData", (event, data) => {
		init(data)
			.then((processedData) => {
				event.sender.send("fileDataResponse", { processedData });
			})
			.catch((error) => {
				console.error(error);
			});
	});
	ipcMain.on("switchLetters", (event, replacementInput) => {
		processSwitchLetters(replacementInput)
			.then((result) => {
				// console.log(result);
				event.sender.send("switchLettersResponse", result);
			})
			.catch((error) => {
				console.error(error);
			});
	});
});
// Quit when all windows are closed, except on macOS. There, it's common

// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
