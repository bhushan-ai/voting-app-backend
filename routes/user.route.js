const express = require("express");
const router = express.Router();

const {
  signUp,
  signIn,
  updateUser,
  deleteUser,
  allVoters,
  updatePassword,
} = require("../controllers/user.controller.js");
const { verifyJWT } = require("../middlewares/authentication.js");

//get
router.get("/all-voters", allVoters);
//post
router.post("/signup", signUp);
router.post("/signin", signIn);
router.patch("/update-info/:userId", updateUser);
router.delete("/delete/:userId", deleteUser);
router.patch("/change-password", verifyJWT, updatePassword);

module.exports = router;
