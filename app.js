require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session Configuration
const sessionSecret = process.env.SESSION_SECRET || "campusrecover_fallback_secret";
const mongoUrl = process.env.MONGO_URL;

const sessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

if (mongoUrl) {
    sessionOptions.store = MongoStore.create({
        mongoUrl: mongoUrl,
        ttl: 14 * 24 * 60 * 60
    });
} else {
    console.warn("⚠️ MONGO_URL not set in environment. Using default in-memory session store.");
}

app.use(session(sessionOptions));

// Current User
app.use((req, res, next) => {
    res.locals.currUser = req.session ? req.session.user : null;
    next();
});

// EJS View Engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");

// Health check endpoint for Render
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Routers
const homeRouter = require("./routes/home");
const itemsRouter = require("./routes/items");
const authRouter = require("./routes/auth");

app.use("/", homeRouter);
app.use("/items", itemsRouter);
app.use("/", authRouter);

// Database Connection
if (mongoUrl) {
    mongoose
        .connect(mongoUrl)
        .then(() => console.log("✅ Connected to MongoDB"))
        .catch((err) => console.error("❌ MongoDB connection error:", err.message));
} else {
    console.error("❌ CRITICAL: MONGO_URL environment variable is missing! Please set MONGO_URL in Render Dashboard -> Environment.");
}

// Start Server immediately so Render health checks pass and no 502 Bad Gateway occurs
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${port}`);
});