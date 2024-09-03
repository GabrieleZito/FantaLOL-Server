const express = require("express");
const { UserProfile, UserAuth } = require("../models");
const router = express.Router();

router.post("/:username/request", async (req, res) => {
    const { username } = req.params;
    const friend = await UserAuth.findOne({
        where: {
            username: username,
        },
    });
    //console.log(req.user);

    if (!friend) res.status(400).json({ err: "This user doesn't exist" });
    else {
        if (friend.id == req.user.id) {
            res.status(400).json({ err: "This is you" });
        }
        res.json({ msg: "Request sent" });
    }

});

module.exports = router;
