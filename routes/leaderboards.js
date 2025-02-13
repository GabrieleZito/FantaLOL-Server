const express = require("express");
const router = express.Router();
const db = require("../database.js");

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: "Not authenticated." });
};

router.post("/new", isLoggedIn, async (req, res) => {
    const opts = req.body;
    //console.log(opts);
    try {
        const result = await db.createLeaderboard(opts);
        //const players =  av.(
        //console.log(result);

        res.json(result.leaderboard.id);
    } catch (error) {
        res.status(400).json({ err: error });
    }
});

router.get("/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.getLeaderboard(id);
        //console.log(result);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/:id/user", isLoggedIn, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.getInfoLeaderboardForUser(id, req.user.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ err });
    }
});

router.get("/user/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.getUserLeaderboards(id);
        //console.log(result);

        res.json(result);
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/user/:id/friends", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    //console.log(id);

    try {
        const result = await db.getFriendLeaderboards(id);
        res.json(result);
    } catch (error) {
        console.log(error);

        res.status(400).json({ err: error });
    }
});

router.get("/:leadId/team", isLoggedIn, async (req, res) => {
    const { leadId } = req.params;
    const userId = req.user.id;
    //console.log(leadId);

    try {
        const team = await db.getUserTeam(userId, leadId);

        res.json(team);
    } catch (error) {
        console.log(error);
        res.status(400).json({ err: error });
    }
});

router.post("/:leadId/team", isLoggedIn, async (req, res) => {
    const { leadId } = req.params;
    const userId = req.user.id;
    const team = req.body;
    //console.log(team);

    const result = await db.setActivePlayers(userId, leadId, team);

    res.json(result);
});

router.get("/:leadId/teamPoints", isLoggedIn, async (req, res) => {
    const { leadId } = req.params;
    const userId = req.user.id;
    //console.log(leadId);

    try {
        const points = await db.getTeamPoints(leadId, userId);
        res.json(points);
    } catch (error) {
        console.log(error);
        res.status(400).json({ err: error });
    }
});

module.exports = router;
