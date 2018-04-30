require('dotenv').config();

const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.USER,
  password: process.env.MY_PASSWORD,
  database: process.env.MY_DATABASE
});

connection.connect(function(err) {
  if(err) throw err;
  console.log("Connected on ID: " + connection.threadId);
  connection.end();
});