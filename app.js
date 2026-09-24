require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const app = express();

// Render provides PORT automatically
const port = process.env.PORT || 8080;

// ===============================
// Middleware
// ===============================

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ===============================
// Environment Variables Check
// ===============================

if (!process.env.MONGO_URL) {
    console.error("❌ MONGO_URL is not defined.");
    console.error("Please add MONGO_URL in Render → Environment.");
    process.exit(1);
}

if (!process.env.SESSION_SECRET) {
    console.error("❌ SESSION_SECRET is not defined.");
    console.error("Please add SESSION_SECRET in Render → Environment.");
    process.exit(1);
}

// ===============================
// Session
// ===============================

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL
        }),

        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        }
    })
);

// ===============================
// Current User
// ===============================

app.use((req, res, next) => {
    res.locals.currUser = req.session.user;
    next();
});

// ===============================
// EJS
// ===============================

app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");

// ===============================
// Routers
// ===============================

const homeRouter = require("./routes/home");
const itemsRouter = require("./routes/items");
const authRouter = require("./routes/auth");

app.use("/", homeRouter);
app.use("/items", itemsRouter);
app.use("/", authRouter);

// ===============================
// MongoDB + Server
// ===============================

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("✅ Connected to MongoDB");

        // IMPORTANT FOR RENDER
        app.listen(port, "0.0.0.0", () => {
            console.log(`🚀 CampusRecover is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:");
        console.error(err);
        process.exit(1);
    });