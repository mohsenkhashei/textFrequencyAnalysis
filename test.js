// const schema = {
//   ID: "INTEGER PRIMARY KEY",
//   text: "TEXT NOT NULL",
//   frAnalysis: "VARCHAR(100)",
//   replacement: "VARCHAR(100)",
// };

// let sql = "";
// for (const [key, value] of Object.entries(schema)) {
//   sql += `${key} ${value}, `;
// }

// console.log(sql.slice(0, -2));

// const { countLetters } = require("./frequencyAnalysis");
// console.log(countLetters("asdfassdfsdfasdfsdflg;lhprtohportaswerwegqwefwedf"));

// const replacementInput = "M:a,A:b,N:c,U:d,S:e,C:f";
// // const letterArray = { G: "T" };
// console.log(replacementInput);

// let arr = replacementInput.split(",");
// const obj = {};

// for (let i = 0; i < arr.length; i++) {
//   const [key, value] = arr[i].trim().split(":");
//   obj[key] = value;
// }
// console.log(obj);

// const SQLite3Module = require("./core/tools/SQLite3Module"); // Update the path to the location of the module

// (async () => {
//   try {
//     const myDb = new SQLite3Module("myDatabase.db");
//     await myDb.init();
//     const tableName = "testTBL";
//     const schema = {
//       ID: "INTEGER PRIMARY KEY",
//       paragraph: "TEXT NOT NULL",
//       frAnalysis: "VARCHAR(255)",
//       replacement: "VARCHAR(100)",
//     };
//     let tableStructure = "";
//     for (const [key, value] of Object.entries(schema)) {
//       tableStructure += `${key} ${value}, `;
//     }

//     const sql = `CREATE TABLE IF NOT EXISTS ${tableName}(${tableStructure.slice(
//       0,
//       -2
//     )})`;
//     await myDb.query(sql);
//     console.log(`Schema Created`);
//     await myDb.close();
//   } catch (err) {
//     console.error(err);
//   }
// })();
// let db;
// try {
//   db = await new SQLite3Module("testDB");
//   await db.init();

//   db.schema(tableName, schema, (err) => {
//     if (err) console.log(err);
//   });
// } catch (err) {
//   // SQLITE_CANTOPEN can handle here!
//   return "Please contact your system administrator.";
// }
let text = "asdf";
let frAnalysis = "asdfdss";
const data = { paragraph: text, frAnalysis: JSON.stringify(frAnalysis) };
console.log(Object.keys(data).toString());
console.log(Object.values(data));
