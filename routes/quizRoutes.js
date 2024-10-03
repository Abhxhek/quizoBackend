const express = require('express');
const {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  deleteQuestionFromQuiz,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getQuizzes);
router.post('/', protect, createQuiz);
router.put('/:id', protect, updateQuiz); // Update quiz
router.delete('/:id', protect, deleteQuiz); // Delete quiz
router.delete('/:quizId/question/:questionId', protect, deleteQuestionFromQuiz); // Delete a question from a quiz

module.exports = router;
