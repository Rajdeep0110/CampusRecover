const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    location: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;