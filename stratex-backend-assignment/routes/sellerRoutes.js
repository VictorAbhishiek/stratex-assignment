const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const authController = require("../controllers/authController");
router.use(authController.verifyJwtToken);

router.use(authController.restrictTo("seller"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });
router
  .route("/books")
  .get(sellerController.getBooksBySellerId)
  .post(uploadStorage.single("file"), sellerController.addBook);

router.post("/add-book", sellerController.addSingleBook);

router
  .route("/book/:bookId")
  .get(
    sellerController.verifyBookBelongsToSeller,
    sellerController.getBookByBookId
  )
  .patch(
    sellerController.verifyBookBelongsToSeller,
    sellerController.modifyBookByBookId
  )
  .delete(
    sellerController.verifyBookBelongsToSeller,
    sellerController.deleteBookByBookId
  );
// router.route("logout").get(autoController.logout);
module.exports = router;
