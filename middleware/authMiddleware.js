const istheAdmin = (req, res, next) => {
  if (req.session.userId && req.session.userType === "Admin") {
    return next();
  }
  res.redirect("/login");
};

const istheDriver = (req, res, next) => {
  if (req.session.userId && req.session.userType === "Driver") {
    return next();
  }
  res.redirect("/login");
};

const istheExaminer = (req, res, next) => {
  if (req.session.userId && req.session.userType === "Examiner") {
    return next();
  }
  res.redirect("/login");
};

module.exports = { istheDriver, istheAdmin, istheExaminer };
