const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [
    {
      questionText: { type: String, required: true },
      options: [String],
      correctAnswer: String,
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Quiz', QuizSchema);
