import Client from "../models/Client.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js"; // Import the Transaction model

export const viewDashboard = async (req, res) => {
  try {
    const client = await Client.findById(req.user._id);
    const portfolio = await Portfolio.findOne({
      clientId: client._id,
    }).populate("stocks.stockId");

    if (!client || !portfolio) {
      return res
        .status(404)
        .json({ message: "Client or portfolio not found." });
    }

    // Fetch the transaction history for the client
    const transactions = await Transaction.find({ clientId: client._id })
      .populate("stockId")
      .sort({ createdAt: -1 });

    // Calculate total profit/loss from transactions
    const totalProfitLoss = portfolio.stocks.reduce(
      (total, stock) => total + (stock.profitLoss || 0),
      0,
    );

    // Structure the portfolio and transaction data
    const portfolioData = portfolio.stocks.map((stock) => ({
      stockName: stock.stockId.stockName,
      stockSymbol: stock.stockId.stockSymbol,
      quantity: stock.quantity,
      buyPrice: stock.buyPrice,
      sellPrice: stock.sellPrice,
      currentPrice: stock.currentPrice,
      status: stock.status,
      profitLoss: stock.profitLoss,
    }));

    console.log(portfolio);

    const transactionData = transactions.map((transaction) => ({
      stockName: transaction.stockId.stockName,
      type: transaction.type,
      quantity: transaction.quantity,
      price: transaction.price,
      totalCost: transaction.totalCost,
      profitLoss: transaction.profitLoss,
      date: transaction.createdAt,
    }));

    res.json({
      name: client.name,
      userId: client.userId,
      totalCash: client.totalCash,
      availableToTrade: client.availableToTrade,
      marginUsed: client.marginUsed,
      totalProfitLoss, // Display total P/L for the portfolio
      positions: portfolioData, // Portfolio positions
      transactionHistory: transactionData, // Display transaction history
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const addFunds = async (req, res) => {
  const { amount } = req.body;

  try {
    const client = await Client.findById(req.user._id);
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    client.totalCash += amount;
    client.availableToTrade += amount;

    await client.save();

    res.json({
      message: "Funds added successfully",
      totalCash: client.totalCash,
      availableToTrade: client.availableToTrade,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
