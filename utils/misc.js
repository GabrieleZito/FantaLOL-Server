const argon2 = require("argon2");
const fs = require("fs")

exports.hashPassword = (password) => {
    return argon2.hash(password);
};

exports.verifyPassword = async (psw, hashedPsw) => {
    try {
        //console.log("dentro verifyPassword");
        if (await argon2.verify(hashedPsw, psw)) {
            console.log("dentro verifyPassword");
            return true;
        } else return false;
    } catch (e) {
        //console.log(e);
        
        return e;
    }
};

exports.getPlayerFromJson = (name) => {
    let players = fs.readFileSync(__dirname+"/../liquipedia/lec_players.json")
    players = JSON.parse(players)
    for(p in players){
        if (players[p].pagename == name) {
            return players[p]
        }
    }
}