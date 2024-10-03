const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser');

const loginHandler = require("../controller/loginController");
const signupHandler = require("../controller/signupController");

router.route("/register").post(signupHandler);
router.route("/login").post(verifyUser, loginHandler);

module.exports = router;