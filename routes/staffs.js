/**
 * Created by NarX on 12/14/16.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/users');
var Staff = require('../models/staffs');

router.post('/edit', function (req, res, next) {
    var token = req.body.token;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var mobile_phone = req.body.mobile_phone;

    req.checkBody('token', 'Token is required').notEmpty();
    req.checkBody('fullname', 'Full Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.send({
            errors: errors,
            token: token,
            fullname: fullname,
            email: email,
            mobile_phone: mobile_phone
        });
    } else {
        User.authenticateToken(token).then(function (user) {
            Staff.getStaffDetailByUserName(user.username).then(function (staff) {
                staff.fullname = fullname;
                staff.email = email;
                staff.mobile_phone = mobile_phone;

                staff.save().then(function (staff) {
                    console.log(user);
                    res.send({
                        msg: "update staff info successful"
                    });
                }, function (err) {
                    console.log("staffs 43: " + JSON.stringify(err));
                    res.send(err);
                });
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });
    }
});


module.exports = router;