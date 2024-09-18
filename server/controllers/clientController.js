import Client from "../models/Client.js";
import Portfolio from "../models/Portfolio.js";

export const viewDashboard = async (req, res) => {
  try {
    const client = await Client.findById(req.user._id);
    const portfolio = await Portfolio.findOne({ clientId: client._id });

    res.json({
      name: client.name,
      userId: client.userId,
      totalCash: client.totalCash,
      availableToTrade: client.availableToTrade,
      marginUsed: client.marginUsed,
      recentTransactions: client.recentTransactions,
      positions: portfolio.stocks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFunds = async (req, res) => {
  const { amount } = req.body;

  try {
    const client = await Client.findById(req.user._id);
    client.totalCash += amount;
    client.availableToTrade += amount;

    await client.save();
    res.json({
      message: "Funds added successfully",
      totalCash: client.totalCash,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
