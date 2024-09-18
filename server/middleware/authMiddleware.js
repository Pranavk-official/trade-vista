import passport from "passport";
import { ExtractJwt } from "passport-jwt";

export const authenticateUser = passport.authenticate("jwt", {
  session: false,
});

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};
