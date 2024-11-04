const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIN");
const {registerUser, loginUser, logout} = require("../controllers/authController");

router.get("/", function (req, res) {
    res.send("hey");
});


router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logout);

module.exports = router;