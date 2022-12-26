var express = require("express");
var router = express.Router();

const User = require("../models/userModel");
const LocalStrategy = require("passport-local");
const passport = require("passport");

passport.use(new LocalStrategy(User.authenticate()));

router.get("/", function (req, res, next) {
    res.render("index");
});

router.post("/register", function (req, res, next) {
    const { name, email, username, password, phone } = req.body;
    const newUser = new User({
        name,
        email,
        username,
        phone,
    });

    User.register(newUser, password)
        .then(() => res.send("User Registerd"))
        .catch((err) => res.send(err));
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/",
    }),
    function (req, res, next) {}
);

router.post("/forget", function (req, res, next) {
    User.findOne({ username: req.body.username })
        .then((userFound) => {
            if (userFound === null)
                return res.send("not found <a href='/'>home</a>");

            userFound.setPassword(req.body.password, function (err, user) {
                userFound.save();
                res.redirect("/");
            });
        })
        .catch((err) => res.send(err));
});

router.get("/profile", isLoggedIn, function (req, res, next) {
    res.render("profile", { user: req.session.passport.user });
});

router.post("/reset", isLoggedIn, function (req, res, next) {
    const { oldpassword, password } = req.body;
    req.user.changePassword(oldpassword, password, function (err, user) {
        if (err) {
            res.send(err);
        }
        res.redirect("/logout");
    });
});

router.get("/logout", isLoggedIn, function (req, res, next) {
    req.logout(function () {
        res.redirect("/");
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    res.redirect("/");
}

module.exports = router;
