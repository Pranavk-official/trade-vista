import Client from "../models/Client.js";
import Stock from "../models/Stock.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
import { encryptPassword } from "../utils/encryptPassword.js";

export const createUser = async (req, res) => {
  const { name, userId, email, password, totalCash } = req.body;

  console.log(req.body);

  try {
    const existingUserById = await Client.findOne({ userId });
    const existingUserByEmail = await Client.findOne({ email });

    if (existingUserById) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const encryptedPassword = await encryptPassword(password);
    const newUser = await Client.create({
      name,
      userId,
      email,
      password: encryptedPassword,
      totalCash: parseFloat(totalCash) || 0,
      availableToTrade: parseFloat(totalCash) || 0,
      marginUsed: 0,
    });

    await Portfolio.create({ clientId: newUser._id, stocks: [] });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const manageStock = async (req, res) => {
  const { stockName, stockSymbol, price, availableQuantity } = req.body;

  try {
    const stock = await Stock.findOne({ stockSymbol });

    if (stock) {
      stock.stockName = stockName;
      stock.price = parseFloat(price);
      stock.availableQuantity = parseInt(availableQuantity);
      await stock.save();
      res.status(200).json({ message: "Stock updated successfully", stock });
    } else {
      const newStock = await Stock.create({
        stockName,
        stockSymbol,
        price: parseFloat(price),
        availableQuantity: parseInt(availableQuantity),
      });
      res
        .status(201)
        .json({ message: "Stock created successfully", stock: newStock });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const adminBuyStockForClient = async (req, res) => {
  const { clientId, stockId, stockSymbol, price, quantity } = req.body;

  let { buyPrice } = req.body;

  if (price) {
    buyPrice = price;
  }

  console.log(req.body);

  try {
    const client = await Client.findById(clientId);
    const stock = stockId
      ? await Stock.findById(stockId)
      : await Stock.findOne({ stockSymbol });

    if (!client || !stock) {
      return res.status(404).json({ message: "Client or stock not found." });
    }

    if (stock.availableQuantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock quantity." });
    }

    const totalCost = buyPrice * quantity;
    if (client.availableToTrade < totalCost) {
      return res.status(400).json({ message: "Insufficient available funds." });
    }

    // Update or create client's portfolio
    const portfolio = await Portfolio.findOne({ clientId });
    const stockIndex = portfolio.stocks.findIndex(
      (s) => s.stockId.toString() === stock._id.toString(),
    );

    if (stockIndex >= 0) {
      portfolio.stocks[stockIndex].quantity += quantity;

      // Change status to 'Open' if it was 'Closed'
      if (portfolio.stocks[stockIndex].status === "Closed") {
        portfolio.stocks[stockIndex].status = "Open";
      }
    } else {
      portfolio.stocks.push({
        stockId: stock._id,
        quantity,
        buyPrice: buyPrice, // Use buyPrice from the form
        currentPrice: stock.price, // This could be updated in real-time
        sellPrice: null,
        status: "Open",
        profitLoss: 0,
      });
    }

    // Update client finances
    client.totalCash -= totalCost; // Deduct from total cash
    client.availableToTrade -= totalCost; // Deduct from available funds
    client.marginUsed += totalCost;

    await client.save();

    // Update stock's available quantity
    stock.availableQuantity -= quantity;
    await stock.save();
    await portfolio.save();

    // Record transaction
    const transaction = new Transaction({
      clientId,
      stockId: stock._id,
      type: "buy",
      quantity,
      price: buyPrice, // Price at which the stock is bought
      totalCost,
      createdAt: new Date(),
    });

    await transaction.save();

    res
      .status(200)
      .json({ message: "Stock purchased successfully.", portfolio });
  } catch (error) {
    console.error("Error buying stock:", error.message);
    res.status(500).json({ message: "Failed to buy stock." });
  }
};

export const adminSellStockForClient = async (req, res) => {
  const { clientId, stockId, stockSymbol, price, quantity } = req.body;

  let { sellPrice } = req.body;

  if (price) {
    sellPrice = price;
  }
  try {
    const client = await Client.findById(clientId);
    const stock = stockId
      ? await Stock.findById(stockId)
      : await Stock.findOne({ stockSymbol });

    const portfolio = await Portfolio.findOne({ clientId });

    if (!client || !stock || !portfolio) {
      return res
        .status(404)
        .json({ message: "Client, stock, or portfolio not found." });
    }

    const stockPosition = portfolio.stocks.find(
      (s) => s.stockId.toString() === stock._id.toString(),
    );

    if (!stockPosition || stockPosition.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Insufficient stock quantity in portfolio." });
    }

    const currentSellPrice = sellPrice || stock.price; // Use current market price if sellPrice is not provided
    const profitLoss = (currentSellPrice - stockPosition.buyPrice) * quantity;

    stockPosition.quantity -= quantity;
    stockPosition.profitLoss += profitLoss;

    if (stockPosition.quantity === 0) {
      stockPosition.status = "Closed";
      stockPosition.sellPrice = currentSellPrice;
    }

    // Update client finances
    const totalProceeds = currentSellPrice * quantity;
    client.totalCash += totalProceeds; // Add to total cash
    client.availableToTrade += totalProceeds; // Add to available funds
    client.marginUsed -= totalProceeds;

    // Update stock's available quantity
    stock.availableQuantity += quantity;

    // Record transaction
    const transaction = new Transaction({
      clientId,
      stockId: stock._id,
      type: "sell",
      quantity,
      price: currentSellPrice, // Price at which the stock is sold
      totalCost: totalProceeds,
      createdAt: new Date(),
      profitLoss,
    });

    await Promise.all([
      client.save(),
      stock.save(),
      portfolio.save(),
      transaction.save(),
    ]);

    res.status(200).json({ message: "Stock sold successfully.", portfolio });
  } catch (error) {
    console.error("Error selling stock:", error);
    res.status(500).json({ message: "Failed to sell stock." });
  }
};

export const viewAllClients = async (req, res) => {
  try {
    const clients = await Client.find().select("-password");
    const clientsWithPortfolios = await Promise.all(
      clients.map(async (client) => {
        const portfolio = await Portfolio.findOne({
          clientId: client._id,
        }).populate("stocks.stockId");
        return {
          ...client._doc,
          positions: portfolio ? portfolio.stocks : [],
        };
      }),
    );

    res.json(clientsWithPortfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewClientDetails = async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findById(clientId).select("-password");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const portfolio = await Portfolio.findOne({ clientId }).populate(
      "stocks.stockId",
    );

    const positions = portfolio.stocks.map((stock) => ({
      id: stock._id,
      stockId: stock.stockId,
      quantity: stock.quantity,
      buyPrice: stock.buyPrice,
      currentPrice: stock.stockId.price,
      profitLoss: (stock.stockId.price - stock.buyPrice) * stock.quantity,
    }));

    res.json({ ...client.toObject(), positions });
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
