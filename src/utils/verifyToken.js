import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers['auth-token'];

  if (token === null) return res.send({responseCode: "Access Denied"});

  try {
    req.user = jwt.verify(token, process.env.SESSION_SECRET);
    next();
  } catch (err) {
    res.send({responseCode: "Invalid Token"});
  }
}
