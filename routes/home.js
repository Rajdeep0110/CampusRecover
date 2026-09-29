const express = require("express");
const Item = require("../models/Item");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const items = await Item.find({})
            .sort({ createdAt: -1 })
            .limit(3);

        res.render("home.ejs", {
            items,
            page: "home"
        });
    } catch (err) {
        console.error("Error fetching home items:", err.message);
        res.render("home.ejs", {
            items: [],
            page: "home"
        });
    }
});

module.exports = router;