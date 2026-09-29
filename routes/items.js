const express = require("express");
const multer = require("multer");

const Item = require("../models/Item");
const itemValidation = require("../models/itemValidation");

const router = express.Router();

const { storage, processImageUpload } = require("../cloudConfig");

const upload = multer({ storage: storage });

// Helper middleware for Multer error handling
const handleUpload = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            console.error("Multer upload middleware error:", err);
            req.uploadError = err.message || "File upload failed";
        }
        next();
    });
};

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
};

// Middleware to check if current logged in user is the owner of the item
const isOwner = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send("Item not found");
        }
        if (!item.owner || item.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).send("You do not have permission to modify this item.");
        }
        next();
    } catch (err) {
        console.error("Authorization check error:", err);
        res.status(500).send("Error verifying permissions");
    }
};


// ===============================
// GET ALL ITEMS + SEARCH/FILTER
// ===============================
router.get("/", async (req, res) => {
    try {
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
            items: items,
            search: search || "",
            type: type || "",
            page: "items"
        });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Error fetching items");
    }
});


// ===============================
// SHOW NEW ITEM FORM
// ===============================
router.get("/new", isLoggedIn, (req, res) => {
    res.render("items/new.ejs", {
        error: null,
        formData: {},
        page: "items"
    });
});


// ===============================
// CREATE NEW ITEM
// ===============================
router.post("/", isLoggedIn, handleUpload, async (req, res) => {
    try {
        if (req.uploadError) {
            return res.status(400).render("items/new.ejs", {
                error: "Image upload error: " + req.uploadError,
                formData: req.body,
                page: "items"
            });
        }

        const { error } = itemValidation.validate(req.body);

        if (error) {
            return res.status(400).render("items/new.ejs", {
                error: error.details[0].message,
                formData: req.body,
                page: "items"
            });
        }

        const imageUrl = await processImageUpload(req);

        const newItem = new Item({
            ...req.body,
            image: imageUrl,
            owner: req.session.user._id
        });

        await newItem.save();

        res.redirect("/items");
    } catch (err) {
        console.error("Error creating item:", err);
        return res.status(400).render("items/new.ejs", {
            error: err.message || "Failed to create item",
            formData: req.body,
            page: "items"
        });
    }
});


// ===============================
// SHOW EDIT FORM
// ===============================
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).send("Item not found");
        }

        res.render("items/edit.ejs", {
            item: item,
            error: null,
            formData: {},
            page: "items"
        });
    } catch (err) {
        console.error("Error loading edit form:", err);
        res.status(500).send("Error loading item edit page");
    }
});


// ===============================
// UPDATE ITEM
// ===============================
router.post("/:id/update", isLoggedIn, isOwner, handleUpload, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send("Item not found");
        }

        if (req.uploadError) {
            return res.status(400).render("items/edit.ejs", {
                item: item,
                error: "Image upload error: " + req.uploadError,
                formData: req.body,
                page: "items"
            });
        }

        const { error } = itemValidation.validate(req.body);

        if (error) {
            return res.status(400).render("items/edit.ejs", {
                item: item,
                error: error.details[0].message,
                formData: req.body,
                page: "items"
            });
        }

        let updatedData = { ...req.body };

        if (req.file) {
            const imageUrl = await processImageUpload(req);
            updatedData.image = imageUrl;
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.redirect(`/items/${req.params.id}`);
    } catch (err) {
        console.error("Error updating item:", err);
        const item = await Item.findById(req.params.id).catch(() => null);
        return res.status(400).render("items/edit.ejs", {
            item: item || { _id: req.params.id },
            error: err.message || "Failed to update item",
            formData: req.body,
            page: "items"
        });
    }
});


// ===============================
// DELETE ITEM
// ===============================
router.post("/:id/delete", isLoggedIn, isOwner, async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).send("Item not found");
        }

        res.redirect("/items");
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Error deleting item");
    }
});


// ===============================
// SHOW SINGLE ITEM
// ===============================
router.get("/:id", async (req, res) => {

    const item = await Item.findById(req.params.id).populate("owner");

    if (!item) {
        return res.status(404).send("Item not found");
    }

    res.render("items/show.ejs", {
        item: item,
        page: "show"
    });

});


module.exports = router;