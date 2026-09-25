const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// PROTECTED TEST ROUTE
// ==================================================

router.get("/profile", authMiddleware, (req, res) => {

    res.status(200).json({
        message: "Protected API accessed successfully!",
        user: req.user
    });

});


module.exports = router;