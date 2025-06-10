const JWT = require("jsonwebtoken");

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
  };

  const token = JWT.sign(payload, process.env.SECRET);

  return token;
}

module.exports = {
  createTokenForUser,
};
