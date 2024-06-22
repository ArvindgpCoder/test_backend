const express = require("express");
const router = express.Router();
const authController = require("./AuthController.jsx");
const User = require("./UserModel.jsx");
const jwt=require('jsonwebtoken')
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/logout", authController.logout); // Add logout route
router.post("/verifytoken", async (req, res) => {
  const token = req.body.token;
  if (!token)
    return res.status(400).send({ valid: false, message: "No token provided" });

  try {
    const verified = jwt.verify(token, "sdsdasdc");
    const user = await User.findById(verified._id);
    if (!user)
      return res.status(404).send({ valid: false, message: "User not found" });

    res.send({ valid: true });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(500).send({ valid: false, message: "Internal server error" });
  }
});
module.exports = router;
