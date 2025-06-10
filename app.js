const express = require("express");
const app = express();

//middlewwares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//import routes
const userRouter = require("./routes/user.route.js");
const candidateRouter = require("./routes/candidate.route.js");
const voteCountRouter = require("./routes/voteCount.route.js")

app.use("/user", userRouter);
app.use("/candidate", candidateRouter);
app.use("/vote-count", voteCountRouter);

module.exports = app;
