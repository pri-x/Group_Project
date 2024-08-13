const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const dotenv = require("dotenv");
const session = require("express-session");
const userController = require("./controllers/userController");
const authController = require("./controllers/authController");
const appointmentController = require("./controllers/appointmentController");
const routepagesController = require("./controllers/routepagesController");
const { istheDriver, istheAdmin, istheExaminer } = require("./middleware/authMiddleware");

dotenv.config();

// Used Ejs template and public folder
const app = new express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Page routes
app.get("/", routepagesController.dashboard);
app.get("/g", istheDriver, routepagesController.g);
app.get("/g2", istheDriver, routepagesController.g2);
app.get("/signup", authController.gettingSignup);
app.get("/login", authController.gettingLogin);
app.get("/logout", authController.loggingoutUser);

// handle signup and login
app.post("/signup", authController.signupInUser);
app.post("/login", authController.loginInUser);

app.post("/g2-appointment", istheDriver, userController.g2Info);
app.post("/g-appointment", istheDriver, userController.gInfo);

app.post("/appointments", istheAdmin, appointmentController.makeAppointment);
app.get("/appointment", istheAdmin, routepagesController.appointment);
app.post(
  "/book-appointment",
  istheDriver,
  appointmentController.booktheAppointment
);
app.get("/appointments", appointmentController.getAppointments);

app.get("/bookedAppointments", istheExaminer, appointmentController.getBookedAppointments);
app.get("/examiner", istheExaminer, routepagesController.examiner);
app.get("/driverInfo", istheExaminer, userController.getDriverInfo);
app.post("/test-result", istheExaminer, userController.addTestResult);
app.get("/teststatus", istheAdmin, userController.testStatus);
app.get("/gtestTakers", istheExaminer, userController.gtesttakers);

// Creating connection with the database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to the Database");
  })
  .catch((error) => {
    console.error("Error: ", error);
  });

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
