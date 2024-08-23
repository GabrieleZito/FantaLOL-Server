const passport = require("passport");
const LocalStrategy = require("passport-local");

const { checkUser, getUserById } = require("../database");

passport.serializeUser((user, done) => {
    console.log("SERIALIZE");
    //console.log(user);

    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("DESERIALIZE");

    getUserById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, null));
});

passport.use(
    new LocalStrategy((username, pwd, done) => {
        checkUser(username, pwd)
            .then((user) => {
                console.log("dentro local check user");
                //console.log(user);

                return done(null, user);
            })
            .catch((err) => done(null, false, err));
        //console.log("dentro localstrategy");
    })
);
