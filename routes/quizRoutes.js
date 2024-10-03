const express = require('express');
const { getQuizzes, createQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddelware');
const router = express.Router();

router.get('/', getQuizzes);
router.post('/', protect, createQuiz);
router.delete('/:id', protect, deleteQuiz);

module.exports = router;
