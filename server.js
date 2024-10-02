const PORT = 3500;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbconfig");
const app = express();
const verifyUser = require('./middleware/verifyUser')

const authRouter = require('./routes/auth.router');
const quizRouter = require('./routes/quiz.router');


app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("hello XD");
});

app.use("/api/auth",authRouter);
app.use("/api/quiz",quizRouter);

mongoose.connection.once("open", () => {
  console.log("Conneted to the database");
  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
