const express = require("express");
const multer = require("multer");

const Item = require("../models/Item");
const itemValidation = require("../models/itemValidation");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.get("/", async (req, res) => {

    const { search, type } = req.query;

    let query = {};

    if (search) {
        query.title = {
            $regex: search,
            $options: "i"
        };
    }

    if (type) {
        query.type = type;
    }

    const items = await Item.find(query);

    res.render("items/index.ejs", {
        items,
        search: search || "",
        type: type || "",
        page: "items"
    });

});

router.get("/new", (req, res) => {

    res.render("items/new.ejs", {
        error: null,
        formData: {},
        page: "items"
    });

});

router.post("/", upload.single("image"), async (req, res) => {

    const { error } = itemValidation.validate(req.body);

    if (error) {
        return res.status(400).render("items/new.ejs", {
            error: error.details[0].message,
            formData: req.body,
            page: "items"
        });
    }

    let image = "";

    if (req.file) {
        image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    const newItem = new Item({
        ...req.body,
        image
    });

    await newItem.save();

    res.redirect("/items");

});

router.get("/:id/edit", async (req, res) => {

    const item = await Item.findById(req.params.id);

    res.render("items/edit.ejs", {
        item,
        error: null,
        formData: {},
        page: "items"
    });

});

router.post("/:id/update", async (req, res) => {

    const { error } = itemValidation.validate(req.body);

    if (error) {

        const item = await Item.findById(req.params.id);

        return res.status(400).render("items/edit.ejs", {
            item,
            error: error.details[0].message,
            formData: req.body,
            page: "items"
        });
    }

    await Item.findByIdAndUpdate(req.params.id, req.body);

    res.redirect(`/items/${req.params.id}`);

});

router.post("/:id/delete", async (req, res) => {

    await Item.findByIdAndDelete(req.params.id);

    res.redirect("/items");

});

router.get("/:id", async (req, res) => {

    const item = await Item.findById(req.params.id);

    res.render("items/show.ejs", {
        item,
        page: "show"
    });

});

module.exports = router;