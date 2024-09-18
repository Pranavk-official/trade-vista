import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, "defaultSecret", {
    expiresIn: "1h",
  });
};
