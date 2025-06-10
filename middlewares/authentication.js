const JWT = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // console.log("Raw header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ msg: "Unauthorized: No or bad token format" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    console.log("Invalid token format:", parts);
  }

  const token = parts[1].trim();
  // console.log("Extracted token:", token);

  try {
    // console.log(" Verifying with secret:", process.env.ACCESS_TOKEN_SECRET);
    const decoded = JWT.verify(token, process.env.SECRET);
    // console.log("Decoded token:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT error:", err);
  }
}

module.exports = { verifyJWT };
