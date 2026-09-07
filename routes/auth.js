const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Signup page
router.get("/signup", (req, res) => {
    res.render("auth/signup", { page: "signup" });
});

// Login page
router.get("/login", (req, res) => {
    res.render("auth/login", { page: "login" });
});

// Handle signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("Email already registered.");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.redirect("/login");

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong.");
    }
});

module.exports = router;