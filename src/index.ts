import express from "express";
import * as dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import path from "path";
import authRouter from "./routes/auth.js";
import dialogsRouter from "./routes/dialogs.js";
import messagesRouter from "./routes/messages.js";
import usersRouter from "./routes/users.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import http from "http";
import { setSocket } from "./core/socket.service.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

dotenv.config();

// app

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      ttl: 14 * 24 * 60 * 60, // save session for 14 days
    }),
  })
);

app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
  })
);

app.use(
  "/uploads",
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
  }),
  express.static(path.join(process.cwd(), "uploads"))
);

// parsing

app.use(express.static("public"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/", authRouter);
app.use("/", dialogsRouter);
app.use("/", messagesRouter);
app.use("/", usersRouter);

// connecting

app.get("/", (req, res) => {
  res.json({ message: "API работает!" });
});

// socket

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

setSocket(io);

async function startServer() {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "check your env url");

    server.listen(process.env.PORT, () => console.log("API сервер работает на http://localhost:8888"));
  } catch (err) {
    console.error("Ошибка подключения:", err);
  }
}

startServer();
