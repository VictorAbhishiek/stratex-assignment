const mysqlQuery = require("./connection.js");
const catchAsync = require("../utils/catchAsync.js");
const Book = function (book) {
  this.title = book.title;
  this.author = book.author;
  this.publishedDate = book.publishedDate;
  this.price = book.price;
  this.sellerId = book.sellerId;
};

Book.findByBookId = async (bookId) => {
  const queryStr = `SELECT * FROM books_v1 WHERE book_id = ${bookId}`;
  console.log(queryStr);
  const res = await mysqlQuery(queryStr);
  console.log(res);
  return res;
};

Book.findBySellerId = async (sellerId) => {
  const queryStr = `SELECT * FROM books_v1 WHERE seller_id = ${sellerId}`;
  const res = await mysqlQuery(queryStr);
  console.log(res);
  return res;
};

Book.create = async (newBook) => {
  //   console.log(newSeller);
  const queryStr = `INSERT INTO books_v1 (title, author, publishedDate, price, seller_id) VALUES ("${newBook.title}", "${newBook.author}", "${newBook.publishedDate}", "${newBook.price}", "${newBook.sellerId}")`;
  //   console.log(queryStr);
  const res = await mysqlQuery(queryStr);
  //   console.log(res);
  return res;
};

Book.getAll = async () => {
  const queryStr = `SELECT * FROM books_v1`;
  const res = await mysqlQuery(queryStr);
  console.log(res);
  return res;
};

Book.updateByBookId = async (updatedBook, bookId) => {
  const queryStr = `UPDATE books_v1 SET title = "${updatedBook.title}", author = "${updatedBook.author}", publishedDate = "${updatedBook.publishedDate}", price = ${updatedBook.price} WHERE book_id = ${bookId}`;
  console.log(queryStr);
  const res = await mysqlQuery(queryStr);
  console.log(res);
  return res;
};

Book.deleteByBookId = async (bookId) => {
  const queryStr = `DELETE FROM books_v1 WHERE book_id = ${bookId}`;
  console.log(queryStr);
  const res = await mysqlQuery(queryStr);
  console.log(res);
  return res;
};

module.exports = Book;
