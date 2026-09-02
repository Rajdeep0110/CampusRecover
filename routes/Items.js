const express = require("express");

const Item = require("../models/Item");
const itemValidation = require("../models/itemValidation");

const router = express.Router();

router.get("/", async (req, res) => {

const items = await Item.find();

res.render("items/index.ejs", { items });


});

router.get("/new", (req, res) => {
res.render("items/new.ejs");
});

router.post("/", async (req, res) => {


const { error } = itemValidation.validate(req.body);

if (error) {
    return res.status(400).send(error.details[0].message);
}

const newItem = new Item(req.body);

await newItem.save();

res.redirect("/items");


});

router.get("/:id", async (req, res) => {


const item = await Item.findById(req.params.id);

res.render("items/show.ejs", { item });


});

module.exports = router;
