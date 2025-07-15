const mariadb = require('mysql2');
const {StatusCodes} = require('http-status-codes');
const { resolve } = require('path');
const { rejects } = require('assert');

const conn = mariadb.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'Bookshop',
    dateStrings: true
});

const dbQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {conn, dbQuery};