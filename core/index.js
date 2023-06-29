const log = require("electron-log");
const JSONModule = require("./JSONModule");
const { countLetters, switchLetters } = require("./frequencyAnalysis");
const FILE_NAME = "frequencyTBL.json";

const init = async (text) => {
	try {
		const jsonDB = new JSONModule(FILE_NAME);
		const frAnalysis = countLetters(text);
		const data = [
			{
				paragraph: text,
				frAnalysis: JSON.stringify(frAnalysis),
				replacement: "",
			},
		];

		// await jsonDB.checkAccess();
		await jsonDB.writing(data);
		log.info(
			`count of inserted data: ${data.length} in ${jsonDB.filename}`
		);
		// await jsonDB.reading();
		// const response = await jsonDB.query();
		// log.debug(response);
		// log.info("###### data showed above ######");
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

const processSwitchLetters = async (replacement) => {
	try {
		const jsonDB = new JSONModule(FILE_NAME);

		//##########################################################################
		await jsonDB.reading();
		const response = await jsonDB.query();
		log.info(`getData data retrived`);
		log.info(response);
		const lastItem = response[response.length - 1];
		//##########################################################################
		let changedInput = changeInput(replacement);
		const newText = switchLetters(lastItem.paragraph, changedInput);
		const frAnalysis = countLetters(newText);
		const data = {
			paragraph: newText,
			frAnalysis: JSON.stringify(frAnalysis),
			replacement: replacement,
		};

		response.push(data);
		await jsonDB.writing(response);
		// log.info(`Last inserted ##### ${response.length}`);

		let output = {
			paragraph: newText,
			frAnalysis: frAnalysis,
			replacement: replacement,
		};

		return output;
	} catch (err) {
		log.error(err);
	}
};

module.exports = { init, processSwitchLetters };
