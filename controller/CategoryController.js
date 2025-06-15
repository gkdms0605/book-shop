const express = require("express");
const { conn } = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allCategory = (req, res) => {
  let { id } = req.params;
  let sql = `SELECT * FROM category`;

  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { allCategory };
