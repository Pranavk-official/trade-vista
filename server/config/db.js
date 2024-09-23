import mongoose from "mongoose";

import Stock from "../models/Stock.js";

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
    availableQuantity: 10,
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
    // Check if the stocks collection exists and has documents
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

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    await insertStocksIfEmpty();
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export default connectDB;
