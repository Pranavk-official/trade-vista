import axios from "axios";
import mongoose from "mongoose";
import Client from "../models/Client.js";
import Stock from "../models/Stock.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";

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
const adminCredentials = {
  userId: `${process.env.ADMIN_ID}`,
  password: `${process.env.ADMIN_PASS}`,
};
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
    console.log(error);
    console.error(`Error in simulated API call to ${endpoint}:`, error.message);
    throw error;
  }
};

const insertMockClients = async () => {
  try {
    // Loop through each mock client
    for (let client of mockClients) {
      // Create a new client via API call
      await simulateApiCall("/admin/create-user", "POST", {
        name: client.name,
        userId: client.userId,
        email: client.email,
        password: client.password,
        totalCash: client.totalCash,
      });
    }
    console.log("Mock clients created successfully.");
  } catch (error) {
    console.error("Error inserting mock clients :", error.message);
  }
};

const simulateTransactions = async () => {
  try {
    // Fetch all clients and stocks from the API
    const clientsRes = await simulateApiCall("/admin/clients", "GET");
    const stocksRes = await simulateApiCall("/admin/stocks", "GET");

    console.log(clientsRes, stocksRes);

    const clients = clientsRes;
    const stocks = stocksRes;

    if (clients.length === 0 || stocks.length === 0) {
      console.log("No clients or stocks available for transactions.");
      return;
    }

    // Divide clients into two groups: profit and loss
    const halfClients = Math.floor(clients.length / 2);
    const profitClients = clients.slice(0, halfClients);
    const lossClients = clients.slice(halfClients);

    // Loop through all clients and simulate buy and sell transactions
    for (const client of clients) {
      // const stock = stocks[Math.floor(Math.random() * stocks.length)]; // Random stock selection
      // const buyQuantity = Math.floor(Math.random() * 10) + 1; // Random quantity between 1 and 10

      // // Simulate buy for each client
      // await buyStock(client._id, stock._id, stock.price, buyQuantity);

      // // Determine if the client should have profit or loss
      // if (profitClients.includes(client)) {
      //   // Sell the stock at a higher price for profit
      //   const profitSellPrice = stock.price * 1.2; // 20% profit
      //   await sellStock(client._id, stock._id, profitSellPrice, buyQuantity);
      // } else {
      //   // Sell the stock at a lower price for loss
      //   const lossSellPrice = stock.price * 0.8; // 20% loss
      //   await sellStock(client._id, stock._id, lossSellPrice, buyQuantity);
      // }
      // Loop through all stocks
      for (const stock of stocks) {
        const buyQuantity = Math.floor(Math.random() * 10) + 1; // Random quantity between 1 and 10

        // Simulate buy for the current client and stock
        await buyStock(client._id, stock._id, stock.price, buyQuantity);

        // Determine if the client should have profit or loss
        if (profitClients.includes(client)) {
          // Sell the stock at a higher price for profit
          const profitSellPrice = stock.price * 1.2; // 20% profit
          await sellStock(client._id, stock._id, profitSellPrice, buyQuantity);
        } else {
          // Sell the stock at a lower price for loss
          const lossSellPrice = stock.price * 0.8; // 20% loss
          await sellStock(client._id, stock._id, lossSellPrice, buyQuantity);
        }
      }
    }

    console.log("Simulation of transactions completed.");
  } catch (error) {
    console.error(error);
    console.error("Error simulating transactions:", error.message);
  }
};

// Function to simulate buying a stock for a client
const buyStock = async (clientId, stockId, buyPrice, quantity) => {
  console.log({
    clientId,
    stockId,
    buyPrice,
    quantity,
  });

  try {
    const buyRes = await simulateApiCall("/admin/buy-stock", "POST", {
      clientId,
      stockId,
      buyPrice,
      quantity,
    });

    console.log(`Buy successful for client ${clientId}:`, buyRes);
  } catch (error) {
    console.error(`Error buying stock for client ${clientId}:`, error.message);
  }
};

// Function to simulate selling a stock for a client
const sellStock = async (clientId, stockId, sellPrice, quantity) => {
  console.log({
    clientId,
    stockId,
    sellPrice,
    quantity,
  });
  try {
    const sellRes = await simulateApiCall("/admin/sell-stock", "POST", {
      clientId,
      stockId,
      sellPrice,
      quantity,
    });

    console.log(`Sell successful for client ${clientId}:`, sellRes);
  } catch (error) {
    console.error(`Error selling stock for client ${clientId}:`, error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Use the following for simulating the trading for each client on the platform
    // if (conn) {
    //   await Stock.deleteMany({});
    //   await insertStocksIfEmpty();
    //   await Client.deleteMany({});
    //   await Portfolio.deleteMany({});
    //   await simulateAdminLogin();
    //   await insertMockClients();
    //   await simulateTransactions();
    // }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
