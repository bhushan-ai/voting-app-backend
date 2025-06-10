const { Schema, model, mongoose } = require("mongoose");

const candidateSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    party: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    votes: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        votedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    voteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Candidate = model("candidate", candidateSchema);
module.exports = Candidate;
