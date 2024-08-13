const User = require("../models/Users");

// Render the dashboard page
const dashboard = async (req, res) => {
  try {
    // Fetch the user from the database using the user ID from the session
    const user = await User.findById(req.session.userId) ?? null;

    // Render the dashboard page with user data
    res.render("index", { user });
  } catch (error) {
    // Handle errors that occur during user retrieval
    console.error("Error while fetching user data for dashboard:", error);
    res.render("index", { user: null, error: "Error while fetching user data" });
  }
};

// Render the appointment page
const appointment = async (req, res) => {
  try {
    // Fetch the user from the database using the user ID from the session
    const user = await User.findById(req.session.userId) ?? null;

    // Render the appointment page with user data from session
    res.render("appointment", { user: req.session.user });
  } catch (error) {
    // Handle errors that occur during user retrieval
    console.error("Error while fetching user data for appointment:", error);
    res.render("appointment", { user: null, error: "Error while fetching user data" });
  }
};

// Render the g2 page
const g2 = async (req, res) => {
  try {
    // Fetch the user from the database using the user ID from the session
    const user = await User.findById(req.session.userId);
    if (!user) {
      // If user is not found, render the g2 page with an error message
      return res.render("g2", {
        user: null,
        success: null,
        error: "User is not found!!",
      });
    }

    // Render the g2 page with user data
    res.render("g2", { user, error: null, success: null });
  } catch (error) {
    // Handle errors that occur during user retrieval
    console.error("Error while fetching user data for g2 page:", error);
    res.render("g2", {
      user: null,
      success: null,
      error: "Error while fetching user data",
    });
  }
};

// Render the g page
const g = async (req, res) => {
  try {
    // Fetch the user from the database using the user ID from the session
    const user = await User.findById(req.session.userId);
    if (!user) {
      // If user is not found, render the g page with an error message
      return res.render("g", { user: null, error: "User is not found!!" });
    }

    // Render the g page with user data
    res.render("g", { user, error: null });
  } catch (err) {
    // Handle errors that occur during user retrieval
    console.error("Error while fetching user data for g page:", err);
    res.render("g", { user: null, error: "Error while fetching user data" });
  }
};

const examiner = async (req, res) => {
  try {
    // Fetch the user from the database using the user ID from the session
    const user = await User.findById(req.session.userId);
    if (!user) {
      // If user is not found, render the g page with an error message
      return res.render("examiner", { user: null, error: "User is not found!!" });
    }

    // Render the g page with user data
    res.render("examiner", { user, error: null });
  } catch (err) {
    // Handle errors that occur during user retrieval
    console.error("Error while fetching user data for g page:", err);
    res.render("examiner", { user: null, error: "Error while fetching user data" });
  }
};

module.exports = { dashboard, g, g2, appointment, examiner };
