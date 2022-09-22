const express = require("express");
const app = express();
const path = require("path");
const appError = require("./appError");
const mongoose = require("mongoose");
// const { v4: uuid } = require("uuid");
// uuid();
//We install method-override to make an overridden request.
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const Product = require("../models/product");
const morgan = require("morgan");
app.use(morgan("tiny"));

mongoose
  .connect("mongodb://localhost:27017/cornerStore", {
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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Helps us with our post request for our FORMMMM,
//to not return undefined
app.use(express.urlencoded({ extended: true }));

const categories = ["Fruits", "Vegetables", "Dairy", "Meats", "Frozen"];

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

//Pattern to wait for mongoose to load data.
app.get(
  "/products",
  wrapAsync(async (req, res, next) => {
    //Find everything
    const products = await Product.find({});
    //   console.log(products);
    //   res.send("All products!");
    res.render("../products/index", { products });
  })
);

//////////////////////////////////
//FORMMMMMMM
app.get(
  "/products/new",
  wrapAsync((req, res, next) => {
    res.render("../products/new");
  })
);
app.post(
  "/products",
  wrapAsync(async (req, res, next) => {
    //   res.render("../products/new", { products });
    const newProduct = new Product(req.body);
    await newProduct.save();
    //   console.log(req.body);
    //   console.log(newProduct);
    //   res.send("creating product now!");
    res.redirect(`../products/${newProduct._id}`);
  })
);
//////////////////////////////////
app.get(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    Product.findById(id);
    const product = await Product.findById(id);
    //   res.send("details page");
    res.render("../products/show", { product });
  })
);

app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("../products/edit", { product });
  })
);
//put/patch to UPDATE the values.
app.put(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    //   console.log(req.body);
    //   res.send("PUT DONE");
    res.redirect(`../products/${product._id}`);
  })
);

app.delete(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    //   res.send("deleted");
    res.redirect("../products");
  })
);

app.get(
  "/dog",
  wrapAsync((req, res, next) => {
    res.send("woof");
  })
);

const handleCastError = (err) => {
  console.log("We have a CastError");
  console.dir(err);
  //To make sure it is used in the next()
  //in our error handling middleware.
  return err;
};

const handleValidationError = (err) => {
  console.log("We have a CastError");
  console.dir(err);
  return new appError(`Validation failed due to --> ${err.message}`, 400);
};

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err === "CastError") {
    err = handleCastError(err);
  } else if (err === "ValidationError") {
    err = handleValidationError(err);
  }
  next(err);
});

// app.use((err, req, res, next) => {
//   const { status = 401 } = err;
//   res.status(status).send("SOMETHING WENT WRONG");
// });

app.listen(3000, () => {
  console.log("App is active on port 3000");
});
