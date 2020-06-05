const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const database = require("./config/db");
const UserSchema = require('./schemes/User.js');
const jsonParser = express.json();

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.get("/", function (req, res) {
  res.send("default page");
});

app.get("/users/:id", (req, res) => {
  UserSchema.findOne({
    _id: req.params.id
  }, (err, user) => {
    if (err) return console.log(err);
    // res.send(note);
    console.log(user)
    res.send(user);
  });
});

app.post("/users/create", (req, res) => {
  console.log(req.body)
  const User = new UserSchema({
    email: req.body.email,
    fullName: req.body.fullName,
    password: req.body.password,
    avatar: req.body.avatar || 'none'
  })
  User.save((err, result) => {
    console.log('created user');
    res.send(User);
  })
});

app.put("/users/:id", (req, res) => {
  const updateUser = {
    avatar: req.body.avatar,
    fullName: req.body.fullName,
    password: req.body.password
  }

  UserSchema.findOneAndUpdate({
      _id: req.params.id
    },
    updateUser, {
      new: true,
      useFindAndModify: false
    },
    (err, user) => {
      if (err) return console.log(err);
      res.send(user);
    });
});

app.delete("/users/:id", (req, res) => {
  UserSchema.deleteOne({
    _id: req.params.id
  }, function (err, user) {
    if (err) return console.log(err);
    res.send(user);
  });
});

mongoose.connect(
  database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    app.listen(8888, () => {
      console.log("We are live on " + 8888);
    });
  }
);