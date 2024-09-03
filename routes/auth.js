const express = require("express");
const router = express.Router();
const { UserAuth, UserProfile } = require("../models");
const { signUpSchema } = require("../utils/zodSchemas.js");
const { hashPassword } = require("../utils/misc.js");
const passport = require("passport");

router.post("/register", async (req, res) => {
    const user = signUpSchema.safeParse(req.body);
    if (user.success) {
        try {
            const hashed = await hashPassword(user.data.password);
            const userLogin = await UserAuth.create({
                email: user.data.email,
                username: user.data.username,
                passwordHash: hashed,
            });
            const profile = await UserProfile.create({
                UserAuthId: userLogin.id,
            });
            res.status(200).json({
                msg: "User registered",
                email: userLogin.email,
                username: userLogin.username,
                id: userLogin.id,
            });
        } catch (e) {
            if (e.errors) {
                console.log(e.errors[0].message);
                res.status(400).json({ err: e.errors[0].message });
            } else {
                console.log(e);
                res.status(400).json({ err: e });
            }
        }

        //res.json(user.data);
    } else {
        console.log(user.error);
        res.status(400).json({ err: "Input not valid" });
    }
});

router.post("/login", function (req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            //in case the user is empty
            return res.status(401).json(info);
        }

        req.login(user, (err) => {
            if (err) return next(err);

            return res.json(req.user);
        });
    })(req, res, next);
});

router.delete("/logout", (req, res) => {
    req.logout(() => {
        res.end();
    });
});

module.exports = router;
