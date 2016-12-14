/**
 * Created by NarX on 12/14/16.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/users');
var Doctor = require('../models/doctors');

/*
 * Update patients info
 * */
router.post('/edit', function (req, res, next) {
    var token = req.body.token;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var faculty = req.body.faculty;
    var mobile_phone = req.body.mobile_phone;

    req.checkBody('token', 'Token is required').notEmpty();
    req.checkBody('fullname', 'Full Name is required').notEmpty();
    req.checkBody('faculty', 'Faculty is required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.send({
            errors: errors,
            token: token,
            fullname: fullname,
            faculty: faculty,
            email: email,
            mobile_phone: mobile_phone
        });
    } else {
        User.authenticateToken(token).then(function (user) {
            Doctor.getDoctorDetailByUserName(user.username).then(function (doctor) {
                var doctor_update = doctor;
                doctor_update.email = email;
                doctor_update.fullname = fullname;
                doctor_update.faculty = faculty;
                doctor_update.mobile_phone = mobile_phone;

                doctor_update.save().then(function (user) {
                    res.send({
                        msg: "update doctors info successful"
                    });
                }, function (err) {
                    console.log("doctors 41: " + JSON.stringify(err));
                    res.send(err);
                });
            }, function (err) {
                console.log(err);
                res.send(err);
            });
        }, function (err) {
            console.log(err);
            res.send(err);
        });
    }
});

module.exports = router;