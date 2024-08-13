const User = require("../models/Users");
const Appointment = require("../models/Appointment");

const g2Info = async (req, res) => {
  const usercheck = (input) => {
    let errorMessages = [];
    if (
      !input.firstname ||
      !input.lastname ||
      !input.age ||
      !input.licensenumber ||
      !input.make ||
      !input.model ||
      !input.year ||
      !input.platenumber
    ) {
      errorMessages.push("Please fill in all fields.");
    }
    if (input.licensenumber.length !== 8) {
      errorMessages.push("License number must be exactly 8 characters long.");
    }
    return errorMessages;
  };

  try {
    const userId = req.session.userId;

    const {
      firstname,
      lastname,
      age,
      licensenumber,
      make,
      model,
      year,
      platenumber,
      appointmentId,
    } = req.body;

    // Validate input
    const errorMessages = usercheck(req.body);
    if (errorMessages.length > 0) {
      const user = await User.findById(userId);
      return res.render("g2", {
        error: errorMessages.join(" "),
        success: null,
        user: user,
      });
    }

    // Check if user already exists by userId
    let user = await User.findById(userId);
    if (!user) {
      return res.render("login", {
        user: null,
        error: "User not found. Please log in again.",
      });
    }

    // Update user data with new G2 information
    user.firstname = firstname;
    user.lastname = lastname;
    user.age = age;
    user.licensenumber = licensenumber;
    user.cardata = {
      make,
      model,
      year,
      platenumber,
    };
    user.testType = "g2";

    // Book appointment
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment || !appointment.isTimeSlotAvailable) {
        return res.render("g2", {
          error:
            "The selected appointment slot is not available. Please choose a different slot.",
          success: null,
          user: user,
        });
      }
      appointment.isTimeSlotAvailable = false;
      await appointment.save();
      user.appointment = appointmentId;
    }

    await user.save();

    res.render("g2", {
      user,
      success:
        "Your information has been successfully updated, and your appointment has been booked.",
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.render("g2", {
      success: null,
      error:
        "An error occurred while updating your information. Please try again later.",
    });
  }
};

const gInfo = async (req, res) => {
  try {
    const { licensenumber, make, model, year, platenumber, appointmentId } = req.body;

    if (
      !licensenumber ||
      !make ||
      !model ||
      !year ||
      !platenumber ||
      licensenumber.length !== 8
    ) {
      return res.render("g", {
        user: null,
        error:
          "All fields are required, and the license number must be exactly 8 characters long.",
      });
    }

    // Find the user by license number
    const user = await User.findOne({ licensenumber });

    if (user) {
      // Update the car data in the user collection
      user.cardata = { make, model, year, platenumber };
      user.testType = "g";

      // Book appointment
      if (appointmentId) {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment || !appointment.isTimeSlotAvailable) {
          return res.render("g", {
            error:
              "The selected appointment slot is not available. Please choose a different slot.",
            success: null,
            user: user,
          });
        }
        appointment.isTimeSlotAvailable = false;
        await appointment.save();
        user.appointment = appointmentId;
      }

      await user.save();

      res.render("g", {
        user: user,
        success: "Car information updated successfully.",
        error: null,
      });
    } else {
      res.render("g", {
        user: null,
        error: "User not found with the provided license number.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send(
        "An error occurred while updating car information. Please try again later."
      );
  }
};

var ObjectId = require('mongoose').Types.ObjectId;
const getDriverInfo = async (req, res) => {
  try {
    const { appointmentId } = req.query;

    // Find the user by license number
    const user = await User.findOne({ appointment: new ObjectId(appointmentId) });
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message:
        "No user found.",
    });
  }
};

const addTestResult = async (req, res) => {
  try {
    const { bookedAppointmentId, comment, testResult } = req.body;
    // Find the user by license number
    const user = await User.findOne({ appointment: new ObjectId(bookedAppointmentId) });

    if (user) {
      // Update the test result in the user collection
      user.comments = comment;
      user.testResult = testResult;

      await user.save();
      const currentuser = await User.findById(req.session.userId);
      //res.json({ success: true, user });
      res.render("successmessage",{ user:currentuser, });
    } else {
      res.json({
        success: false,
        message:
          "No user found.",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message:
        "No user found.",
    });
  }
};

const testStatus= async (req, res) => {
  const testResult = await User.find({ testResult: {$exists: true,  },
  });

    const user = await User.findById(req.session.userId);
  res.render("results", {pageTitle: "Test Results", testresults: testResult, user:user, });
}; 

const gtesttakers = async (req, res) => {
  const userData = await User.find({
    appointment: {$exists: true, },
    testType:{$regex:/g/i},
    testResult:{$exists:false},
  });

  let selectedUser = null;
  if (req.query.userId) {
    selectedUser = await User.findById(req.query.userId);
  }
  //get current loged in user data
  const user = await User.findById(req.session.userId);

  res.render("gtesttakers", { pageTitle: "Test Takers", testtakers: userData, userselected: selectedUser, user:user,
  });
};

module.exports = { g2Info, gInfo, getDriverInfo, addTestResult,testStatus,gtesttakers };
