const mysqlQuery = require("./connection.js");
const catchAsync = require("../utils/catchAsync.js");
const Buyer = function (buyer) {
  this.name = buyer.name;
  this.email = buyer.email;
  this.epassword = buyer.epassword;
};

Buyer.findByEmail = async (email) => {
  const queryStr = `SELECT * FROM buyers WHERE email = "${email}"`;
  const res = await mysqlQuery(queryStr);
  console.log(res);
  return res;
};

Buyer.create = async (newBuyer) => {
  console.log(newBuyer);
  const queryStr = `INSERT INTO buyers (name, epassword, email) VALUES ("${newBuyer.name}", "${newBuyer.epassword}", "${newBuyer.email}")`;
  //   console.log(queryStr);
  const res = await mysqlQuery(queryStr);
  console.log(res);
  return res;
};

module.exports = Buyer;
