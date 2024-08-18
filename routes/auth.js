const express = require("express");
const router = express.Router();
const { UserAuth } = require("../models/userAuth.js");
const { UserProfile } = require("../models/userProfile.js");
const { signUpSchema } = require("../zodSchemas.js");

router.post("/register", async (req, res) => {
    const user = signUpSchema.safeParse(req.body);
    if (user.success) {
        try {
            const userLogin = await UserAuth.create({
                email: user.data.email,
                username: user.data.username,
                passwordHash: user.data.password,
                salt: "234114",
            });
            const profile = await UserProfile.create({
                userId: userLogin.id
            })
            res.status(200).json({msg: "User registered"})
        } catch (e) {
            console.log(e.errors[0].message);
            res.status(400).json({ err: e.errors[0].message });
        }

        //res.json(user.data);
    } else {
        console.log(user.error);
        res.status(400).json({ err: "Input not valid" });
    }
});

module.exports = router;
