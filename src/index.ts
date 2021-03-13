import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import createSocket from "./core/socket";
import session from "express-session";
import { corsFunction, corsSettings } from "./core/cors";
import authRouter from "./routes/auth";
import dialogsRouter from "./routes/dialogs";
import messagesRouter from "./routes/messages";
import usersRouter from "./routes/users";
import updateLastSeen from "./utils/updateLastSeen";
import expressSession from "./core/expressSession";

const app = express();
const http = require("http").createServer(app);

export const io = createSocket(http);

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      SESSION_SECRET: string;
    }
  }
}

// express session

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// parsing

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors

app.use(corsFunction(app));
app.use(cors(corsSettings));

// routes

app.use("/", authRouter);
app.use("/", dialogsRouter);
app.use("/", messagesRouter);
app.use("/", usersRouter);

// connecting

mongoose.connect(
  process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    http.listen(process.env.PORT, () => {
      console.log(`We are live on ${process.env.PORT}`);
    });
  }
);
