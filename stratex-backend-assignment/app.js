const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
var path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const globalErrorHandler = require("./controllers/errorController");
const authRouter = require("./routes/authRoutes");
const sellerRouter = require("./routes/sellerRoutes");
const buyerRouter = require("./routes/buyerRoutes");
// const bookRouter = require("./routes/bookRoutes");

app.use(cors({ origin: "http://localhost:3000" }));
// console.log("reached line 30");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());

const requestLogger = (req, res, next) => {
  console.log("Request Method: " + req.method);
  console.log("Request Path: " + req.path);
  console.log("Request Body: ");
  console.log(req.body);
  next();
};
app.use(requestLogger);
app.use("/api/v1", authRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/buyer", buyerRouter);
// app.use("/seller", sellerRouter);
// app.use("/book", bookRouter);

app.use(globalErrorHandler);

module.exports = app;
