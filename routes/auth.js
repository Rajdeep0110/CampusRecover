const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Signup page
router.get("/signup", (req, res) => {
    res.render("auth/signup", {
        page: "signup"
    });
});

// Handle signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("Email already registered.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

// Login page
router.get("/login", (req, res) => {
    res.render("auth/login", {
        page: "login"
    });
});

// Handle login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("Invalid email or password.");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Invalid email or password.");
        }

        res.redirect("/items");

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong.");
    }
});

// Forgot password page
router.get("/forgot-password", (req, res) => {
    res.render("auth/forgot-password", {
        page: "forgot-password"
    });
});

// Handle forgot password
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("No account found with this email.");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetLink =
            `http://localhost:8080/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reset Your CampusRecover Password",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                ">

                    <h2 style="color: #216cff;">
                        CampusRecover
                    </h2>

                    <h3>
                        Reset Your Password
                    </h3>

                    <p>
                        We received a request to reset your CampusRecover password.
                    </p>

                    <p>
                        Click the button below to create a new password.
                    </p>

                    <a
                        href="${resetLink}"
                        style="
                            display: inline-block;
                            padding: 12px 22px;
                            background: #216cff;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: 600;
                        "
                    >
                        Reset Password
                    </a>

                    <p style="margin-top: 25px;">
                        This link will expire in 15 minutes.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                </div>
            `
        });

        res.send("Password reset link sent successfully.");

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to send reset email.");
    }
});

// Reset password page
router.get("/reset-password/:token", async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.send("Reset link is invalid or has expired.");
        }

        res.render("auth/reset-password", {
            page: "reset-password",
            token: req.params.token
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong.");
    }
});

// Handle reset password
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.send("Passwords do not match.");
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.send("Reset link is invalid or has expired.");
        }

        user.password = await bcrypt.hash(password, 10);

        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.redirect("/login");

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong.");
    }
});

module.exports = router;