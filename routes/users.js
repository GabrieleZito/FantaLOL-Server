const express = require("express");
const { UserProfile, Friendships } = require("../models");
const router = express.Router();
const db = require("../database.js");

const isLoggedIn = (req, res, next) => {
    //console.log("User: ");
    //console.log(req.user);
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: "Not authenticated." });
};

router.post("/:username/request", isLoggedIn, async (req, res) => {
    const { username } = req.params;
    const friend = await UserProfile.findOne({
        where: {
            username: username,
        },
    });
    //console.log(req.user);

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
                //console.log("CIAO");
                res.status(400).json({ err: "Request already sent" });
            }
        }
    }
});

router.get("/notifications", isLoggedIn, async (req, res) => {
    const id = req.user.id;
    try {
        const result = await db.getNotifications(id);

        res.json(result);
    } catch (e) {
        res.status(400).json({ err: e });
    }
});

router.get("/friend-requests", isLoggedIn, async (req, res) => {
    const id = req.user.id;
    //console.log(id);

    try {
        const users = await db.getFriendRequests(id);
        //console.log(users);

        res.json(users);
    } catch (e) {
        res.status(400).json({ err: e });
    }
});

router.post("/acceptFriend", isLoggedIn, async (req, res) => {
    const idUser = req.user.id;
    const idFriend = req.body.id;
    try {
        const x = await db.acceptFriendRequest(idUser, idFriend);
        res.json(x);
    } catch (error) {
        res.status(400).json({ err: error });
    }

    //console.log(idFriend);
});

router.get("/friends", isLoggedIn, async (req, res) => {
    const id = req.user.id;

    try {
        const friends = await db.getFriends(id);
        //console.log(friends);

        res.json(friends);
    } catch (e) {
        res.status(400).json({ err: e });
    }
});

router.post("/send-invite", isLoggedIn, async (req, res) => {
    const id = req.user.id;

    try {
        //console.log({ body: req.body, id: id });
        const result = await db.sendInvite({ body: req.body, id: id });
        //console.log(result);
        res.json(result);
    } catch (error) {
        console.log(error);

        res.status(400).json({ err: error });
    }
});

router.get("/invites", isLoggedIn, async (req, res) => {
    const id = req.user.id;
    try {
        const invites = await db.getInvites(id);
        res.json(invites);
    } catch (err) {
        res.status(400).json({ err });
    }
});

router.post("/accept-invite", isLoggedIn, async (req, res) => {
    const id = req.body.id;
    //console.log(id);

    try {
        const result = await db.acceptInvite(id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ err: error });
    }
});

router.post("/editProfile", isLoggedIn, async (req, res) => {
    const user = req.body;
    const userId = req.user.id;
    //console.log(user);

    try {
        const result = await db.editUserProfile(userId, user);
        res.json(result);
    } catch (error) {
        res.status(400).json({ err: error });
    }
});

module.exports = router;
