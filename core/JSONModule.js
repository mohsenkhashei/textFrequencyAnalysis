const fs = require("fs");
const path = require("path");
const log = require("electron-log");
const { app } = require("electron");

class JSONModule {
	constructor(filename) {
		const userDataPath = app.getPath("userData");

		// Specify the directory and file path
		const directoryPath = path.join(userDataPath, "database");
		const filePath = path.join(directoryPath, filename);

		// Create the directory if it doesn't exist
		if (!fs.existsSync(directoryPath)) {
			fs.mkdirSync(directoryPath);
			log.info(`Directory Created in: ${filePath}`);
		} else {
			log.info(`Directory Existed in: ${filePath}`);
		}

		this.filename = filePath;
		this.data = null;
		this.encoding = "utf8";
	}

	/**
	 * reading file and load to class
	 * @
	 */
	async reading() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.filename, this.encoding, (err, data) => {
				if (err) {
					log.error(err);
					reject(err);
				} else {
					log.info(data);
					this.data = JSON.parse(data);
					// this.data = data;
					resolve();
				}
			});
		});
	}

	async query() {
		return this.data;
	}

	async writing(data) {
		this.data = data;
		return new Promise((resolve, reject) => {
			// fs.access(this.filename, fs.constants.F_OK, (err) => {
			// if (!err) {
			fs.writeFile(
				this.filename,
				JSON.stringify(data, null, 2),
				{ mode: 0o777, encoding: this.encoding },
				(errr) => {
					if (errr) {
						log.error(errr);
						reject(errr);
					} else {
						// this.data = JSON.stringify(data, null, 2);
						// log.info(JSON.stringify(data, null, 2));
						resolve();
					}
				}
			);
		});
	}
}

module.exports = JSONModule;
