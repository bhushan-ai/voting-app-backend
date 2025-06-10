const express = require("express");
const Candidate = require("../models/candidate.model");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const candidateVotes = await Candidate.find().sort({ voteCount: "desc" });

    const voteRecord = candidateVotes.map((data) => {
      return {
        Candidate: data.fullname,
        CandidateParty: data.party,
        votes: data.voteCount,
      };
    });
    // const data = candidateVotes.populate("fullname", "party age");
    return res.status(200).json(voteRecord);
  } catch (error) {
    console.log("error", error);
    return res.status(404).json({ msg: "error in voteCount", error });
  }
});

module.exports = router;
