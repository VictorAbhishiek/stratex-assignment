require("dotenv").config();
const mysql = require("mysql2");
var conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: {
  //   rejectUnauthorized: true,
  // },
});

conn.connect((err) => {
  if (err) {
    console.log(err + "---");
  } else {
    console.log("Connected to mysql database");
  }
});

const mysqlQuery = (query) => {
  return new Promise((resolve, reject) => {
    conn.query(query, (err, result, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const createTables = async () => {
  const createSellersTableQuery = `CREATE TABLE IF NOT EXISTS sellers (
        seller_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        epassword VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE
    );`;
  const res1 = await mysqlQuery(createSellersTableQuery);
  const createBooksTableQuery = `CREATE TABLE IF NOT EXISTS books_v1 (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publishedDate DATE NOT NULL,
    author VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    seller_id INT,
    FOREIGN KEY (seller_id) REFERENCES sellers(seller_id)
  );`;
  const res2 = await mysqlQuery(createBooksTableQuery);
  const createBuyersTableQuery = `CREATE TABLE IF NOT EXISTS buyers (
      buyer_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      epassword VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE
  );`;
  const res3 = await mysqlQuery(createBuyersTableQuery);
};

createTables();

module.exports = mysqlQuery;
