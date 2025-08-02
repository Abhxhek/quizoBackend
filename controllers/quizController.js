import Quiz from "../models/Quiz.js"
import generateMCQsFromTopic from "../utils/generateQuiz.js"

// Get all quizzes
// export const getQuizzes = async (req, res) => {
//   try {
//     const quizzes = await Quiz.find();
//     res.json(quizzes);
//   } catch (error) {
//     res.status(400).json({ message: 'Error fetching quizzes' });
//   }
// };

export const getQuizzes = async (req, res) => {
    try {
        // 1. Get the user ID from the authenticated request
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        // 2. Build the base query to fetch quizzes only for the current user
        const query = { createdBy: userId };

        // 3. Add search functionality by title
        if (req.query.title) {
            // Use a case-insensitive regex to search for the title
            query.title = { $regex: req.query.title, $options: 'i' };
        }

        // 4. Setup pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // 5. Execute the query to get the quizzes for the current page
        const quizzes = await Quiz.find(query)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        // 6. Get the total count of documents matching the query for pagination info
        const totalQuizzes = await Quiz.countDocuments(query);

        // 7. Send the response with quizzes and pagination details
        res.status(200).json({
            message: 'Quizzes fetched successfully',
            data: quizzes,
            totalQuizzes,
            currentPage: page,
            totalPages: Math.ceil(totalQuizzes / limit),
            limit, 
        });

    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ message: 'Server error while fetching quizzes.' });
    }
};

// Create a new quiz
// export const createQuiz = async (req, res) => {
//   const { title, description, questions } = req.body;

//   if (questions.length < 5) {
//     return res.status(400).json({ message: 'A quiz must have at least 5 questions.' });
//   }

//   try {
//     const quiz = new Quiz({
//       title,
//       description,
//       questions,
//       createdBy: req.user.id,
//     });
//     await quiz.save();
//     res.status(201).json(quiz);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating quiz' });
//   }
// };

export const createQuiz = async (req, res) => {
  try {
    // 1. Get topic and user ID
    const { topic } = req.query;
    const userId = req.user.id;

    // 2. Validate input
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required in query parameters.' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // 3. Generate the raw question data
    const generatedData = await generateMCQsFromTopic(topic);
    console.log(generatedData)

    if (!generatedData || generatedData.length === 0) {
      return res.status(404).json({ message: 'Could not generate questions for the given topic.' });
    }

    // 4. **Transform the data to match the new QuizSchema**
    const formattedQuestions = generatedData.map(q => {
      // Find the full text of the correct answer using the answer key (e.g., 'C')
      const correctAnswerText = q.options[q.answer];

      return {
        questionText: q.question,
        // Convert the options object {A:'..', B:'..'} to an array ['..', '..']
        options: Object.values(q.options),
        correctAnswer: correctAnswerText,
      };
    });

    // 5. Create the new Quiz document object
    const newQuiz = {
      title: topic,
      description: `A quiz about ${topic} covering various difficulty levels.`,
      questions: formattedQuestions,
      createdBy: userId,
    };

    // 6. Save the single Quiz document to the database
    const savedQuiz = await Quiz.create(newQuiz);

    // 7. Send the newly created quiz back to the client
    res.status(201).json({
      message: 'Quiz generated and saved successfully!',
      data: savedQuiz,
    });

  } catch (error) {
    console.error('Error in generateQuizController:', error);
    res.status(500).json({ message: 'Server error while generating quiz.' });
  }
};

// Update an existing quiz
export const updateQuiz = async (req, res) => {
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
export const deleteQuiz = async (req, res) => {
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
export const deleteQuestionFromQuiz = async (req, res) => {
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
