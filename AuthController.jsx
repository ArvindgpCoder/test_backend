const User = require("./UserModel.jsx");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, "sdsdasdc", { expiresIn: "1h" });
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Signup request body:", req.body);

  try {
    // Check if email already exists
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      console.log("Email already exists:", email);
      return res.status(400).send("Email Already Exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Create a new user
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    console.log("Saved user:", savedUser);

    // Respond with the saved user (excluding password for security reasons)
    res.status(200).send("yeah signup done");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Server error");
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Signin request body:", req.body);

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("Invalid user:", email);
      return res.status(401).send("Invalid user");
    }

    console.log("User found:", user);

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for user:", email);
      return res.status(401).send("Invalid password");
    }

    console.log("Password valid:", validPassword);

    // Generate a JWT token
    const token = generateToken(user._id);
    console.log("Generated token for user:", email, token);

    // Respond with the token
    res.header("auth-token", token).json({ token });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).send("Server error");
  }
};
const logout = async (req, res) => {
  try {
    // For JWT tokens, there's no built-in server-side storage,
    // so a common approach is to do nothing more than clear the client-side token.
    // In this case, simply respond with a success message.
    console.log("logout requested");
    res.status(200).send("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Server error");
  }
};

const verifytoken = (token) => {
  console.log("ye beta aya gaand marvane");
  console.log(typeof jwt  );
  console.log(typeof token  );
  console.log(typeof token  );
  console.log(typeof token  );
  console.log(typeof token  );
  const decoded = jwt.verify(token, "sdsdasdc");
  console.log(decoded);
  return decoded;
};

module.exports = { signup, signin, logout, verifytoken };
