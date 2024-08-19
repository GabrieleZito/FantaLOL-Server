const express = require("express");
const router = express.Router();
const { UserAuth } = require("../models/userAuth.js");
const { UserProfile } = require("../models/userProfile.js");
const { signUpSchema } = require("../utils/zodSchemas.js");
const { hashPassword } = require("../utils/misc.js");

router.post("/register", async (req, res) => {
    const user = signUpSchema.safeParse(req.body);
    if (user.success) {
        try {
            const hashed = await hashPassword(user.data.password);
            const userLogin = await UserAuth.create({
                email: user.data.email,
                username: user.data.username,
                passwordHash: hashed,
                salt: "salt",
            });
            const profile = await UserProfile.create({
                userId: userLogin.id,
            });
            res.status(200).json({
                msg: "User registered",
                email: userLogin.email,
                username: userLogin.username,
                firstName: profile.firstName ? profile.firstName : "",
                lastName: profile.lastName ? profile.lastName : "",
                birthDay: profile.birthDay ? profile.birthDay : "",
                bio: profile.bio ? profile.bio : "",
                profilePicture: profile.profilePicture
                    ? profile.profilePicture
                    : "",
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

module.exports = router;
