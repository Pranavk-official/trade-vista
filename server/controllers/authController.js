import Admin from "../models/Admin.js";
import Client from "../models/Client.js";
import { encryptPassword, comparePassword } from "../utils/encryptPassword.js";
import { generateToken } from "../utils/generateToken.js";

import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const registerAdmin = async (req, res) => {
  const { name, userId, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ userId });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const encryptedPassword = await encryptPassword(password);
    const newAdmin = await Admin.create({
      name,
      userId,
      password: encryptedPassword,
    });

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const admin = await Admin.findOne({ userId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clientLogin = async (req, res) => {
  const { userId, password } = req.body;

  try {
    console.log(req.body);
    const client = await Client.findOne({ userId });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const isPasswordValid = await comparePassword(password, client.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(client);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    client.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    client.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    await client.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      "host",
    )}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: client.email,
        subject: "Password reset token",
        message,
      });

      res.status(200).json({ message: "Email sent" });
    } catch (error) {
      client.resetPasswordToken = undefined;
      client.resetPasswordExpire = undefined;
      await client.save();

      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const client = await Client.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!client) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    client.password = await encryptPassword(password);
    client.resetPasswordToken = undefined;
    client.resetPasswordExpire = undefined;

    await client.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
