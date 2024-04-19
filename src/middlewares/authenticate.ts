import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env";

const extractBearerToken = (req): string | undefined => {
  let token;

  const raw = req.headers.authorization || "";
  if (raw.match(/Bearer /)) {
    token = raw.split("Bearer ")[1];
  }
  return token;
};

export default function authenticate(req, res, next) {
  const token = extractBearerToken(req);
  req.user = {};
  if (!token) {
    return next();
  }
  jwt.verify(token, JWT_SECRET, (error, data) => {
    if (error) {
      console.error(error);
    } else if (data) {
      req.user = data;
    }

    next();
  });
}
