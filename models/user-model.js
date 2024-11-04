const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "product",
        default: []
    },
    
    orders: {
        type: Array,
        default: []
    },
    contact: Number,
    picture: String
});

module.exports = mongoose.model("user", userSchema);