const express = require("express");

const Item = require("../models/Item");

const router = express.Router();

router.get("/", async (req, res) => {

    const items = await Item.find();

    res.render("items/index.ejs", { items });

});

router.get("/new", (req,res)=>{
    res.render("items/new.ejs");
});

router.post("/",async (req, res) => {
    const newItem = new Item(req.body);
    
    await newItem.save();

    res.redirect("/items");
})

module.exports = router;