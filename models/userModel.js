const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userModel = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    phone: String,
    avatar: {
        type: String,
        default: "dummy.png",
    },
});

userModel.plugin(plm);

const user = mongoose.model("user", userModel);
module.exports = user;
