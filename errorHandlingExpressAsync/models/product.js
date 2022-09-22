const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, "A price is required!"],
    min: 0,
  },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruits", "vegetables", "dairy"],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
