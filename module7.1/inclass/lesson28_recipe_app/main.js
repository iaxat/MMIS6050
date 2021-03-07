"use strict";

const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"),
  passport = require("passport"),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  User = require("./models/user");
  const axios = require("axios");

//mongoose.Promise = global.Promise;

mongoose.connect(
  "mongodb+srv://root:root@akshat.y9onm.mongodb.net/recipe28_inclass_module71?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
);


const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("token", process.env.TOKEN || "recipeT0k3n");

app.use(express.static("public"));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

app.use(express.json());
app.use(cookieParser("secret_passcode"));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(connectFlash());

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});
//app.use(expressValidator());

const apiUrl = "https://the-one-api.dev/v2";
const apiKey = "MKGT3QAY3uIpIHhLHcU7";

app.get("/lotr/book", async (req, res) => {
  try {
    let result = await axios.get('${apiUrl}/book');
    res.send(result.data);
  } catch (error) {
    res.send(error);
  }
});

app.get("/lotr/movie", async (req, res) => {
  try {
    let result = await axios.get('${apiUrl}/movie', {
      headers: {
        Authorization:'Bearer ${apiKey}'
      }
    });
    res.send(result.data);
  } catch (error) {
    res.send(error);
  }
});

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
