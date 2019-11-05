const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model

require('../models/User')
const User = mongoose.model('user')

module.exports = function (passport) {
    passport.use(new localStrategy((username, password, done) => {
        User.findOne({
            username: username
        }).then(user => {
            // match user
            if (!user) {
                return done(null, false, {
                    message: "no user found"
                });
            } else {
                // match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: "password incorrect"
                        });
                    }
                })
            }
        })
    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}