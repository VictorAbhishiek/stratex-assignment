const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const csv = require("csv-parser");
const fs = require("fs");
const Book = require("../models/bookModel");

exports.addBook = catchAsync(async (req, res, next) => {
  console.log("reached add book");
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const results = [];

  // Read the uploaded CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      console.log(results);
      // Insert data into the books table
      //   const query = "INSERT INTO books (title, publishedDate, author) VALUES ?";

      results.map(async (row) => {
        const newBook = new Book({
          title: row.title,
          publishedDate: row.publishedDate,
          sellerId: req.user.seller_id,
          price: row.price,
          author: row.author,
        });
        const result = await Book.create(newBook);
      });

      fs.unlinkSync(req.file.path);

      res.status(200).send({
        status: "Success",
        message: "Books added to the database",
      });

      //   db.query(query, [values], (err, _) => {
      //     if (err) {
      //       console.error("Error inserting data:", err);
      //       return res.status(500).send("Error inserting data.");
      //     }
      //     // Delete the uploaded file after insertion

      //   });
    });
});

exports.getBooksBySellerId = catchAsync(async (req, res, next) => {
  const sellerId = req.user.seller_id;
  const result = await Book.findBySellerId(sellerId);
  res.status(200).json({
    status: "Success",
    data: result,
  });
});

exports.verifyBookBelongsToSeller = catchAsync(async (req, res, next) => {
  console.log("hala");
  console.log(req.params);
  const bookId = req.params.bookId;
  const result = await Book.findByBookId(bookId);
  if (result.length === 0) {
    res.status(200).json({
      status: "Success",
      message: `Book with book id ${bookId} does not exist`,
    });
  }
  if (result[0].seller_id !== req.user.seller_id) {
    res.status(403).json({
      status: "Success",
      message: `You are not permitted to view the book with book id ${bookId}`,
    });
  }
  next();
});

exports.getBookByBookId = catchAsync(async (req, res, next) => {
  const bookId = req.params.bookId;
  const result = await Book.findByBookId(bookId);
  if (result.length === 0) {
    res.status(200).json({
      status: "Success",
      message: `Book with book id ${bookId} does not exist`,
    });
  }
  if (result[0].seller_id !== req.user.seller_id) {
    res.status(403).json({
      status: "Success",
      message: `You are not permitted to view the book with book id ${bookId}`,
    });
  }
  res.status(200).json({
    status: "Success",
    data: result[0],
  });
});

exports.modifyBookByBookId = catchAsync(async (req, res, next) => {
  const bookId = req.params.bookId;
  const { title, author, publishedDate, price } = req.body;
  const updatedBook = new Book({
    title: title,
    author: author,
    publishedDate: publishedDate,
    price: price,
    sellerId: req.user.seller_id,
  });
  const result = await Book.updateByBookId(updatedBook, bookId);
  res.status(200).json({
    status: "Success",
    message: `Book with book id ${bookId} was updated successfully.`,
  });
});

exports.deleteBookByBookId = catchAsync(async (req, res, next) => {
  const bookId = req.params.bookId;
  const result = await Book.deleteByBookId(bookId);
  res.status(200).json({
    status: "Success",
    message: `Book with book id ${bookId} was deleted successfully.`,
  });
});

exports.addSingleBook = catchAsync(async (req, res, next) => {
  const { title, author, publishedDate, price } = req.body;
  const newBook = new Book({
    title: title,
    author: author,
    publishedDate: publishedDate,
    price: price,
    sellerId: req.user.seller_id,
  });
  const result = await Book.create(newBook);
  res.status(200).json({
    status: "Success",
    message: `Book was created successfully.`,
  });
});
