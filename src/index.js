const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const database = require("./config/db");
const UsersController = require('./controllers/UsersController');
const MessagesController = require('./controllers/MessagesController');
const DialogsController = require('./controllers/DialogsController');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.get("/users/:id", UsersController.findUser);
app.post("/users/create", UsersController.createUser);
app.put("/users/:id", UsersController.updateUser);
app.delete("/users/:id", UsersController.deleteUser);

app.get("/messages/:id", MessagesController.findMessage);
app.post("/messages/create", MessagesController.createMessage);
app.put("/messages/:id", MessagesController.updateMessage);
app.delete("/messages/:id", MessagesController.deleteMessage);

app.get("/dialogs/:id", DialogsController.findDialog);
app.post("/dialogs/create", DialogsController.createDialog);
app.put("/dialogs/:id", DialogsController.updateDialog);
app.delete("/dialogs/:id", DialogsController.deleteDialog);

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