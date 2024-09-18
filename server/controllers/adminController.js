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

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const totalCost = buyPrice * quantity;
    if (client.totalCash < totalCost) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    if (stock.availableQuantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock quantity" });
    }

    let portfolio = await Portfolio.findOne({ clientId });

    if (!portfolio) {
      // Create a new portfolio if it doesn't exist
      portfolio = new Portfolio({ clientId, stocks: [] });
    }

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

    // Update stock availability and client's totalCash
    stock.availableQuantity -= quantity;
    client.totalCash -= totalCost;

    await stock.save();
    await client.save();
    await portfolio.save();
    res.json({ message: "Stock bought successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const sellStockForClient = async (req, res) => {
  const { clientId, stockId, sellPrice } = req.body;

  try {
    const client = await Client.findById(clientId);
    const portfolio = await Portfolio.findOne({ clientId });
    const stock = await Stock.findById(stockId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const stockInPortfolio = portfolio.stocks.find((s) =>
      s.stockId.equals(stockId),
    );

    if (!stockInPortfolio || stockInPortfolio.status === "Closed") {
      return res.status(404).json({
        message: "Stock not found in client portfolio or already sold",
      });
    }

    const totalRevenue = sellPrice * stockInPortfolio.quantity;
    stockInPortfolio.status = "Closed";
    stockInPortfolio.sellPrice = sellPrice;
    stockInPortfolio.profitLoss =
      ((sellPrice - stockInPortfolio.buyPrice) / stockInPortfolio.buyPrice) *
      100; // Calculate P/L as percentage

    // Update stock availability and client's totalCash
    stock.availableQuantity += stockInPortfolio.quantity;
    client.totalCash += totalRevenue;

    await stock.save();
    await client.save();
    await portfolio.save();
    res.json({ message: "Stock sold successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// View all details related to stocks and clients

export const viewAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewClientDetails = async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const portfolio = await Portfolio.findOne({ clientId }).populate(
      "stocks.stockId",
    );
    res.json({ client, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewStockDetails = async (req, res) => {
  const { stockId } = req.params;

  try {
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const portfolios = await Portfolio.find({
      "stocks.stockId": stockId,
    }).populate("clientId");
    res.json({ stock, portfolios });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
