/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const { ipcRenderer } = require("electron");
const fs = require("fs");

function validateInput() {
  var input = document.getElementById("repControlInput").value; // Get input value from HTML input field
  var errorElement = document.getElementById("error"); // Get error element by its ID

  // Define a regular expression pattern to match the input format
  var pattern = /^([a-zA-Z]+:[a-zA-Z]+(,[\s]*[a-zA-Z]+:[a-zA-Z]+)*)$/;
  // Test the input against the regular expression pattern
  var isValid = pattern.test(input);

  if (isValid) {
    // If input is valid, hide error message (if shown)
    errorElement.style.display = "none";
    return true;
  } else {
    // If input is invalid, show error message
    errorElement.style.display = "block";
    return false;
  }
}

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
      ipcRenderer.on("fileDataResponse", (event, processedData) => {
        // Access the processed data from the main process
        const content = document.getElementById("content");
        let paragraph = processedData.processedData.paragraph;
        let frAnalysis = processedData.processedData.frAnalysis;
        let strAnalysis = "";
        for (let i = 0; i < frAnalysis.length; i++) {
          strAnalysis +=
            frAnalysis[i].letter + "->" + frAnalysis[i].count + " ";
        }
        let contentTemplate = `<p class="fw-semibold">${paragraph}</p>
          <div class="shadow p-3 mb-2 bg-body-tertiary rounded">
            <p class="fs-10 fst-italic">Frequency Analysis:</p>
            <p class="fw-bold count-result">${strAnalysis}</p>
          </div>`;

        content.innerHTML += contentTemplate;
        console.log(processedData);
      });
    });
  }
}

function processData() {
  if (validateInput()) {
    const replacementInput = document.getElementById("repControlInput");
    const pare = document.getElementById("pare");
    console.log(replacementInput.value);
    ipcRenderer.send("switchLetters", replacementInput.value);
    ipcRenderer.on("switchLettersResponse", (event, result) => {
      let frAnalysis = result.frAnalysis;
      let strAnalysis = "";
      for (let i = 0; i < frAnalysis.length; i++) {
        strAnalysis += frAnalysis[i].letter + "->" + frAnalysis[i].count + " ";
      }
      let contentTemplate = `
    <section class="card show-section">
    <div class="row" id="nextContent">
      <div class="col">
        <div class="shadow p-3 mb-2 bg-body-tertiary rounded">
          <p class="fs-10 fst-italic">Your previous changes is:</p>
          <p class="fw-bold count-result">${result.replacement}</p>
        </div>
      </div>
    </section>
    <section class="card show-section">
      <div class="row" id="nextContent">
        <div class="col">
          <div class="alert alert-success" role="success">
            Here Is Your File Content.
          </div>
          <p class="fw-semibold">${result.paragraph}</p>
            <div class="shadow p-3 mb-5 bg-body-tertiary rounded">
              <p class="fs-10 fst-italic">Frequency Analysis:</p>
              <p class="fw-bold count-result">${strAnalysis}</p>
            </div>
        </div>
      </div>
    </section>
    `;
      pare.innerHTML += contentTemplate;
    });
  }
}

function exit() {
  let exitSection = document.getElementById("exitSection");
  exitSection.style.display = "none";
}
