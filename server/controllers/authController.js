import Admin from "../models/Admin.js";
import Client from "../models/Client.js";
import { encryptPassword, comparePassword } from "../utils/encryptPassword.js";
import { generateToken } from "../utils/generateToken.js";

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
