const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/buyerController");
const authController = require("../controllers/authController");
router.use(authController.verifyJwtToken);

router.use(authController.restrictTo("buyer"));

router.route("/books").get(buyerController.viewAllBooks);
router.route("/book/:bookId").get(buyerController.getBookByBookId);
// router.route("logout").get(autoController.logout);
module.exports = router;
