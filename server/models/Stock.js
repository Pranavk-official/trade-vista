import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    stockName: {
      type: String,
      required: true,
    },
    stockSymbol: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
