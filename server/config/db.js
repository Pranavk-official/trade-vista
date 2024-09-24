// import mongoose from "mongoose";
// import Stock from "../models/Stock.js";
// import Client from "../models/Client.js";
import axios from "axios";
// import Portfolio from "../models/Portfolio.js";
const mockStocks = [
  {
    stockName: "Apple Inc.",
    stockSymbol: "AAPL",
    price: 145.09,
    availableQuantity: 1000,
  },
  {
    stockName: "Tesla Inc.",
    stockSymbol: "TSLA",
    price: 720.14,
    availableQuantity: 500,
  },
  {
    stockName: "Amazon.com Inc.",
    stockSymbol: "AMZN",
    price: 3342.88,
    availableQuantity: 300,
  },
  {
    stockName: "Microsoft Corp.",
    stockSymbol: "MSFT",
    price: 299.35,
    availableQuantity: 800,
  },
  {
    stockName: "Alphabet Inc.",
    stockSymbol: "GOOGL",
    price: 2731.63,
    availableQuantity: 600,
  },
  {
    stockName: "Facebook, Inc.",
    stockSymbol: "FB",
    price: 355.64,
    availableQuantity: 400,
  },
  {
    stockName: "NVIDIA Corp.",
    stockSymbol: "NVDA",
    price: 197.29,
    availableQuantity: 700,
  },
  {
    stockName: "Berkshire Hathaway",
    stockSymbol: "BRK.A",
    price: 420000.0,
    availableQuantity: 100,
  },
  {
    stockName: "Visa Inc.",
    stockSymbol: "V",
    price: 230.82,
    availableQuantity: 900,
  },
  {
    stockName: "JPMorgan Chase & Co.",
    stockSymbol: "JPM",
    price: 157.25,
    availableQuantity: 850,
  },
  {
    stockName: "Walmart Inc.",
    stockSymbol: "WMT",
    price: 141.76,
    availableQuantity: 950,
  },
  {
    stockName: "Coca-Cola Co.",
    stockSymbol: "KO",
    price: 55.03,
    availableQuantity: 1200,
  },
  {
    stockName: "PepsiCo, Inc.",
    stockSymbol: "PEP",
    price: 152.34,
    availableQuantity: 1100,
  },
  {
    stockName: "Pfizer Inc.",
    stockSymbol: "PFE",
    price: 42.78,
    availableQuantity: 1300,
  },
  {
    stockName: "Intel Corp.",
    stockSymbol: "INTC",
    price: 53.06,
    availableQuantity: 1600,
  },
  {
    stockName: "Netflix Inc.",
    stockSymbol: "NFLX",
    price: 578.8,
    availableQuantity: 200,
  },
  {
    stockName: "Adobe Inc.",
    stockSymbol: "ADBE",
    price: 670.32,
    availableQuantity: 300,
  },
  {
    stockName: "Salesforce.com Inc.",
    stockSymbol: "CRM",
    price: 241.03,
    availableQuantity: 250,
  },
  {
    stockName: "Twitter, Inc.",
    stockSymbol: "TWTR",
    price: 63.14,
    availableQuantity: 400,
  },
  {
    stockName: "Spotify Technology S.A.",
    stockSymbol: "SPOT",
    price: 260.4,
    availableQuantity: 300,
  },
];

const insertStocksIfEmpty = async () => {
  try {
    const count = await Stock.countDocuments();
    if (count === 0) {
      await Stock.insertMany(mockStocks);
      console.log("Mock stock data inserted successfully.");
    } else {
      console.log("Stocks collection is not empty. No data inserted.");
    }
  } catch (error) {
    console.error("Error inserting stock data:", error);
  }
};

const mockClients = [
  {
    name: "John Doe",
    userId: "johnd",
    email: "john@example.com",
    password: "password123",
    totalCash: 1000000,
  },
  {
    name: "Jane Smith",
    userId: "janes",
    email: "jane@example.com",
    password: "password456",
    totalCash: 1500000,
  },
  {
    name: "Bob Johnson",
    userId: "bobj",
    email: "bob@example.com",
    password: "password789",
    totalCash: 1500000,
  },
  {
    name: "Alice Brown",
    userId: "aliceb",
    email: "alice@example.com",
    password: "passwordabc",
    totalCash: 1500000,
  },
  {
    name: "Charlie Wilson",
    userId: "charliew",
    email: "charlie@example.com",
    password: "passworddef",
    totalCash: 1500000,
  },
  {
    name: "Diana Taylor",
    userId: "dianat",
    email: "diana@example.com",
    password: "passwordghi",
    totalCash: 150000,
  },
  {
    name: "Edward Davis",
    userId: "edwardd",
    email: "edward@example.com",
    password: "passwordjkl",
    totalCash: 1500000,
  },
  {
    name: "Fiona Clark",
    userId: "fionac",
    email: "fiona@example.com",
    password: "passwordmno",
    totalCash: 1500000,
  },
  {
    name: "George White",
    userId: "georgew",
    email: "george@example.com",
    password: "passwordpqr",
    totalCash: 150000,
  },
  {
    name: "Helen Green",
    userId: "heleng",
    email: "helen@example.com",
    password: "passwordstu",
    totalCash: 1500000,
  },
];

// Admin login credentials
const adminCredentials = { userId: "admin123", password: "adminpassword" };
let adminToken = null;

const simulateAdminLogin = async () => {
  try {
    const response = await axios.post(
      `http://localhost:${process.env.PORT || 5000}/api/auth/admin/login`,
      adminCredentials,
    );
    adminToken = response.data.token;
    console.log("Admin logged in successfully.");
  } catch (error) {
    console.error("Error logging in as admin:", error.message);
    throw error;
  }
};

const simulateApiCall = async (endpoint, method, data) => {
  try {
    if (!adminToken) {
      throw new Error("Admin not logged in. Please login first.");
    }
    const response = await axios({
      method,
      url: `http://localhost:${process.env.PORT || 5000}/api${endpoint}`,
      data,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in simulated API call to ${endpoint}:`, error.message);
    throw error;
  }
};

const insertMockClientsAndPurchases = async () => {
  try {
    // Loop through each mock client
    for (let client of mockClients) {
      // Create a new client via API call
      const newClientData = await simulateApiCall(
        "/admin/create-user",
        "POST",
        {
          name: client.name,
          userId: client.userId,
          email: client.email,
          password: client.password,
          totalCash: client.totalCash,
        },
      );
    }
    console.log("Mock clients created and purchases simulated successfully.");
  } catch (error) {
    console.error("Error inserting mock clients and purchases:", error.message);
  }
};

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     if (conn) {
//       await Stock.deleteMany({});
//       await insertStocksIfEmpty();
//       await Client.deleteMany({});
//       await Portfolio.deleteMany({});
//       await simulateAdminLogin();
//       await insertMockClientsAndPurchases();
//     }
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";
import Client from "../models/Client.js";
import Stock from "../models/Stock.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js"; // Assuming you have a Transaction model to record buy/sell

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (conn) {
      await Stock.deleteMany({});
      await insertStocksIfEmpty();
      await Client.deleteMany({});
      await Portfolio.deleteMany({});
      await simulateAdminLogin();
      await insertMockClientsAndPurchases();
    }
    await simulateTransactions(); // Call to run the transaction simulation after connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Function to simulate buy/sell transactions
const simulateTransactions = async () => {
  try {
    const clients = await Client.find(); // Fetch all clients
    const stocks = await Stock.find(); // Fetch all available stocks

    for (const client of clients) {
      console.log(`Simulating transactions for client: ${client.name}`);

      // Select half of the available stocks for each client
      const stocksToTrade = stocks
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(stocks.length / 2));

      for (let i = 0; i < 10; i++) {
        const stock = stocksToTrade[i % stocksToTrade.length]; // Loop through the selected stocks

        // Randomly decide whether to buy or sell (60% chance to buy, 40% chance to sell)
        const isBuying = Math.random() > 0.4;

        // Simulate random quantities and prices
        const quantity = Math.floor(Math.random() * 100) + 1; // Random quantity between 1 and 100
        const price =
          stock.price + (isBuying ? -Math.random() * 10 : Math.random() * 10); // Adjust price based on buying/selling

        if (isBuying) {
          // Buying stock
          await buyStock(client, stock, quantity, price);
        } else {
          // Selling stock, only sell if there's sufficient stock in the portfolio
          const portfolio = await Portfolio.findOne({ clientId: client._id });
          const existingStock = portfolio?.stocks.find(
            (s) => s.stockId.toString() === stock._id.toString(),
          );

          if (existingStock && existingStock.quantity >= quantity) {
            await sellStock(client, stock, quantity, price);
          } else {
            console.log(
              `${client.name} does not have enough ${stock.stockName} to sell.`,
            );
          }
        }
      }
    }

    console.log("Transactions simulation completed.");
  } catch (err) {
    console.error(`Error during transaction simulation: ${err.message}`);
  }
};

// Buy stock function
const buyStock = async (client, stock, quantity, buyPrice) => {
  try {
    let portfolio = await Portfolio.findOne({ clientId: client._id });
    if (!portfolio) {
      portfolio = new Portfolio({ clientId: client._id, stocks: [] });
    }

    const existingStock = portfolio.stocks.find(
      (s) => s.stockId.toString() === stock._id.toString(),
    );

    const totalCost = quantity * buyPrice;

    if (client.availableToTrade >= totalCost) {
      if (existingStock) {
        existingStock.quantity += quantity;
        existingStock.buyPrice = (existingStock.buyPrice + buyPrice) / 2; // Update buy price (average)
      } else {
        portfolio.stocks.push({
          stockId: stock._id,
          quantity,
          buyPrice,
          status: "Open",
          profitLoss: 0,
        });
      }

      client.totalCash -= totalCost;
      client.availableToTrade -= totalCost;
      client.marginUsed += totalCost;

      await portfolio.save();
      await client.save();

      // Record the buy transaction
      await Transaction.create({
        clientId: client._id,
        stockId: stock._id,
        type: "buy",
        quantity,
        price: buyPrice,
        totalCost,
        profitLoss: 0,
      });

      console.log(
        `${client.name} bought ${quantity} of ${stock.stockName} at ${buyPrice}`,
      );
    } else {
      console.log(
        `${client.name} does not have enough available funds to buy ${quantity} of ${stock.stockName}.`,
      );
    }
  } catch (err) {
    console.error(`Error during buying stock: ${err.message}`);
  }
};

// Sell stock function
const sellStock = async (client, stock, quantity, sellPrice) => {
  try {
    const portfolio = await Portfolio.findOne({ clientId: client._id });
    if (!portfolio) return; // If no portfolio, return early

    const existingStock = portfolio.stocks.find(
      (s) => s.stockId.toString() === stock._id.toString(),
    );
    if (!existingStock || existingStock.quantity < quantity) return; // If no stock or insufficient quantity, return early

    // Calculate profit/loss
    const profitLoss = (sellPrice - existingStock.buyPrice) * quantity;

    existingStock.quantity -= quantity;
    existingStock.profitLoss += profitLoss;

    if (existingStock.quantity === 0) {
      existingStock.status = "Closed";
    }

    client.totalCash += quantity * sellPrice; // Update total cash on selling
    client.availableToTrade += quantity * sellPrice; // Update available to trade on selling
    client.marginUsed -= quantity * sellPrice;
    await portfolio.save();
    await client.save();

    // Record the sell transaction
    await Transaction.create({
      clientId: client._id,
      stockId: stock._id,
      type: "sell",
      quantity,
      price: sellPrice,
      totalCost: quantity * sellPrice,
      profitLoss,
    });

    console.log(
      `${client.name} sold ${quantity} of ${stock.stockName} at ${sellPrice}, P/L: ${profitLoss}`,
    );
  } catch (err) {
    console.error(`Error during selling stock: ${err.message}`);
  }
};

export default connectDB; // Call the function to connect to the database
