import type { NextFunction, Response } from "express";
import User, { type IUser } from "../models/User.ts";

interface CustomRequest extends Request {
  user: IUser;
}

interface OnlineChangerResponse {
  responseCode: string;
  error?: string;
}

export const onlineChanger = async (
  req: CustomRequest,
  res: Response<OnlineChangerResponse>,
  next: NextFunction
): Promise<void> => {
  const userId = req.headers["id"];

  if (!userId || userId === 'null' || userId === 'undefined') {
    return next();
  }

  try {
    const user = await User.findOne({ _id: userId }).exec();

    if (!user) {
      console.warn(`User with ID ${userId} not found`);
      return next();
    }

    user.isOnline = true;
    user.last_seen = new Date();
    await user.save();

    setTimeout(async () => {
      try {
        const freshUser = await User.findById(userId);
        if (freshUser) {
          const isStillOnline = Date.now() - freshUser.last_seen.getTime() < 55000;
          if (freshUser.isOnline !== isStillOnline) {
            freshUser.isOnline = isStillOnline;
            await freshUser.save();
          }
        }
      } catch (error) {
        console.error('Error in online status timeout:', error);
      }
    }, 50000);

    next();

  } catch (err) {
    console.error('Error in onlineChanger middleware:', err);
    res.status(500).send({ 
      responseCode: "Something wrong with onlineChanger",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

export default onlineChanger;