const express = require("express");

const router = express.Router();

router.get("/",(req, res)=>{
    res.send("All lost and found items");
});

module.exports = router;