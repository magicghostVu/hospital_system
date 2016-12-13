/**
 * Created by NarX on 12/13/16.
 */
var express = require('express');
var router = express.Route();

var User = require('../models/users');
var Patient = require('../models/patients');

/*
* Update all patients
* */
router.post('/:id/edit', function (req, res, next) {
    var token = req.body.token;
    var username = req.body.username;
    var email = req.body.email;
    var mobile_phone = req.body.mobile_phone;

    req.checkBody('token', '')
});