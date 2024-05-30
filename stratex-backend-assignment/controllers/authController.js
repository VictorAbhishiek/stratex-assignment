const jwt = require("jsonwebtoken");
const validator = require("validator");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Seller = require("../models/sellerModel.js");
const Buyer = require("../models/buyerModel.js");

const createToken = (username, role) => {
  const jwtToken = jwt.sign({ username, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return jwtToken;
};

const createSendToken = (user, statusCode, res) => {
  try {
    const token = createToken(user.username, user.role);
    console.log(user);
    console.log(token);
    const expireAt = new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    );
    const cookieOptions = {
      expires: expireAt,
      httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    res.cookie("jwt", token, cookieOptions);
    console.log("success");
    res.status(statusCode).json({
      status: "Success",
      verification: true,
      user,
      expireAt,
      token,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.logout = catchAsync(async (req, res, next) => {
  var token;
  if (req.cookies.jwt) token = req.cookies.jwt;
  const expireAt = new Date(Date.now() + 10);
  const cookieOptions = {
    expires: expireAt,
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

const getEncryptedPassword = async (password) => {
  const epassword = await bcrypt.hash(password, 12);
  return epassword;
};

const compareEncryptedPasswords = async (epass1, epass2) => {
  const result = await bcrypt.compare(epass1, epass2);
  return result;
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (!validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email", 403));
  }
  if (role === "seller") {
    const result = await Seller.findByEmail(email);
    //   console.log("in line 75");
    if (result.length == 1) {
      return next(new AppError("Email-id already registered", 403));
      console.log("reached here");
    }
    if (password !== confirmPassword) {
      return next(
        new AppError("Password does not match the confirmed password", 403)
      );
    }
    //   console.log(Seller);
    const epassword = await getEncryptedPassword(password);
    //   console.log("encrypted password");
    const newSeller = new Seller({
      name: name,
      email: email,
      epassword: epassword,
    });
    console.log(newSeller);
    const result2 = await Seller.create(newSeller);
    res.status(200).json({
      status: "Success",
      message: "New Seller added to the database",
    });
  } else if (role === "buyer") {
    const result = await Buyer.findByEmail(email);
    //   console.log("in line 75");
    if (result.length == 1) {
      return next(new AppError("Email-id already registered", 403));
    }
    if (password !== confirmPassword) {
      return next(
        new AppError("Password does not match the confirmed password", 403)
      );
    }
    //   console.log(Seller);
    const epassword = await getEncryptedPassword(password);
    //   console.log("encrypted password");
    const newBuyer = new Buyer({
      name: name,
      email: email,
      epassword: epassword,
    });
    //   console.log(newSeller);
    const result2 = await Buyer.create(newBuyer);
    res.status(200).json({
      status: "Success",
      message: "New Buyer added to the database",
    });
  } else {
    return next(new AppError("Invalid role provided", 403));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password, role } = req.body;
  if (!validator.isEmail(username)) {
    return next(new AppError("Please provide a valid email", 403));
  }
  let result;
  if (role === "seller") {
    result = await Seller.findByEmail(username);
  } else if (role === "buyer") {
    result = await Buyer.findByEmail(username);
  } else {
    return next(new AppError("Role provided is invalid", 403));
  }
  if (result.length === 0) {
    return next(new AppError("Invalid username", 403));
  }
  const data = result[0];
  const encryptedEnteredPassword = await getEncryptedPassword(password);
  //   console.log("encrypted entered password");
  //   console.log(sellerData.epassword !== encryptedEnteredPassword);
  //   console.log(encryptedEnteredPassword);
  if (!compareEncryptedPasswords(data.epassword, encryptedEnteredPassword)) {
    return next(new AppError("Incorrect password", 403));
  }
  //   console.log("password entered is correct");
  const user = { username: username, role: role };
  createSendToken(user, 200, res);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      console.log(roles, req.user.role);
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.verifyJwtToken = async (req, res, next) => {
  try {
    // 1) Getting token and check ff it's there
    var token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // console.log(token);
    if (!token) {
      throw "Token not present";
    }

    // 2) Verifying token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    const username = decoded.username;
    const role = decoded.role;
    console.log(username, role);
    let result = [];
    if (role === "seller") {
      result = await Seller.findByEmail(username);
    } else if (role === "buyer") {
      result = await Buyer.findByEmail(username);
    }
    // console.log(result);
    if (result.length == 0) {
      throw "Invalid Token";
    } else {
      req.user = result[0];
      req.user.role = role;
      console.log("hello");
      next();
    }
  } catch (err) {
    res.status(404).send(err);
  }
};
