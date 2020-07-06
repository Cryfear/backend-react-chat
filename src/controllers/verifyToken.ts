import jwt from "jsonwebtoken";
import express from "express";

export function verifyToken(req: express.Request, res: express.Response, next: any) {

  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    req.user = jwt.verify(token, "dsHASadzx35634xxxnnrad");
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}
