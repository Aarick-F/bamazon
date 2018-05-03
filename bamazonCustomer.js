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
    const query = "SELECT * FROM products";
    let itemID = data.selection - 1;
    let amountToBuy = data.quantity;
    connection.query(query, (err, res) => {
      if(err) throw err;
      let itemObj = res[itemID];
      if(itemObj.stock_quantity < amountToBuy) {
        console.log("Sorry! We don't have " + amountToBuy + " " +
                    itemObj.product_name + "s");
        console.log("Taking you back to the menu...");
        setTimeout(homeMenu, 3000);
      } else {
        let newQuantity = itemObj.stock_quantity - amountToBuy;
        let updateQuery = "UPDATE products " +
                            "SET stock_quantity = " + newQuantity + " " +
                            "WHERE item_id = " + (itemID + 1);
        connection.query(updateQuery, (err, res) => {
          if(err) throw err;
          console.log("THANK YOU FOR YOUR PURCHASE!!!" +
                      "\nYou spent $" + itemObj.price * amountToBuy);
          console.log("Taking you back to the home menu...");
          setTimeout(homeMenu, 4000);
        });
      }
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
    head: ["ID", "ITEM", "DEPARTMENT", "PRICE", "STOCK"]
  });
  products.forEach(product => {
    table.push([product.item_id, product.product_name,
                product.department_name, product.price, product.stock_quantity]);
  });
  console.log(table.toString());
}

homeMenu();