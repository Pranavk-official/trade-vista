import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    totalCash: {
      type: Number,
      default: 0,
    },
    availableToTrade: {
      type: Number,
      default: 0,
    },
    marginUsed: {
      type: Number,
      default: 0,
    },
    recentTransactions: [
      {
        stockName: String,
        buyPrice: Number,
        sellPrice: Number,
        profitLoss: Number,
        date: Date,
      },
    ],
    positions: [
      {
        stockName: String,
        status: { type: String, enum: ["Open", "Closed"] },
        closeRate: Number,
        profitLoss: Number,
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
