import mongoose from "mongoose";
import session from "express-session";
import * as dotenv from "dotenv";

const MongoStore = require("connect-mongo")(session);

dotenv.config();

export default {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
};
