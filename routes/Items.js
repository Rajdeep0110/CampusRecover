const express = require("express");

const Item = require("../models/Item");

const router = express.Router();

router.get("/", async (req, res) => {

    const items = await Item.find();

    res.render("items/index.ejs", { items });

});

module.exports = router;