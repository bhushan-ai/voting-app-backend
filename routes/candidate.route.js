const express = require("express");
const router = express.Router();

const {
  createCandidate,
  updateCandidate,
  deleteCandidate,
  voteToCandidate,
  getAllCandidate,
  clearAllvotes,
} = require("../controllers/candidateController.js");

const { verifyJWT } = require("../middlewares/authentication");
router.get("/", getAllCandidate);
router.post("/", verifyJWT, createCandidate);
router.put("/:candidateId", verifyJWT, updateCandidate);
router.delete("/:candidateId", verifyJWT, deleteCandidate);
router.post("/vote/:candidateId", verifyJWT, voteToCandidate);
router.post("/clear-votes", verifyJWT, clearAllvotes);
// console.log(typeof createCandidate);
module.exports = router;
