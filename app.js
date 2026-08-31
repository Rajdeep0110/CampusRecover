require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded({ extended: true })); // allows Express to understand normal HTML form submissions.

const port = 8080;

// EJS setup
app.set("view engine", "ejs");

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// Import routers
const homeRouter = require("./routes/home");
const itemsRouter = require("./routes/items");

// Routes
app.use("/", homeRouter);
app.use("/items", itemsRouter);

// Start server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});