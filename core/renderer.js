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
	var input = document.getElementById("repControlInput").value;
	var errorElement = document.getElementById("error");
	var pattern = /^([a-zA-Z]+:[a-zA-Z]+(,[\s]*[a-zA-Z]+:[a-zA-Z]+)*)$/;
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
	let exitSection = document.getElementById("exitSection");
	exitSection.style.display = "none";
	let pare = document.getElementById("pare");
	pare.innerHTML = " ";

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
				console.log(processedData);
				// Access the processed data from the main process
				const pareSection = document.getElementById("pare");
				let paragraph = processedData.processedData.paragraph;
				let frAnalysis = processedData.processedData.frAnalysis;
				let strAnalysis = "";
				for (let i = 0; i < frAnalysis.length; i++) {
					strAnalysis +=
						frAnalysis[i].letter + "->" + frAnalysis[i].count + " ";
				}
				let contentTemplate = `
        <section class="card show-section" >
          <div class="row">
            <div class="col">
              <div class="alert alert-success" role="success">
                Here Is Your File Content.
              </div>
              <p class="fw-semibold">${paragraph}</p>
              <div class="shadow p-3 mb-2 bg-body-tertiary rounded">
                <p class="fs-10 fst-italic">Frequency Analysis:</p>
                <p class="fw-bold count-result">${strAnalysis}</p>
              </div>
            </div>
          </div>
       </section>
        `;
				let exitSection = document.getElementById("exitSection");
				exitSection.style.display = "block";
				pareSection.innerHTML = contentTemplate;
			});
		});
	}
}
const button = document.getElementById("processData");

// Add click event listener to the button
button.addEventListener("click", function (ev) {
	ev.stopPropagation();
	ev.preventDefault();
	console.log("clicked in new");

	if (validateInput()) {
		const replacementInput = document.getElementById("repControlInput");
		const pare = document.getElementById("pare");
		console.log(replacementInput.value);
		ipcRenderer.send("switchLetters", replacementInput.value);
		let isSwitchLettersResponseHandled = false;
		ipcRenderer.on("switchLettersResponse", (event, result) => {
			if (isSwitchLettersResponseHandled) {
				return;
			}

			// Set the flag to indicate that the event is being handled
			isSwitchLettersResponseHandled = true;
			let frAnalysis = result.frAnalysis;
			let strAnalysis = "";
			for (let i = 0; i < frAnalysis.length; i++) {
				strAnalysis +=
					frAnalysis[i].letter + "->" + frAnalysis[i].count + " ";
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
			console.log("here");
			pare.innerHTML += contentTemplate;
		});
	}
});

function exit() {
	let exitSection = document.getElementById("exitSection");
	exitSection.style.display = "none";
}

function deletePreFile() {
	ipcRenderer.send("deletePreviousFile");
	ipcRenderer.on("deletePreviousFileResponse", (event, rs) => {
		if (rs.deleted) {
			console.log("deleted successfully");
		} else {
			console.log("we have problem");
		}
	});
}
