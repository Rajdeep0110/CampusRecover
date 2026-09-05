require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// EJS
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");

// MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("MongoDB connection error:", err));

// Routers
const homeRouter = require("./routes/home");
const itemsRouter = require("./routes/items");

app.use("/", homeRouter);
app.use("/items", itemsRouter);

// Server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});