const Candidate = require("../models/candidate.model.js");
const User = require("../models/user.model.js");

async function checkUserIsAdmin(userId) {
  try {
    const user = await User.findById(userId);
    return user.role === "ADMIN";
  } catch (error) {
    console.log("err in checkuserAdmin", error);
  }
}

async function createCandidate(req, res) {
  try {
    if (!(await checkUserIsAdmin(req.user._id)))
      return res.status(403).json({ msg: "user has not admin role" });

    const { fullname, party, age } = req.body;

    if (!fullname || !party || !age) {
      return res
        .status(400)
        .json({ msg: "fullname , party name and age is required" });
    }

    const candidate = await Candidate.create({
      fullname,
      party,
      age,
    });

    return res.status(201).json({ msg: "candidate created", candidate });
  } catch (error) {
    console.log("internal server error in creating candidate", error);
  }
}

async function updateCandidate(req, res) {
  try {
    if (!(await checkUserIsAdmin(req.user._id)))
      return res.status(403).json({ msg: "user has not admin role" });

    const { fullname, party, age } = req.body;
    const candidateId = req.params.candidateId;

    if (!fullname || !party || !age) {
      return res
        .status(400)
        .json({ msg: "fullname , party name and age is required" });
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      {
        fullname,
        party,
        age,
      },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }
    return res.status(201).json({ msg: "candidate updated", updatedCandidate });
  } catch (error) {
    console.log("internal server error in updating candidate", error);
  }
}

async function deleteCandidate(req, res) {
  try {
    if (!(await checkUserIsAdmin(req.user._id)))
      return res.status(403).json({ msg: "user has not admin role" });

    const candidateId = req.params.candidateId;

    if (!candidateId) {
      return res.status(400).json({ msg: "candidateId is required" });
    }

    const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
    if (!deletedCandidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }
    return res.status(200).json({ msg: "candidate deleted", deletedCandidate });
  } catch (error) {
    console.log("internal server error in deleting candidate", error);
  }
}

async function getAllCandidate(req, res) {
  const candidates = await Candidate.find({});

  return res.status(200).json({ msg: "All candidates fetched", candidates });
}

async function clearAllvotes(req, res) {
  if (!(await checkUserIsAdmin(req.user._id)))
    return res.status(403).json({ msg: "user has not admin role" });

  await Candidate.updateMany({}, { voteCount: 0, votes: [] });
  await User.updateMany({}, { isVoted: false });

  //await Candidate.updateMany({}, { voteCount: 0, votes: [] });

  const allCandidates = await Candidate.find(
    {},
    "fullname party age voteCount votes"
  );
  return res.status(200).json({
    msg: "All votes have been reset to 0",

    candidates: allCandidates,
  });
}

async function voteToCandidate(req, res) {
  //user can vote only once
  //admin cant vote
  const userId = req.user._id;
  const candidateId = req.params.candidateId;

  try {
    if (!userId) return res.status(400).json({ msg: "userID not found" });
    if (!candidateId)
      return res.status(400).json({ msg: "candidateId not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: "user not found" });

    if (user.role === "ADMIN")
      return res.status(403).json({ msg: "Admins cannot vote" });
    if (user.isVoted)
      return res.status(400).json({ msg: "You have already voted" });

    // console.log("Updating candidate votes");

    const updateResult = await Candidate.updateOne(
      { _id: candidateId, "votes.user": { $ne: userId } },
      { $inc: { voteCount: 1 }, $push: { votes: { user: userId } } }
    );
    // console.log("Update result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      return res
        .status(400)
        .json({ msg: "Duplicate vote detected or candidate not found" });
    }

    // console.log("Updating user vote status with updateOne...");

    await User.updateOne({ _id: userId }, { $set: { isVoted: true } });

    // console.log("User update result:", userUpdateResult);

    // console.log("Fetching updated candidate");
    const updatedCandidate = await Candidate.findById(candidateId);
    if (!updatedCandidate) {
      return res.status(400).json({ msg: "Candidate not found after update" });
    }

    // console.log("Vote recorded successfully");
    return res.status(200).json({
      msg: "Vote recorded",
      VotedFor: updatedCandidate._id,
      candidateName: updatedCandidate.fullname,
      candidateParty: updatedCandidate.party,
      totalVotes: updatedCandidate.voteCount,
    });
  } catch (error) {
    console.log("Internal server error in updating candidate", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

module.exports = {
  createCandidate,
  updateCandidate,
  deleteCandidate,
  voteToCandidate,
  getAllCandidate,
  clearAllvotes,
};
