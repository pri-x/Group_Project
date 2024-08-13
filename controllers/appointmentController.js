const User = require("../models/Users");
const Appointment = require("../models/Appointment");

// Function to create new appointments
const makeAppointment = async (req, res) => {
  const { date, slots } = req.body;

  try {
    // Check if any of the requested slots are already booked
    const availableAppointments = await Appointment.find({
      date,
      time: { $in: slots },
    });

    // Return a message indicating which slots are booked
    if (availableAppointments.length > 0) {
      return res.json({
        success: false,
        message:
          "Some of the selected slots are already added. Please choose different slots.",
      });
    }

    // Create new appointments for the requested slots
    const appointments = slots.map((slot) => ({
      date,
      time: slot,
      isTimeSlotAvailable: true,
    }));

    await Appointment.insertMany(appointments);

    res.json({ success: true, message: "Appointments created successfully." });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message:
        "An error occurred while creating appointments. Please try again later.",
    });
  }
};

// Function to book an existing appointment
const booktheAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  const userId = req.session.userId;

  try {
    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    // Check if the appointment slot is available
    if (!appointment || !appointment.isTimeSlotAvailable) {
      return res.json({
        success: false,
        message:
          "The selected appointment slot is not available. Please choose a different slot.",
      });
    }

    // Mark the appointment slot as booked
    await Appointment.findByIdAndUpdate(appointmentId, {
      isTimeSlotAvailable: false,
    });

    // Update the user's record with the booked appointment
    await User.findByIdAndUpdate(userId, { appointment: appointmentId });

    res.json({
      success: true,
      message: "Your appointment has been booked successfully.",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message:
        "An error occurred while booking your appointment. Please try again later.",
    });
  }
};

// Function to retrieve available appointments for a specific date
const getAppointments = async (req, res) => {
  const { date } = req.query;

  try {
    // Find available appointments for the specified date
    const appointments = await Appointment.find({
      date,
      isTimeSlotAvailable: true,
    });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message:
        "An error occurred while fetching the appointments. Please try again later.",
    });
  }
};

const getBookedAppointments = async (req, res) => {
  const { date } = req.query;

  try {
    // Find available appointments for the specified date
    const appointments = await Appointment.find({
      date,
      isTimeSlotAvailable: false,
    });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message:
        "An error occurred while fetching the appointments. Please try again later.",
    });
  }
};



module.exports = { makeAppointment, booktheAppointment, getAppointments, getBookedAppointments };
