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

const replacementInput = "M:a,A:b,N:c,U:d,S:e,C:f";
// // const letterArray = { G: "T" };
// console.log(replacementInput);

// let arr = replacementInput.split(",");
// const obj = {};

// for (let i = 0; i < arr.length; i++) {
//   const [key, value] = arr[i].trim().split(":");
//   obj[key] = value;
// }
// console.log(obj);

const SQLite3Module = require("./core/tools/SQLite3Module"); // Update the path to the location of the module

// Create an instance of the module
const {
  countLetters,
  switchLetters,
} = require("./core/tools/frequencyAnalysis");
const db = new SQLite3Module("frequencyDB");
const tableName = "frequencyTBL";

// const getData = async () => {
//   try {
//     const columns = ["ID", "paragraph", "frAnalysis"];
//     const response = await db.select(
//       tableName,
//       columns,
//       "ORDER BY ID DESC LIMIT 1"
//     );
//     return response[0];
//     // Process the retrieved rows
//   } catch (err) {
//     console.error(err);
//   }
// };
// getData()
//   .then((t) => {
//     console.log(t); // Logs the resolved value of the promise
//   })
//   .catch((err) => {
//     console.error(err);
//   });
// const { init, processSwitchLetters } = require("./core/tools/index");
// async function test() {
//   let result = await processSwitchLetters(replacementInput);
//   return result;
// }

// test()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
function validateInput(input) {
  // var input = document.getElementById("repControlInput").value; // Get input value from HTML input field
  // var errorElement = document.getElementById("error"); // Get error element by its ID

  // Define a regular expression pattern to match the input format
  var pattern =
    /^([a-zA-Z]{1,2}(:[a-zA-Z]{1,2})?)(,[a-zA-Z]{1,2}(:[a-zA-Z]{1,2})?)*$/;
  // Test the input against the regular expression pattern
  var isValid = pattern.test(input);

  if (isValid) {
    // If input is invalid, show error message
    // errorElement.style.display = "block";
    return true;
  } else {
    // If input is valid, hide error message (if shown)
    return false;
    // errorElement.style.display = "none";
  }
}

// const input = "e:o, R:q";
// console.log(validateInput(input));
function test(input) {
  // Regular expression pattern for validation
  var pattern =
    /^([a-zA-Z]{1,2}:[a-zA-Z]{1,2})(,[a-zA-Z]{1,2}:[a-zA-Z]{1,2})*$/;

  // Test the input against the pattern
  var result = pattern.test(input);

  // Return the result
  return result;
}

function test(input) {
  // Regular expression pattern for validation
  var pattern = /^([a-zA-Z]+:[a-zA-Z]+(,[\s]*[a-zA-Z]+:[a-zA-Z]+)*)$/;

  // Test the input against the pattern
  var result = pattern.test(input);

  // Return the result
  return result;
}

// Examples of inputs
var inputs = [
  "t:o,O:e",
  "K:i",
  "l:p,u:e",
  "D:s, f:s, A:u, I:p, q:x",
  "e:o, R:q",
  "a:b, c:G,",
  "d:b,",
];

// Test all inputs and print the results
for (var i = 0; i < inputs.length; i++) {
  var input = inputs[i];
  var result = test(input);
  console.log("Input" + (i + 1) + ": " + input + " - Valid: " + result);
}
