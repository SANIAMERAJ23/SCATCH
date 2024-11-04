const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIN");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function (req, res){
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async function (req, res) {
    try {
        const products = await productModel.find();

        const error = req.flash("error") || '';
        const success = req.flash("success") || '';

        res.render("shop", { products, error, success });
    } catch (err) {
        console.error("Error loading shop:", err);
        req.flash("error", "Could not load products");
        res.redirect("/");
    }
});


router.get("/cart", isLoggedIn, async function (req, res) {
    let user = await userModel
       .findOne({ email: req.user.email })
       .populate("cart");
    
    let bill = 0;
    if (user.cart && user.cart.length > 0)
    {
        bill = Number(user.cart[0].price) + 20 - Number(user.cart[0].discount);
    }
    else {
        console.log("Cart is empty or undefined.");
    }
    

    res.render("cart", { user, bill });
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        if (!user.cart) {
            user.cart = [];
        }
        
        if (!user.cart.includes(req.params.productid)) {  
            user.cart.push(req.params.productid);
            await user.save();
            req.flash("success", "Added to cart");
        } else {
            req.flash("info", "Item already in cart");
        }

        res.redirect("/shop");
    } catch (err) {
        console.error("Error adding to cart:", err);
        req.flash("error", "Could not add to cart");
        res.redirect("/shop");
    }
});


router.get("/logout", isLoggedIn, function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});


module.exports = router;