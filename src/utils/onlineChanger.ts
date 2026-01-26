import type { RequestHandler } from "express-serve-static-core";
import User from "../models/User.js";

export const onlineChanger: RequestHandler = async (req, res, next) => {
  const userId = req.headers["id"];

  if (!userId || userId === "null" || userId === "undefined") {
    return next();
  }

  try {
    const user = await User.findById(userId).exec();

    if (!user) {
      return next();
    }

    user.isOnline = true;
    user.last_seen = new Date();
    await user.save();

    req.user = user;

    setTimeout(async () => {
      try {
        const freshUser = await User.findById(userId);
        if (freshUser) {
          const isStillOnline =
            Date.now() - freshUser.last_seen.getTime() < 55_000;

          if (freshUser.isOnline !== isStillOnline) {
            freshUser.isOnline = isStillOnline;
            await freshUser.save();
          }
        }
      } catch (e) {
        console.error("Online timeout error:", e);
      }
    }, 50_000);

    next();
  } catch (err) {
    console.error("onlineChanger error:", err);
    res.status(500).json({
      responseCode: "ONLINE_CHANGER_ERROR",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
