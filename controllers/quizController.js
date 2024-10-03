const Quiz = require('../models/Quiz');

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching quizzes' });
  }
};

// Create a new quiz
exports.createQuiz = async (req, res) => {
  const { title, description, questions } = req.body;

  if (questions.length < 5) {
    return res.status(400).json({ message: 'A quiz must have at least 5 questions.' });
  }

  try {
    const quiz = new Quiz({
      title,
      description,
      questions,
      createdBy: req.user.id,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Error creating quiz' });
  }
};

// Update an existing quiz
exports.updateQuiz = async (req, res) => {
  const { title, description, questions } = req.body;

  if (questions.length < 5) {
    return res.status(400).json({ message: 'A quiz must have at least 5 questions.' });
  }

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.questions = questions || quiz.questions;

    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Error updating quiz' });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    await quiz.remove();
    res.json({ message: 'Quiz removed' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting quiz' });
  }
};

// Delete a question from a quiz
exports.deleteQuestionFromQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    quiz.questions = quiz.questions.filter(q => q._id.toString() !== req.params.questionId);
    await quiz.save();
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting question' });
  }
};
