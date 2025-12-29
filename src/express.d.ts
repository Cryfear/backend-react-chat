import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
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