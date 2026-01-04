import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: import("../models/User").IUser;
      files?: import("express-fileupload").FileArray;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      files?: import("express-fileupload").FileArray;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId: string | null;
    email: string;
    authToken: string;
  }
}

export {};