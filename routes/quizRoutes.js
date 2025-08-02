
import express from "express"
import { getQuizzes, createQuiz, deleteQuiz, updateQuiz, deleteQuestionFromQuiz } from "../controllers/quizController.js"
import { protect } from "../middleware/authMiddelware.js";

const router = express.Router();

router.get("/getQuiz",protect, getQuizzes);
router.post("/createQuiz", protect, createQuiz);
router.put("/:id", protect, updateQuiz); // Update quiz
router.delete("/:id", protect, deleteQuiz); // Ensure this route is correctly set up
router.delete("/:quizId/question/:questionId", protect, deleteQuestionFromQuiz); // Delete a question from a quiz

export default router;