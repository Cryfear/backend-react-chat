import express, { NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import authRouter from "./routes/auth";
import dialogsRouter from "./routes/dialogs";
import messagesRouter from "./routes/messages";
import usersRouter from "./routes/users";
import updateLastSeen from "./updateLastSeen";
import * as dotenv from "dotenv";

const MongoStore = require("connect-mongo")(session);

const app = express();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      SESSION_SECRET: any; // confict with jwt idk how to fix it
    }
  }
}

dotenv.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
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

app.use(updateLastSeen);

const corsOptions = {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  optionsSuccessStatus: 200,
  options: "*",
  "Access-Control-Allow-Credentials": true,
};

app.use((req: express.Request, res: express.Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  app.options("*", (req: express.Request, res: express.Response) => {
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    res.send();
  });
});

app.use(cors(corsOptions));

app.use("", authRouter);
app.use("", dialogsRouter);
app.use("", messagesRouter);
app.use("", usersRouter);

mongoose.connect(
  process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    app.listen(process.env.PORT, () => {
      console.log(`We are live on ${process.env.PORT}`);
    });
  }
);
