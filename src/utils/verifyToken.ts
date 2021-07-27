import jwt from "jsonwebtoken";
import express, { NextFunction } from "express";

export function verifyToken(req: any, res: express.Response, next: NextFunction) {
  const token = req.header("auth-token");

  if (!token) return res.send({responseCode: "Access Denied"});

  try {
    req.user = jwt.verify(token, process.env.SESSION_SECRET);
    next();
  } catch (err) {
    res.send({responseCode: "Invalid Token"});
  }
}
