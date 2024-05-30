const mysqlQuery = require("./connection.js");
const catchAsync = require("../utils/catchAsync.js");
const Seller = function (seller) {
  this.name = seller.name;
  this.email = seller.email;
  this.epassword = seller.epassword;
};

Seller.findByEmail = async (email) => {
  const queryStr = `SELECT * FROM sellers WHERE email = "${email}"`;
  const res = await mysqlQuery(queryStr);
  console.log(res);
  return res;
};

Seller.create = async (newSeller) => {
  console.log(newSeller);
  const queryStr = `INSERT INTO sellers (name, epassword, email) VALUES ("${newSeller.name}", "${newSeller.epassword}", "${newSeller.email}")`;
  //   console.log(queryStr);
  const res = await mysqlQuery(queryStr);
  console.log(res);
  return res;
};

module.exports = Seller;
