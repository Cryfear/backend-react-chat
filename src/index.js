const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const database = require("./config/db");
const UsersController = require('./controllers/UsersController');
const MessagesController = require('./controllers/MessagesController');
const DialogsController = require('./controllers/DialogsController');
const updateLastSeen = require('./middleware/updateLastSeen');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

const corsOptions = {
  origin: 'http://127.0.0.1:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true')
  next();
  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
    res.send();
  });
})
app.use(updateLastSeen);

app.get("/users/:id", cors(corsOptions), UsersController.findUser);
app.post("/users/create", cors(corsOptions), UsersController.createUser);
app.put("/users/:id", cors(corsOptions), UsersController.updateUser);
app.delete("/users/:id", cors(corsOptions), UsersController.deleteUser);

app.get("/messages/:id", cors(corsOptions), MessagesController.findMessage);
app.post("/messages/create", cors(corsOptions), MessagesController.createMessage);
app.put("/messages/:id", cors(corsOptions), MessagesController.updateMessage);
app.delete("/messages/:id", cors(corsOptions), MessagesController.deleteMessage);

app.get("/dialogs/:id", cors(corsOptions), DialogsController.findDialog);
app.post("/dialogs/create", cors(corsOptions), DialogsController.createDialog);
app.put("/dialogs/:id", cors(corsOptions), DialogsController.updateDialog);
app.delete("/dialogs/:id", cors(corsOptions), DialogsController.deleteDialog);

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