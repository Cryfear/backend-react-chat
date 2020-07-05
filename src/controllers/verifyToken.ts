import jwt from "jsonwebtoken";

export function verifyToken(req: any, res: any, next: any) {
  console.log(req.body, req.header);
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    req.user = jwt.verify(token, "dsHASadzx35634xxxnnrad");
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}
