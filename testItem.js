require("dotenv").config();

const mongoose = require("mongoose");
const Item = require("./models/Item");

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("Connected to MongoDB");

        const newItem = new Item({
            title: "Black Water Bottle",
            description: "Black water bottle with a silver cap",
            category: "Bottle",
            type: "Lost",
            location: "Central Library",
            date: new Date()
        });

        await newItem.save();

        console.log("Item saved successfully");
        console.log(newItem);

        await mongoose.connection.close();
    })
    .catch((err) => {
        console.log("Error:", err);
    });