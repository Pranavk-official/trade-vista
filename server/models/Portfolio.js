import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    stocks: [
      {
        stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
        quantity: Number,
        buyPrice: Number,
        sellPrice: Number,
        status: { type: String, enum: ["Open", "Closed"] },
        profitLoss: Number,
      },
    ],
  },
  { timestamps: true },
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
