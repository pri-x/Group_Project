const bcrypt = require("bcrypt");
const User = require("../models/Users");

// Render Signup Page
const gettingSignup = (req, res) => {
  res.render("signup", { user: null, error: null });
};

// Signup User
const signupInUser = async (req, res) => {
  const { username, password, repeatedPassword, userType } = req.body;

  // Check if passwords match
  if (password !== repeatedPassword) {
    return res.render("signup", {
      user: null,
      error: "Passwords don't match",
    });
  }

  try {
    // Check if the username is already taken
    const availableUser = await User.findOne({ username });
    if (availableUser) {
      return res.render("signup", {
        user: null,
        error: "Username already exists",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newestUser = new User({
      username,
      password: hashedPassword,
      userType,
    });

    await newestUser.save();
    res.render("login", { user: null, error: null });
  } catch (error) {
    console.error("Error while creating user:", error);
    res.render("signup", { user: null, error: "Error while creating user" });
  }
};

// Render Login Page
const gettingLogin = (req, res) => {
  res.render("login", { user: null, error: null });
};

// Login User
const loginInUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    // If user is not found, return an error
    if (!user) {
      return res.render("login", {
        user: null,
        error: "Invalid username or password",
      });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);

    // If password does not match, return an error
    if (!isMatch) {
      return res.render("login", {
        user: null,
        error: "Invalid username or password",
      });
    }

    // Store user data in session
    req.session.userId = user._id;
    req.session.userType = user.userType;

    res.redirect("/");
  } catch (error) {
    console.error("Error while logging in:", error);
    res.render("login", { user: null, error: "Error while logging in" });
  }
};

// Logout User
const loggingoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};

module.exports = { gettingLogin, signupInUser, loginInUser, gettingSignup, loggingoutUser };
