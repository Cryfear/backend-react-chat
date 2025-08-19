import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.header("auth-token");

  if (!token) return res.send({responseCode: "Access Denied"});

  try {
    req.user = jwt.verify(token, process.env.SESSION_SECRET);
    next();
  } catch (err) {
    res.send({responseCode: "Invalid Token"});
  }
}
