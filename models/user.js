const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    verificationOTP: {
        type: String
    },

    verificationOTPExpires: {
        type: Date
    },

    resetToken: {
        type: String
    },

    resetTokenExpiry: {
        type: Date
    }
});

module.exports = mongoose.model("User", userSchema);