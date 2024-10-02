const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [
    {
      questionText: { type: String, required: true },
      options: [String],
      correctAnswer: String,
    },
  ],
});

module.exports = mongoose.model('Quiz',quizSchema);