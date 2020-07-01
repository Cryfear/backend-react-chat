import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import database from "./config/db";
import UsersController from "./controllers/UsersController";
import MessagesController from "./controllers/MessagesController";
import DialogsController from "./controllers/DialogsController";
import cors from "cors";
import session from "express-session";

const MongoStore = require("connect-mongo")(session);

const app = express();

app.use(
  session({
    secret: database.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const corsOptions = {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  optionsSuccessStatus: 200,
  options: "*",
  "Access-Control-Allow-Credentials": true,
};

app.use((req: express.Request, res: express.Response, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    res.send();
  });
});

app.use(cors(corsOptions));

// app.get("/auth", (req, res) => {
//   console.log(req.session);
//   if (req.session) {
//     if (req.session.userId && req.session.userLogin) {
//       res.send({ auth: true });
//     } else res.send({ auth: false });
//   } else res.send({ auth: false });
// });

app.get("/users/:id", UsersController.findUser);
app.get("/getUsers/:page", UsersController.getUsers);
app.post("/login", UsersController.loginUser);
app.post("/login/me", UsersController.getMe);
app.delete("/logout", UsersController.logoutUser);
app.post("/users/create", UsersController.createUser);
app.put("/users/:id", UsersController.updateUser);
app.delete("/users/:id", UsersController.deleteUser);

app.get("/messages/:id", MessagesController.findMessage);
app.post("/messages/create", MessagesController.createMessage);
app.put("/messages/:id", MessagesController.updateMessage);
app.delete("/messages/:id", MessagesController.deleteMessage);

app.get("/dialogs/:id&:id_s", DialogsController.findDialog);
app.post("/dialogs/create", DialogsController.createDialog);
app.put("/dialogs/:id", DialogsController.updateDialog);
app.delete("/dialogs/:id", DialogsController.deleteDialog);

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
