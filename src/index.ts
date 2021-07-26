import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import session from "express-session";
import { corsFunction, corsSettings } from "./core/cors";
import authRouter from "./routes/auth";
import dialogsRouter from "./routes/dialogs";
import messagesRouter from "./routes/messages";
import usersRouter from "./routes/users";
import { socketInitialization } from "./core/socket";
import MongoStore from "connect-mongo";

const app = express();
const cors = require("cors");
const server = require("http").createServer(app);

export const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

socketInitialization();

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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      ttl: 14 * 24 * 60 * 60 // save session for 14 days
  }),
  })
);

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
    server.listen(process.env.PORT, () => {
      console.log(`We are live on ${process.env.PORT}`);
    });
  }
);
