const bcrypt = require("bcryptjs");
const passport = require("passport");
const prisma = require("../db/prisma");
const db = require("../db/queries");

exports.signUpGet = (req, res) => res.render("sign-up");

exports.signUpPost = async (req, res, next) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    await db.createUser(req.body.username,hashed)
    res.redirect("/log-in");
  } catch (err) {
    next(err);
  }
};

exports.logInGet = (req, res) => {
  const messages = req.session.messages || [];
  if(req.session.messages) delete req.session.messages;
  // this way we're not assigning empty array to req.session.messages 
  // which means that on an 'empty' session (user not yet logged in), a session entry is not added to the 
  // session table, as session wasn't changed so thrown away at end of request.

  let notice = null;
  if (req.query.reason === "auth") {
    notice = "Please log in to use the service";
  }

  res.render("log-in", { messages, notice });
};

exports.logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureMessage: true, // puts the strategy's message in req.session.messages
});

exports.logOutGet = (req, res, next) => {
  req.logout((err) => (err ? next(err) : res.redirect("/")));
};
