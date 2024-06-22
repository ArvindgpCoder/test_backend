const jwt = require("jsonwebtoken");
const verifyToken = (token) => {
  return jwt.verify(token, "sdsdasdc");
};
const AuthMiddleware = async(req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

module.exports = AuthMiddleware;
