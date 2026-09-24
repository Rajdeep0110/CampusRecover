require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

if (!process.env.MONGO_URL) {
    console.error("⚠️ WARNING: MONGO_URL environment variable is not defined! Set MONGO_URL in Render Dashboard Environment settings.");
}

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_fallback_secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/campusRecover"
        }),
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        }
    })
);

// Current User
app.use((req, res, next) => {
    res.locals.currUser = req.session.user;
    next();
});

// EJS
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");

// MongoDB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Routers
const homeRouter = require("./routes/home");
const itemsRouter = require("./routes/items");
const authRouter = require("./routes/auth");

app.use("/", homeRouter);
app.use("/items", itemsRouter);
app.use("/", authRouter);

// Server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});