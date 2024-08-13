const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentData = new Schema({
  time: { type: String, required: true },
  date: { type: String, required: true },
  isTimeSlotAvailable: { type: Boolean, default: true },
});

const Appointment = mongoose.model("Appointment", AppointmentData);
module.exports = Appointment;
