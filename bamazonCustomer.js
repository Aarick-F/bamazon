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

function homeMenu() {
  getProducts();
  inquirer.prompt([
    {
      name: "selection",
      type: "input",
      message: "Product ID: "
    }, {
      name: "quantity",
      type: "input",
      message: "How many would you like to purchase?"
    }
  ])
  .then(data => {
    console.log("Yep.");
  });
}

function getProducts() {
  const query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    if(err) throw err;
    printProducts(res);
  });
}

function printProducts(products) {
  console.log("\n| Welcome to the Bamazonian Super General Store!" +
              "\n| Please take a look at our wares below!" +
              "\n| ==========================================");
  console.log("\n| ID | ITEM | DEPARTMENT | PRICE");
  products.forEach(product => {
    console.log("| " + product.item_id + " | " + product.product_name + " | " +
                product.department_name + " | $" + product.price);
  });
  console.log("\n| Please enter the ID of the product you wish to buy...");
}

homeMenu();