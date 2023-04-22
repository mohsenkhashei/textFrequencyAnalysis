/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const { ipcRenderer } = require("electron");
const fs = require("fs");
function getFileText() {
  const fileInput = document.getElementById("fileInput");

  // Check if a file is selected
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const filePath = file.path;

    // Read file contents
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      // Send file data to main process via IPC
      ipcRenderer.send("fileData", data);
    });
  }
}
