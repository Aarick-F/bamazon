require('dotenv').config();

const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.MY_PASSWORD,
  database: process.env.MY_DATABASE
});

function homeMenu() {
  getProducts();
  inquirer.prompt([
    {
      name: "selection",
      type: "input",
      message: "Please enter the ID of the product you would like to purchase..."
    }, {
      name: "quantity",
      type: "input",
      message: "How many would you like to purchase?"
    }
  ])
  .then(data => {
    if(parseInt(data.selection) === NaN) {
      console.log("It looks like the item you selected wasn't an option," +
                  "\nTaking you back to the home menu...");
      homeMenu();
    }
    const query = "SELECT * FROM products";
    connection.query(query, (err, res) => {
      if(err) throw err;
      console.log("GOT STUFF");
    });
  });
}

function getProducts() {
  const query = "SELECT * FROM products";
  connection.query(query, (err, res) => {
    if(err) throw err;
    printProducts(res);
  });
}

function printProducts(products) {
  console.log("\n| Welcome to the Bamazonian Super General Store!" +
              "\n| Please take a look at our wares below!" +
              "\n| ==========================================");
  let table = new Table({
    head: ["ID", "ITEM", "DEPARTMENT", "PRICE"]
  });
  products.forEach(product => {
    table.push([product.item_id, product.product_name,
                product.department_name, product.price]);
  });
  console.log(table.toString());
}

homeMenu();