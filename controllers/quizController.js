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

// Create a quiz
exports.createQuiz = async (req, res) => {
  const { title, description, questions } = req.body;
  try {
    const quiz = new Quiz({ title, description, questions, createdBy: req.user.id });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Error creating quiz' });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this quiz' });
    }
    await quiz.remove();
    res.json({ message: 'Quiz removed' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting quiz' });
  }
};
