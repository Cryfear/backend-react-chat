import jwt from "jsonwebtoken";
import express, { NextFunction } from "express";

export function verifyToken(req: express.Request, res: express.Response, next: NextFunction) {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send("Access Denied");

  try {
    req.user = jwt.verify(token, process.env.SESSION_SECRET);
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}
