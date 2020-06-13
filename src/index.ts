import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import database from "./config/db";
import UsersController from "./controllers/UsersController";
import MessagesController from "./controllers/MessagesController";
import DialogsController from "./controllers/DialogsController";
import updateLastSeen from "./middleware/updateLastSeen";
import cors from "cors";

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const corsOptions = {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  optionsSuccessStatus: 200,
};

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
  database.url,
  {
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
