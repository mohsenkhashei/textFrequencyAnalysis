const log = require("electron-log");
const JSONModule = require("./JSONModule");
const { countLetters, switchLetters } = require("./frequencyAnalysis");
const FILE_NAME = "database/frequencyTBL.json";

const deletePrev = async () => {
	try {
		const jsonDB = new JSONModule(FILE_NAME);
		await jsonDB.clear();
		log.info("previous file deleted");
		return { deleted: true };
	} catch (err) {
		log.error("problem in deleting file", err);
	}
};
const init = async (text) => {
	const jsonDB = new JSONModule(FILE_NAME);

	try {
		const frAnalysis = countLetters(text);
		const data = [
			{ ID: 1, paragraph: text, frAnalysis: JSON.stringify(frAnalysis) },
		];

		await jsonDB.run(data);
		log.info(`count of inserted data: ${data.length} in ${FILE_NAME}`);

		return { paragraph: text, frAnalysis: frAnalysis };
	} catch (err) {
		log.error(err);
	}
};

const changeInput = (replacementInput) => {
	// const replacementInput = "M:a,A:b,N:c,U:d,S:e,C:f";
	// const letterArray = { G: "T" };
	let arr = replacementInput.split(",");
	const obj = {};
	for (let i = 0; i < arr.length; i++) {
		const [key, value] = arr[i].trim().split(":");
		obj[key] = value;
	}
	return obj;
};
const getData = async (jsonDB) => {
	try {
		const response = await jsonDB.query();
		const lastItem = response[response.length - 1];
		log.info(`getData data retrived`);
		return lastItem;
	} catch (err) {
		log.error(err);
	}
};
const processSwitchLetters = async (replacement) => {
	try {
		const jsonDB = new JSONModule(FILE_NAME);
		await jsonDB.init();

		let changedInput = changeInput(replacement);
		//##############################
		log.info("getting data ");
		// const rs = await getData(jsonDB);

		const response = await jsonDB.query();
		const lastItem = response[response.length - 1];
		log.info(`getData data retrived`);

		//##########################
		const newText = switchLetters(lastItem.paragraph, changedInput);
		const frAnalysis = countLetters(newText);
		const data = {
			paragraph: newText,
			frAnalysis: JSON.stringify(frAnalysis),
			replacement: replacement,
		};

		response.push(data);
		await jsonDB.run(response);
		log.info(`Last inserted `);

		let output = {
			paragraph: newText,
			frAnalysis: frAnalysis,
			replacement: replacement,
		};
		// log.info(output);
		return output;
	} catch (err) {
		log.error(err);
	}
};

module.exports = { init, processSwitchLetters, deletePrev };
