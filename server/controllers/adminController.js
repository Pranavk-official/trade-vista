import Client from "../models/Client.js";
import Stock from "../models/Stock.js";
import Portfolio from "../models/Portfolio.js";
import { encryptPassword } from "../utils/encryptPassword.js";

export const createUser = async (req, res) => {
  const { name, userId, password, totalCash } = req.body;

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
      totalCash: parseFloat(totalCash),
      availableToTrade: parseFloat(totalCash),
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
      // Update the existing stock
      stock.stockName = stockName;
      stock.price = parseFloat(price);
      stock.availableQuantity = parseInt(availableQuantity);
      await stock.save();
      res.status(200).json({ message: "Stock updated successfully", stock });
    } else {
      // Create a new stock
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

export const buyStockForClient = async (req, res) => {
  try {
    const { clientId, stockId, quantity } = req.body;
    const client = await Client.findById(clientId);
    const stock = await Stock.findById(stockId);
    if (!client || !stock) {
      return res.status(404).json({ message: "Client or stock not found" });
    }
    const totalCost = quantity * stock.price;
    if (client.availableToTrade < totalCost) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    if (stock.availableQuantity < quantity) {
      return res
        .status(400)
        .json({ message: "Insufficient stock quantity available" });
    }

    // Update client's cash and available to trade
    client.totalCash -= totalCost;
    client.availableToTrade -= totalCost;
    client.marginUsed += totalCost;

    // Update or add to positions
    let portfolio = await Portfolio.findOne({ clientId });
    if (!portfolio) {
      portfolio = new Portfolio({ clientId, stocks: [] });
    }
    const existingPosition = portfolio.stocks.find(
      (p) => p.stockId.toString() === stock._id.toString(),
    );
    if (existingPosition) {
      const totalQuantity = existingPosition.quantity + quantity;
      existingPosition.buyPrice =
        (existingPosition.buyPrice * existingPosition.quantity + totalCost) /
        totalQuantity;
      existingPosition.quantity = totalQuantity;
    } else {
      portfolio.stocks.push({
        stockId: stock._id,
        quantity,
        buyPrice: stock.price,
      });
    }

    // Update stock quantity
    stock.availableQuantity -= quantity;
    await Promise.all([client.save(), portfolio.save(), stock.save()]);
    res.status(200).json({ message: "Stock bought successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error buying stock", error: error.message });
  }
};

export const sellStockForClient = async (req, res) => {
  try {
    const { clientId, stockId, quantity } = req.body;
    const client = await Client.findById(clientId);
    const stock = await Stock.findById(stockId);
    if (!client || !stock) {
      return res.status(404).json({ message: "Client or stock not found" });
    }
    const portfolio = await Portfolio.findOne({ clientId });
    if (!portfolio) {
      return res.status(404).json({ message: "Client portfolio not found" });
    }
    const position = portfolio.stocks.find(
      (p) => p.stockId.toString() === stock._id.toString(),
    );
    if (!position || position.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stocks to sell" });
    }
    const totalSale = quantity * stock.price;
    const profitLoss = (stock.price - position.buyPrice) * quantity;

    // Update client's cash, available to trade, and margin used
    client.totalCash += totalSale;
    client.availableToTrade += totalSale;
    client.marginUsed -= position.buyPrice * quantity;

    // Update position
    position.quantity -= quantity;
    if (position.quantity === 0) {
      portfolio.stocks = portfolio.stocks.filter(
        (p) => p.stockId.toString() !== stock._id.toString(),
      );
    }

    // Update stock quantity
    stock.availableQuantity += quantity;
    await Promise.all([client.save(), portfolio.save(), stock.save()]);
    res.status(200).json({
      message: "Stock sold successfully",
      profitLoss,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error selling stock", error: error.message });
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
          ...client._doc, // Spreads the client details
          positions: portfolio ? portfolio.stocks : [], // Add portfolio stocks as positions
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
