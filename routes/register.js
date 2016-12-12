/**
 * Created by NarX on 12/8/16.
 */
var express = require('express');
var router = express.Router();
var md5 = require('md5');

var User = require('../models/users');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var _type = req.body._type;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    // console.log(req.body);

    // form validation
    req.checkBody('username', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('_type', 'Type field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('confirm_password', 'Password do not match').equals(password);

    var errors = req.validationErrors();

    if (errors) {
        res.send({
            errors: errors,
            username: username,
            email: email,
            _type: _type,
            password: password,
            confirm_password: confirm_password
        });
    } else {
        var newUser = new User({
            username: username,
            email: email,
            _type: _type,
            password: password
        });
    }

    User.createUser(newUser).then(function (user) {
        console.log(user);
        res.send({
            msg: "Register successful, You can log in now."
        });
    }, function (err) {
        console.log(err);
        res.send(err);
    });
});

module.exports = router;
