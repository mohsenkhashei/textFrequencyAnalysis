const sqlite3 = require("sqlite3");
const log = require("electron-log");
class SQLite3Module {
  constructor(dbName) {
    this.dbName = dbName;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(
        this.dbName,
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        (err) => {
          log.info(`init of db`);
          if (err) {
            log.error(err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async query(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          log.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async run(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          log.error(err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          log.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
module.exports = SQLite3Module;
