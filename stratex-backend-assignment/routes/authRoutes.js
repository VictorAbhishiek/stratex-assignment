const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/login").post(authController.login);
router.route("/signup").post(authController.signup);
// router.route("logout").get(autoController.logout);
module.exports = router;
