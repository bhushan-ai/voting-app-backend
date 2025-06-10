const User = require("../models/user.model");
const { createHmac, randomBytes } = require("crypto");


async function isPasswordCorrect(userId, plainPassword) {
  const user = await User.findById(userId);
  if (!user) return false;

  const hash = createHmac("sha256", user.salt)
    .update(plainPassword)
    .digest("hex");

  return hash === user.password;
}
async function signUp(req, res) {
  const { fullname, email, age, password, address, adharno, role } = req.body;
  if (
    [fullname, password, email, age, address, adharno].some(
      (field) => field?.trim() === ""
    )
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const adminExist = await User.findOne({ role: "ADMIN" });
  if (role === "ADMIN" && adminExist) {
    return res.status(403).json({ msg: "there can be only one admin" });
  }

  try {
    const newUser = await User.create({
      fullname,
      email,
      password,
      age,
      address,
      adharno,
      role,
    });
    return res.status(201).json({ msg: "user signUp", newUser });
  } catch (error) {
    console.log("error", error);
    return res
      .status(404)
      .json({ msg: "something went wrong while creating user" });
  }
}

async function signIn(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "email and password is required" });
  }
  try {
    const token = await User.matchedPasswordAndCreateToken(email, password);
    return res.status(200).json({ msg: "user signIn token", token });
  } catch (error) {
    console.log("error", error);
    return res.status(404).json({ msg: "something went wrong" });
  }
}

async function updatePassword(req, res) {
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ msg: "Both passwords are required" });
  }

  const isCorrect = await isPasswordCorrect(userId, oldPassword);
  if (!isCorrect) {
    return res.status(400).json({ msg: "Old password is incorrect" });
  }

  const user = await User.findById(userId);
  user.password = newPassword; 
  await user.save();

  return res.status(200).json({ msg: "Password updated successfully" });
}

async function updateUser(req, res) {
  const userId = req.params.userId;
  const { email, address } = req.body;
  if (!email || !address) {
    return res.status(400).json({ msg: "email and password is required" });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, address },
      { new: true }
    );

    return res.status(200).json({ msg: "user details updated", updatedUser });
  } catch (error) {
    console.log("error", error);
    return res.status(404).json({ msg: "something went wrong" });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    return res.status(200).json({ msg: "candidate deleted", deletedUser });
  } catch (error) {
    console.log("internal server error in deleting candidate", error);
  }
}

async function allVoters(req, res) {
  const allVoters = await User.find({});
  return res.status(200).json({ msg: "All voters fetched", allVoters });
}
module.exports = {
  signUp,
  signIn,
  deleteUser,
  updateUser,
  allVoters,
  updatePassword,
};
