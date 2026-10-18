const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");

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
    // Option to clear verification and start over
    if (req.query.reset === "true") {
        delete req.session.pendingSignup;
        return req.session.save(() => res.redirect("/signup"));
    }

    const pending = req.session.pendingSignup;

    // If email has already been verified in this session, show Step 2 (enter name and password)
    if (pending && pending.verified) {
        return res.render("auth/signup", {
            page: "signup",
            step: "details",
            verifiedEmail: pending.email,
            error: null
        });
    }

    // Step 1: Request email to send OTP
    res.render("auth/signup", {
        page: "signup",
        step: "email",
        email: (pending && pending.email) || "",
        error: null
    });
});

// Handle signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : "";
        const pending = req.session.pendingSignup;

        // Flow Step 3 & 4: User submits password and existing signup details (Username)
        if (name !== undefined || password !== undefined) {
            // STRICT ENFORCEMENT: Account cannot be created until email OTP has been successfully verified!
            if (!pending || !pending.verified || pending.email !== normalizedEmail) {
                return res.status(400).render("auth/signup", {
                    page: "signup",
                    step: "email",
                    email: normalizedEmail,
                    error: "Email verification is required before creating an account."
                });
            }

            if (!name || !name.trim() || !password) {
                return res.status(400).render("auth/signup", {
                    page: "signup",
                    step: "details",
                    verifiedEmail: pending.email,
                    error: "Please enter both a username and password."
                });
            }

            // Check if email already registered
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser && existingUser.isEmailVerified !== false) {
                delete req.session.pendingSignup;
                return res.render("auth/signup", {
                    page: "signup",
                    step: "email",
                    email: normalizedEmail,
                    error: "This email address is already registered. Please log in."
                });
            }

            // Clean up any legacy unverified dummy record
            if (existingUser && existingUser.isEmailVerified === false) {
                await User.deleteOne({ _id: existingUser._id });
            }

            // Create account now that email OTP has been verified
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                isEmailVerified: true
            });
            await newUser.save();

            // Clear pending signup session
            delete req.session.pendingSignup;
            return req.session.save((err) => {
                if (err) console.error("Session save error:", err);
                res.redirect("/login");
            });
        }

        // Flow Step 1: User enters Gmail address to initiate signup and receive OTP
        if (!normalizedEmail) {
            return res.render("auth/signup", {
                page: "signup",
                step: "email",
                email: "",
                error: "Please enter your email address."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.render("auth/signup", {
                page: "signup",
                step: "email",
                email: normalizedEmail,
                error: "Please enter a valid email address."
            });
        }

        // Check if user is already registered
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser && existingUser.isEmailVerified !== false) {
            return res.render("auth/signup", {
                page: "signup",
                step: "email",
                email: normalizedEmail,
                error: "This email address is already registered. Please log in."
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOTP = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        req.session.pendingSignup = {
            email: normalizedEmail,
            otp: hashedOTP,
            expires: otpExpiry,
            verified: false
        };

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: normalizedEmail,
                subject: "Verify Your CampusRecover Account",
                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 30px;
                    ">
                        <h2 style="color: #216cff;">CampusRecover</h2>
                        <h3>Email Verification</h3>
                        <p>Thank you for signing up for CampusRecover. Please use the following One-Time Password (OTP) to verify your email address:</p>
                        <div style="
                            background: #f0f4ff;
                            padding: 15px 25px;
                            font-size: 28px;
                            font-weight: 800;
                            letter-spacing: 5px;
                            color: #216cff;
                            border-radius: 8px;
                            display: inline-block;
                            margin: 15px 0;
                        ">${otp}</div>
                        <p style="margin-top: 20px;">This OTP is valid for 10 minutes.</p>
                        <p>If you did not sign up for a CampusRecover account, you can safely ignore this email.</p>
                    </div>
                `
            });
        } catch (mailError) {
            console.error("Nodemailer send error:", mailError);
            return res.render("auth/signup", {
                page: "signup",
                step: "email",
                email: normalizedEmail,
                error: "Unable to send verification email. Please check your email address and try again."
            });
        }

        req.session.save((err) => {
            if (err) console.error("Session save error:", err);
            res.redirect(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Something went wrong.");
    }
});

// Flow Step 2: Verify email page
router.get("/verify-email", (req, res) => {
    const queryEmail = req.query.email ? req.query.email.toLowerCase().trim() : "";
    const sessionEmail = req.session.pendingSignup ? req.session.pendingSignup.email : "";
    const email = queryEmail || sessionEmail;

    if (!email && !req.session.pendingSignup) {
        return res.redirect("/signup");
    }

    res.render("auth/verify-email", {
        page: "verify-email",
        email: email,
        error: null,
        success: null
    });
});

// Flow Step 2: Handle email OTP verification
router.post("/verify-email", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : "";
        const pending = req.session.pendingSignup;

        if (!normalizedEmail || !otp) {
            return res.render("auth/verify-email", {
                page: "verify-email",
                email: normalizedEmail,
                error: "Please enter the 6-digit verification code.",
                success: null
            });
        }

        if (!pending || pending.email !== normalizedEmail) {
            return res.render("auth/verify-email", {
                page: "verify-email",
                email: normalizedEmail,
                error: "No active verification session found. Please enter your email to get a new code.",
                success: null
            });
        }

        if (Date.now() > pending.expires) {
            return res.render("auth/verify-email", {
                page: "verify-email",
                email: normalizedEmail,
                error: "The verification code has expired. Please request a new OTP.",
                success: null
            });
        }

        const hashedOTP = crypto
            .createHash("sha256")
            .update(otp.trim())
            .digest("hex");

        if (hashedOTP !== pending.otp) {
            return res.render("auth/verify-email", {
                page: "verify-email",
                email: normalizedEmail,
                error: "Invalid verification code. Please check your email and try again.",
                success: null
            });
        }

        // OTP verified successfully!
        pending.verified = true;
        delete pending.otp;
        delete pending.expires;

        req.session.save((err) => {
            if (err) console.error("Session save error:", err);
            // Proceed to Step 3: Entering password and existing signup details
            res.redirect("/signup");
        });

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).send("Something went wrong.");
    }
});

// Resend verification OTP
router.post("/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : "";

        if (!normalizedEmail) {
            return res.render("auth/verify-email", {
                page: "verify-email",
                email: "",
                error: "Please provide an email address.",
                success: null
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser && existingUser.isEmailVerified !== false) {
            return res.redirect("/login");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOTP = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        req.session.pendingSignup = {
            email: normalizedEmail,
            otp: hashedOTP,
            expires: otpExpiry,
            verified: false
        };

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: normalizedEmail,
                subject: "Your New CampusRecover Verification OTP",
                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 30px;
                    ">
                        <h2 style="color: #216cff;">CampusRecover</h2>
                        <h3>New Verification Code</h3>
                        <p>We received a request to resend your verification OTP. Please use the code below:</p>
                        <div style="
                            background: #f0f4ff;
                            padding: 15px 25px;
                            font-size: 28px;
                            font-weight: 800;
                            letter-spacing: 5px;
                            color: #216cff;
                            border-radius: 8px;
                            display: inline-block;
                            margin: 15px 0;
                        ">${otp}</div>
                        <p style="margin-top: 20px;">This OTP is valid for 10 minutes.</p>
                    </div>
                `
            });
        } catch (mailError) {
            console.error("Resend mail error:", mailError);
            return res.render("auth/verify-email", {
                page: "verify-email",
                email: normalizedEmail,
                error: "Unable to resend OTP. Please check your email address and try again.",
                success: null
            });
        }

        req.session.save((err) => {
            if (err) console.error("Session save error:", err);
            res.render("auth/verify-email", {
                page: "verify-email",
                email: normalizedEmail,
                error: null,
                success: "A new OTP has been sent to your email."
            });
        });

    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).send("Unable to resend OTP.");
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
        const normalizedEmail = email ? email.toLowerCase().trim() : "";

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.render("auth/login", {
                page: "login",
                error: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render("auth/login", {
                page: "login",
                error: "Invalid email or password."
            });
        }

        if (user.isEmailVerified === false) {
            return res.render("auth/login", {
                page: "login",
                error: "Please verify your email before logging in."
            });
        }

        req.session.user = user;

        res.redirect("/items");

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Something went wrong.");
    }
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/items");
    });
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