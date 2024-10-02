const express = require("express");
const Quiz = require("../models/quiz.model");

const createQuizHandler = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.json({ message: "Quiz added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "error.message" });
  }
};

const deleteQuizHandler = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllQuizHandler = async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    quizzes ? res.json(quizzes) : res.json({ message: "No item found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createQuizHandler, deleteQuizHandler, getAllQuizHandler };
