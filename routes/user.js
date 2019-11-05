const express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// passport config
require("../passport/passport")(passport);


require("../models/User");
let User = mongoose.model('user');

require("../models/Message");
let Chat = mongoose.model('chatMessage');

//  homepage /user
router.get('/', (req, res) => {
    res.json({
        msg: 'this is user route'
    })
})
//  homepage /user
router.get('/list', (req, res) => {

    User.find({}, {
        _id: 1,
        username: 1,
        messages: 1,
        createdAt: 1
    }).then(users => {
        res.json({
            users: users
        })
    })

})
// register
router.get('/register', (req, res) => {
    res.json({
        msg: "this is a user's register route, in order to register a user use POST method with username and password object"
    })
})
router.post('/register', (req, res) => {
    console.log(req.body)
    let username = req.body.username.trim();
    let password = req.body.password.trim();



    let errors = [];
    if (username == '') {
        errors.push({
            text: 'Please type a username'
        })
    }
    // || req.body.password[1] == ''
    if (password == '') {
        errors.push({
            text: 'Please type in password'
        })
    }

    // if (req.body.password[0] !== req.body.password[1]) {
    //     errors.push({
    //         text: 'Passwords dont match'
    //     })
    // }
    if (errors.length > 0) {
        res.json({
            errors: errors
        })
    } else {
        User.findOne({
            username: req.body.username
        }).then(user => {
            if (user) {
                res.json({
                    msg: 'User Exists, select another username'
                })
            } else {
                let newUser = new User({
                    username: req.body.username,
                    password: req.body.password
                    // password: req.body.password[0]
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            // var token = jwt.sign({
                            //     jwt: user.username
                            // }, 'secret');
                            // res.cookie('jwt', token).redirect('/user/login');
                            res.json({
                                status: "you are registered"
                            })
                        }).catch(err => {
                            console.log(err);
                            return;
                        })
                    })
                })
            }
        })

    }

})

// login
router.get('/login', (req, res) => {
    res.render('user/login')
    // res.json({
    //     msg: "this is a login route"
    // })
})
router.post('/login', passport.authenticate('local'), (req, res, next) => {

    res.json({
        msg: "You are logged in"
    })

})


//  logout
router.get('/logout', (req, res) => {
    req.logout();
    res.json({
        msg: "You are logged out"
    })

})

//  upodate username
router.put('/update/:username', (req, res) => {
    res.json({
        msg: 'this is user LOGOUT route'
    })
})

// user avatar
router.post('/avatar/upload', (req, res) => {
    res.json({
        msg: 'this is post request user avatar route route'
    })
})


module.exports = router;