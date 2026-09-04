const express = require("express");

const Item = require("../models/Item");
const itemValidation = require("../models/itemValidation");

const router = express.Router();

router.get("/", async (req, res) => {

    const items = await Item.find();

    res.render("items/index.ejs", { items });

});

router.get("/new", (req, res) => {

    res.render("items/new.ejs", {
        error: null,
        formData: {}
    });

});

router.post("/", async (req, res) => {

    const { error } = itemValidation.validate(req.body);

    if (error) {
        return res.status(400).render("items/new.ejs", {
            error: error.details[0].message,
            formData: req.body
        });
    }

    const newItem = new Item(req.body);

    await newItem.save();

    res.redirect("/items");

});

router.get("/:id/edit", async (req, res) => {

    const item = await Item.findById(req.params.id);

    res.render("items/edit.ejs", { item });

});

router.post("/:id/update", async (req, res) => {

    const { error } = itemValidation.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    await Item.findByIdAndUpdate(req.params.id, req.body);

    res.redirect(`/items/${req.params.id}`);

});

router.get("/:id", async (req, res) => {

    const item = await Item.findById(req.params.id);

    res.render("items/show.ejs", { item });

});

module.exports = router;