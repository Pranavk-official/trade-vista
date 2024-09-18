import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Admin from "../models/Admin.js";
import Client from "../models/Client.js";

import dotenv from "dotenv";
dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Fallback to a default key if JWT_SECRET is undefined
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user =
        (await Admin.findById(jwt_payload.id)) ||
        (await Client.findById(jwt_payload.id));
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }),
);

export default passport;
