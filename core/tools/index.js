const SQLite3Module = require("./SQLite3Module"); // Update the path to the location of the module
const path = require("path");
// Create an instance of the module
const { countLetters, switchLetters } = require("./frequencyAnalysis");
//
console.log(__dirname);
const dbPath = `${__dirname}/dist/frequencyDB.db`.replace(
  "app.asar",
  "app.asar.unpacked"
);
// const db = new SQLite3Module(path);
const db = new SQLite3Module(dbPath);
const tableName = "frequencyTBL";
const schema = {
  ID: "INTEGER PRIMARY KEY",
  paragraph: "TEXT NOT NULL",
  frAnalysis: "VARCHAR(255)",
  replacement: "VARCHAR(100)",
};

const init = (text) => {
  db.schema(tableName, schema, (err) => {
    if (err) console.log(err);
  });

  const frAnalysis = countLetters(text);
  const data = { paragraph: text, frAnalysis: JSON.stringify(frAnalysis) };
  db.insert(tableName, data, (err) => {
    if (err) {
      console.log(err);
    }
  });
  return { paragraph: text, frAnalysis: frAnalysis };
};

const changeInput = (replacementInput) => {
  //   const replacementInput = "M:a,A:b,N:c,U:d,S:e,C:f";
  // const letterArray = { G: "T" };
  let arr = replacementInput.split(",");
  const obj = {};

  for (let i = 0; i < arr.length; i++) {
    const [key, value] = arr[i].trim().split(":");
    obj[key] = value;
  }
  return obj;
};
const getData = async () => {
  try {
    const columns = ["ID", "paragraph", "frAnalysis", "replacement"];
    const response = await db.select(
      tableName,
      columns,
      "ORDER BY ID DESC LIMIT 1"
    );
    return response[0];
    // Process the retrieved rows
  } catch (err) {
    console.error(err);
  }
};
const processSwitchLetters = async (replacement) => {
  let changedInput = changeInput(replacement);

  const sooo = await getData()
    .then((rs) => {
      const newText = switchLetters(rs.paragraph, changedInput);
      const frAnalysis = countLetters(newText);
      //   console.log(frAnalysis);
      const data = {
        paragraph: newText,
        frAnalysis: JSON.stringify(frAnalysis),
        replacement: replacement,
      };
      db.insert(tableName, data, (err) => {
        if (err) {
          console.log(err);
        }
        // console.log(output);
      });
      let output = {
        paragraph: newText,
        frAnalysis: frAnalysis,
        replacement: replacement,
      };
      return output;
    })
    .catch((err) => {
      console.error(err);
    });
  return sooo;
};

module.exports = { init, processSwitchLetters };
