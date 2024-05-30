const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Book = require("../models/bookModel");

exports.viewAllBooks = catchAsync(async (req, res, next) => {
  console.log("reached view all books");
  const result = await Book.getAll();
  res.status(200).json({
    status: "Success",
    data: result,
  });
  // console.log(result);
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
  res.status(200).json({
    status: "Success",
    data: result[0],
  });
});
