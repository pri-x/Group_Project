const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// User Collection
const UserData = new Schema({
  firstname: { type: String, default: "default" },
  lastname: { type: String, default: "default" },
  licensenumber: { type: String, default: "default" },
  age: { type: Number, default: 0 },
  username: { type: String, unique: true },
  password: { type: String },
  userType: { type: String, default: "Driver" },
  cardata: {
    make: { type: String, default: "default" },
    model: { type: String, default: "default" },
    year: { type: Number, default: 0 },
    platenumber: { type: String, default: "default" },
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    default: null,
  },
  testType: String,
  comments: String,
  testResult: String,
});

UserData.pre("save", async function (next) {
  const user = this;
  // Encrypting Password and licensenumber
  try {
    if (user.isModified("password")) {
      user.password = bcrypt.hash(user.password, 10);
    }

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const User = mongoose.model("User", UserData);

module.exports = User;
