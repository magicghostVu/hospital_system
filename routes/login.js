/**
 * Created by NarX on 12/6/16.
 */
var express = require('express');
var router = express.Router();
var md5 = require('md5');

var User = require('../models/users');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);
    if (username == undefined || password == undefined) {
        console.log('undefined field');
        res.send({msg: "Invalid username or password"});
    } else {
        User.getUserByUserName(username, password).then(function (users) {
            var user = users[0];
            console.log("running");
            User.comparePassword(password, user.password).then(function (isMatch) {
                var token = md5(username + '' + Date.now());
                User.updateToken(username, token).then(function (user) {
                    console.log("user+ login 25 line"+ user);
                    res.send({
                        token: token,
                        _type: user._type
                    });
                }, function (err) {
                    res.send(err);
                });
            }, function (isMatch) {
                res.send({
                    msg: "wrong username or password"
                });
            });
        }, function (err) {
            console.log("get user: " + err);
            res.send(err);
        });
    }
});

module.exports = router;
