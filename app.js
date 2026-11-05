require("dotenv").config();
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./db/prisma");
require("./config/passport");

const app = express();
const authRouter = require("./routes/authRouter");
const projectRouter = require("./routes/projectRouter");



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// for reading input from response forms.
app.use(express.static(path.join(__dirname, "public")));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // clear expired sessions every 2 min
      dbRecordIdIsSessionId: true,
    }),
  })
);
app.use(passport.session())

app.use((req, res, next) => {

  res.locals.currentUser = req.user;
  res.locals.error = req.query.error;
  next();

  //makes the logged in user retrieved from the session using passport, available on every request.
});

app.use("/",projectRouter);
app.use("/", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app listening on port ${PORT}!`);
});
