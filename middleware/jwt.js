import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(createError(401,"You are not authenticated!"))


  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return next(createError(403,"Token is not valid!"))
    req.userId = payload.id;
    req.isArtist = payload.isArtist;
    next()
  });
};

export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userId === req.params.id) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};


export const verifyArtist = (req, res, next) => {
  if(!req.isArtist) {
    return next(createError(403, "Unauthorized"))
  }
  next()
}