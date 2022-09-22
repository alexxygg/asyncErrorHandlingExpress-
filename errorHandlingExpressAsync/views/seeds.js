const mongoose = require("mongoose");

const Product = require("../models/product");

// const { v4: uuid } = require("uuid");
// uuid();

mongoose
  .connect("mongodb://localhost:27017/cornerStore2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION FAILED");
    console.log(err);
  });

//This file helps us isolate from the index.js

const p = new Product({
  name: "Kiwi",
  price: 20,
  category: "fruits",
});
p.save();

const seedProducts = [
  {
    name: "Apple",
    price: 12,
    category: "fruits",
  },
  {
    name: "Banana",
    price: 8,
    category: "fruits",
  },
  {
    name: "Orange",
    price: 8,
    category: "fruits",
  },
  {
    name: "Avocado",
    price: 45,
    category: "vegetables",
  },
  {
    name: "Carrots",
    price: 20,
    category: "vegetables",
  },
];
// If any does not pass validation, none of them will be inserted!
Product.insertMany(seedProducts)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
