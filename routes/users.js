const express = require("express");
const { UserProfile, UserAuth, Friendships } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: "Not authenticated." });
};

router.post("/:username/request", isLoggedIn, async (req, res) => {
    const { username } = req.params;
    const friend = await UserAuth.findOne({
        where: {
            username: username,
        },
    });
    console.log(req.user);

    if (!friend) res.status(400).json({ err: "This user doesn't exist" });
    else {
        if (friend.id == req.user.id) {
            res.status(400).json({ err: "This is you" });
        } else {
            try {
                const friendship = await Friendships.create({
                    status: "pending",
                    UserProfileId: req.user.id,
                    FriendId: friend.id,
                });
                res.json({ msg: "Request sent" });
            } catch (e) {
                console.log("CIAO");
                res.status(400).json({ err: "Request already sent" });
            }
        }
    }
});

router.get("/notifications", isLoggedIn, async (req, res) => {
    const id = req.user.id;
    try {
        const pending = await Friendships.findAll({
            where: {
                status: "pending",
                FriendId: id,
            },
        });
        //console.log(pending);

        res.json(pending.length);
    } catch (e) {
        res.status(400).json({ err: e });
    }
});

router.get("/friend-requests", isLoggedIn, async (req, res) => {
    const id = req.user.id;
    try {
        const pending = await Friendships.findAll({
            where: {
                status: "pending",
                FriendId: id,
            },
        });

        const users = await Promise.all(
            pending.map(
                async (p) =>
                    await UserProfile.findOne({
                        attributes: ["profilePicture"],
                        include: {
                            model: UserAuth,
                            attributes: ["username"],
                        },
                        where: {
                            id: p.dataValues.id,
                        },
                    })
            )
        );
        console.log(users);

        res.json(users);
    } catch (e) {
        res.status(400).json({ err: e });
    }
});

module.exports = router;
