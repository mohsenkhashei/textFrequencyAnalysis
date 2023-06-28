const fs = require("fs");
const path = require("path");
const log = require("electron-log");

class JSONModule {
	constructor(filename) {
		const rootDirectory = path.join(__dirname, "../../");

		this.filename = path.join(rootDirectory, filename);
		this.data = null;
	}
	/**
	 * checking file is exist if deleted
	 *
	 */
	async clear() {
		return new Promise((resolve, reject) => {
			fs.access(this.filename, fs.constants.F_OK, (err) => {
				if (!err) {
					fs.unlink(this.filename, (err) => {
						if (err) {
							log.info(
								"An error occurred while deleting the file:",
								err
							);
							return;
							reject(err);
						}
						resolve();
					});
				} else {
					log.info("ready to process");
					resolve();
				}
			});
		});
	}
	/**
	 * reading file and load to class
	 * @
	 */
	async init() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.filename, "utf8", (err, data) => {
				if (err) {
					log.error(err);
					reject(err);
				} else {
					try {
						this.data = JSON.parse(data);
						resolve();
					} catch (error) {
						log.error(error);
						reject(error);
					}
				}
			});
		});
	}

	async query() {
		return this.data;
	}

	async run(data) {
		this.data = data;
		return new Promise((resolve, reject) => {
			// fs.access(this.filename, fs.constants.F_OK, (err) => {
			// if (!err) {
			fs.writeFile(
				this.filename,
				JSON.stringify(data, null, 2),
				{ mode: 0o777, encoding: "utf8" },
				(errr) => {
					if (errr) {
						log.error(errr);
						reject(errr);
					} else {
						resolve();
					}
				}
			);
			resolve();
			// } else {
			// 	log.error(`${err} in ${__dirname}`);
			// 	reject(err);
			// }
			// });
		});
	}

	async close() {
		this.data = null;
	}
}

module.exports = JSONModule;
