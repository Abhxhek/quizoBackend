const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");
const quizController = require("../controller/quizController");

const { createQuizHandler, deleteQuizHandler, getAllQuizHandler } =
  quizController;

router.route("/").post(createQuizHandler);

router.route("/:id").delete(deleteQuizHandler)

router.route("/").get(getAllQuizHandler);

module.exports = router;