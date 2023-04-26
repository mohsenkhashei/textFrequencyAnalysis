const SQLite3Module = require("./SQLite3Module");
const path = require("path");
const { countLetters, switchLetters } = require("./frequencyAnalysis");
const DB_NAME = "frequencyDB.db";
const TABLE_NAME = "frequencyTBL";
const DB_PATH = `${path.resolve("./database/" + DB_NAME)}`.replace(
  "app.asar",
  "app.asar.unpacked"
);

const _deleteTable = async (db) => {
  const sql = `DELETE FROM ${TABLE_NAME}`;
  try {
    await db.run(sql);
    console.log(`Table Deleted`);
  } catch (err) {
    console.error(err);
  }
};
const _createSchema = async (db) => {
  const schema = {
    ID: "INTEGER PRIMARY KEY",
    paragraph: "TEXT NOT NULL",
    frAnalysis: "VARCHAR(255)",
    replacement: "VARCHAR(100)",
  };
  let query = "";
  for (const [key, value] of Object.entries(schema)) {
    query += `${key} ${value}, `;
  }
  let tableStructure = query.slice(0, -2);
  const sql = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (${tableStructure})`;
  try {
    await db.query(sql);
    console.log(`Schema Created`);
  } catch (err) {
    console.error(err);
  }
};

const init = async (text) => {
  const db = new SQLite3Module(DB_PATH);
  await db.init();

  _deleteTable(db);
  _createSchema(db);

  try {
    const frAnalysis = countLetters(text);
    const data = { paragraph: text, frAnalysis: JSON.stringify(frAnalysis) };
    const columns = Object.keys(data).toString();
    const params = Object.values(data);

    const sql = `INSERT INTO ${TABLE_NAME} (${columns}) VALUES (?, ?)`;
    const lastInsertedId = await db.run(sql, params);
    console.log(`Last inserted ID: ${lastInsertedId}`);

    await db.close();
    return { paragraph: text, frAnalysis: frAnalysis };
  } catch (err) {
    console.error(err);
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
const getData = async (db) => {
  try {
    const columns = ["ID", "paragraph", "frAnalysis", "replacement"];
    const cols = columns.join(", ");
    let sql = `SELECT ${cols} FROM ${TABLE_NAME} ORDER BY ID DESC LIMIT 1`;
    const response = await db.query(sql);
    console.log(response);
    return response[0];
    // Process the retrieved rows
  } catch (err) {
    console.error(err);
  }
};
const processSwitchLetters = async (replacement) => {
  try {
    const db = new SQLite3Module(DB_PATH);
    await db.init();

    let changedInput = changeInput(replacement);

    const rs = await getData(db);
    const newText = switchLetters(rs.paragraph, changedInput);
    const frAnalysis = countLetters(newText);
    const data = {
      paragraph: newText,
      frAnalysis: JSON.stringify(frAnalysis),
      replacement: replacement,
    };
    const columns = Object.keys(data).toString();
    const params = Object.values(data);
    const sql = `INSERT INTO ${TABLE_NAME} (${columns}) VALUES (?, ?, ?)`;
    const lastInsertedId = await db.run(sql, params);
    console.log(`inserted with ${lastInsertedId}`);
    let output = {
      paragraph: newText,
      frAnalysis: frAnalysis,
      replacement: replacement,
    };
    return output;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { init, processSwitchLetters };
