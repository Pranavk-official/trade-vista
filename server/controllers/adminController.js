import Client from "../models/Client.js";
import Stock from "../models/Stock.js";
import Portfolio from "../models/Portfolio.js";
import { encryptPassword } from "../utils/encryptPassword.js";

export const createUser = async (req, res) => {
  const { name, userId, password } = req.body;

  try {
    const existingUser = await Client.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const encryptedPassword = await encryptPassword(password);
    const newUser = await Client.create({
      name,
      userId,
      password: encryptedPassword,
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const manageStock = async (req, res) => {
  const { stockName, stockSymbol, price, availableQuantity } = req.body;

  try {
    const stock = await Stock.findOne({ stockSymbol });

    if (stock) {
      // Update the existing stock
      stock.stockName = stockName;
      stock.price = price;
      stock.availableQuantity = availableQuantity;
      await stock.save();
      res.status(200).json({ message: "Stock updated successfully", stock });
    } else {
      // Create a new stock
      const newStock = await Stock.create({
        stockName,
        stockSymbol,
        price,
        availableQuantity,
      });
      res
        .status(201)
        .json({ message: "Stock created successfully", stock: newStock });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buyStockForClient = async (req, res) => {
  const { clientId, stockId, quantity, buyPrice } = req.body;

  try {
    const stock = await Stock.findById(stockId);
    const client = await Client.findById(clientId);

    const portfolio = await Portfolio.findOne({ clientId });
    const existingStock = portfolio.stocks.find((s) =>
      s.stockId.equals(stockId),
    );

    if (existingStock) {
      existingStock.quantity += quantity;
    } else {
      portfolio.stocks.push({
        stockId,
        quantity,
        buyPrice,
        status: "Open",
      });
    }

    await portfolio.save();
    res.json({ message: "Stock bought successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sellStockForClient = async (req, res) => {
  const { clientId, stockId, sellPrice } = req.body;

  try {
    const portfolio = await Portfolio.findOne({ clientId });
    const stock = portfolio.stocks.find((s) => s.stockId.equals(stockId));

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock not found in client portfolio" });
    }

    stock.status = "Closed";
    stock.sellPrice = sellPrice;
    stock.profitLoss = ((sellPrice - stock.buyPrice) / stock.buyPrice) * 100; // Calculate P/L as percentage

    await portfolio.save();
    res.json({ message: "Stock sold successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
