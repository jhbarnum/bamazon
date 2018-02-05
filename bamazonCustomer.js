var mysql = require("mysql");
var inquirer = require("inquirer");
var inventoryId = [];
var inventoryName = [];
var inventoryPrice = [];
var inventoryQuantityArr = [];
var productIdNumber = 0;
var productName = "";
var stockQuantity = 0;
var productPrice = 0;

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	database: "bamazon_db"
});

connection.connect(function(err) {
	if (err) throw err;
});

// function to set the inventory up in the console
function queryItemName() {
  	var query = connection.query("SELECT * FROM products",function(err, res) {
    for (var i = 0; i < res.length; i++) {
    	inventoryId.push(res[i].item_id);
    	inventoryName.push(res[i].product_name);
    	inventoryPrice.push(res[i].price);
    	inventoryQuantityArr.push(res[i].stock_quantity);
      	console.log("Id: " + res[i].item_id + " | " + " name: " + res[i].product_name + " | " + " price: " + res[i].price );
    	}
    	questions();
    });
}

// function to check inventory levels for purchase
function checkInventory(requestedQuantity) {
	 
	if (requestedQuantity > stockQuantity) {
		console.log("Not enough inventory. We can special order it if you like");
		return;
	} else {
		updateProduct(requestedQuantity);
	}
	return;
}

// function to update the mysql db
function updateProduct(requestedQuantity) {
	//var requestedQuantity = requestedQuantity;
	var newStockQuantity = stockQuantity - requestedQuantity;
	console.log("Gathering your order...\n" + productName + " \n" + "Quantity: " + requestedQuantity);
	var query = connection.query(
    	"UPDATE products SET ? WHERE ?",
    	[
      		{
        	stock_quantity: newStockQuantity
      		},
      		{
        	item_id: productIdNumber
      		}
    	],
    function(err, res) {
      	console.log("Order ready!\n");
     	customerTotal(requestedQuantity);
     	return;
    }   
)};

// adds the customer total
function customerTotal(requestedQuantity) {
	productPrice = productPrice * requestedQuantity;
	console.log("Your total is: " + productPrice)
	//return startNewGame();
	process.exit();
}

// after purchase, you get another chance to continue shopping
function startNewGame() {
	inquirer.prompt([
		{
			name: 'continueShopping',
			message: "Would you like to keep shopping? ( y or n )"
		}
	]).then(function (answer) {
		if (answer.startNewGame == "y") {
			console.log(answer.startNewGame)
			questions();
		} else {
			return;
		};

	});
};

// starts the shopping experience
function questions() {
	inquirer.prompt([
  		{
  		name: "item_id",
  		message: "What is the productId of the item you want to buy?"
  		},
  		{
  		name: "productQuantity",
  		message: "How many would you like to buy today?"
  		}
	]).then(function(answers) { 
		productIdNumber = answers.item_id;
		productName = inventoryName[answers.item_id - 1];
		stockQuantity = inventoryQuantityArr[answers.item_id -1];
		productPrice = inventoryPrice[answers.item_id-1];
			//var stuff = answers[answers.item_id].product_name;
		
		
		//requestedQuantity = answers.productQuantity;
   		checkInventory(answers.productQuantity);
  	});
return;
};

queryItemName();  	




