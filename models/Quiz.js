// models/quizModel.js
import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    // The title of the quiz, which will be the topic (e.g., "Java")
    title: {
        type: String,
        required: true,
        trim: true,
    },
    // An optional description for the quiz
    description: {
        type: String,
        trim: true,
    },
    // An array of question objects embedded within the quiz document
    questions: [
        {
            questionText: {
                type: String,
                required: true
            },
            // The options are now an array of strings
            options: [String],
            // The correct answer is the full text of the answer
            correctAnswer: String,
        },
    ],
    // A reference to the user who created the quiz
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assumes your User model is named 'User'
        required: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model('Quiz', QuizSchema);