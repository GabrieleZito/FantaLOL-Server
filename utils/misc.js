const argon2 = require("argon2");

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
