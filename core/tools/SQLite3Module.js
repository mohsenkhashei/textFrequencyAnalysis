const sqlite3 = require("sqlite3").verbose();

class SQLite3Module {
  constructor(dbName) {
    this.db = new sqlite3.Database(dbName);
  }

  // delete table data
  delete(tableName, callback) {
    const sql = `DELETE FROM ${tableName}`;
    this.db.run(sql, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log(`Rows deleted: ${this.changes}`);
      }
      callback(err);
    });
  }
  schema(tableName, schema, callback) {
    let tableStructure = "";
    for (const [key, value] of Object.entries(schema)) {
      tableStructure += `${key} ${value}, `;
    }

    const sql = `CREATE TABLE IF NOT EXISTS ${tableName}(${tableStructure.slice(
      0,
      -2
    )})`;

    this.db.run(sql, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log(`Schema Created`);
      }
      callback(err);
    });
  }

  // Insert a record
  insert(tableName, data, callback) {
    const value1 = data.paragraph;
    const value2 = data.frAnalysis;

    this.db.run(
      `INSERT INTO ${tableName} (paragraph, frAnalysis) VALUES (?, ?)`,
      [value1, value2],
      function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log(`A row has been inserted with ID ${this.lastID}`);
        }
        callback(err);
      }
    );
  }
  insertWithReplacement(tableName, data, callback) {
    const paragraph = data.paragraph;
    const frAnalysis = data.frAnalysis;
    const replacement = data.replacement;

    this.db.run(
      `INSERT INTO ${tableName} (paragraph, frAnalysis, replacement) VALUES (?, ?, ?)`,
      [paragraph, frAnalysis, replacement],
      function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log(`A row has been inserted with ID ${this.lastID}`);
        }
        callback(err);
      }
    );
  }

  select(tableName, columns, condition) {
    const cols = columns.join(", ");
    let sql = `SELECT ${cols} FROM ${tableName}`;
    if (condition) {
      sql += ` ${condition}`;
    }

    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          // console.error(err.message);
          reject(err);
        } else {
          // console.log(rows);
          resolve(rows);
        }
      });
    });
  }
  selectSync(tableName, columns, condition) {
    const cols = columns.join(", ");
    let sql = `SELECT ${cols} FROM ${tableName}`;
    if (condition) {
      sql += ` ${condition}`;
    }

    // Synchronously retrieve rows using a callback function
    const rows = this.db.all(sql);
    console.log(rows);
    // Process the retrieved rows
    return rows;
  }

  // Update records
  update(tableName, data, condition, callback) {
    const setClause = Object.entries(data)
      .map(([key, value]) => `${key}='${value}'`)
      .join(", ");

    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${condition}`;

    this.db.run(sql, function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Rows updated: ${this.changes}`);
      }
      callback(err);
    });
  }

  // Delete entire database
  deleteDatabase(callback) {
    this.db.close((err) => {
      if (err) {
        console.error(err.message);
        callback(err);
      } else {
        const fs = require("fs");
        fs.unlink(this.db.filename, (err) => {
          if (err) {
            console.error(err.message);
            callback(err);
          } else {
            console.log(`Database ${this.db.filename} has been deleted`);
            callback(null);
          }
        });
      }
    });
  }
}

module.exports = SQLite3Module;
