const argon2 = require("argon2");

exports.hashPassword = (password) => {
    return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        hashLength: 50,
        timeConst: 20,
        parallelism: 5,
    });
};

exports.verifyPassword = async (psw, hashedPsw) => {
    try {
        if (await argon2.verify(hashedPsw, psw)) {
            return true;
        } else return false;
    } catch (e) {
        return e;
    }
};
