/**
 * Created by NarX on 12/13/16.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/users');
var Patient = require('../models/patients');

/*
* Update patients info
* */
router.post('/edit', function (req, res, next) {
    var token = req.body.token;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var mobile_phone = req.body.mobile_phone;

    req.checkBody('token', 'Token is required').notEmpty();
    req.checkBody('fullname', 'Full Name is required').notEmpty();

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
            Patient.getPaitentByUserName(user.username).then(function (patients) {
                var patient_update = patients[0];
                patient_update.email = email;
                patient_update.fullname = fullname;
                patient_update.mobile_phone = mobile_phone;

                patient_update.save().then(function (user) {
                    res.send({
                        msg: "updated patient info successful"
                    });
                }, function (err) {
                    console.log("patients 41: " + JSON.stringify(err));
                    res.send(err);
                });
            });
        }, function (err) {
            res.send(err);
        });
    }
});

module.exports = router;