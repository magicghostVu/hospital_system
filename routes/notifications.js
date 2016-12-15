/**
 * Created by NarX on 12/14/16.
 */
var express = require('express');
var router = express.Router();
var FCM = require('fcm-push');

router.post('/send', function (req, res, next) {
    var FCM = require('fcm-push');
    var serverKey = "AAAAtbX1V6g:APA91bFl0IlGkXjEINIIG_-mh4LHitRRj8dAS1Af4HDp5DiYUwlla1Oskqd_15GNERWMbY4S1FXKAOSgM6hZfT_zcvt_xNnjd3-mUiUvDUGKhnmuJZCsaUD0xjIghvIW8OYBzbSnAgiWJ1VBPvR0MfhROCPQLi5QYQ";

    // var token = 'dE2k_bKDMOA:APA91bHNAg5JGt8B6fiEHGW9Wjyztd1hRjaDVGgpLXIRGOG_XUWK76JexpPujHXbCc0zDBMQ0cCEqtl6QrJ2V8p2flmi_EzVpfbsOyCohmwV1vhIAhe_GYvIDl50r3g7iZ8IwxwH9Ivw';
    var token = 'ejo9KG5sKuk:APA91bHiiUyx9RAoRBxqLrUasqtb9_m5ZnBVfYg1J2jbEqtUdlUIwkZd4GncsOXgvIvXbrYvvGmfaIZYwelQRhdqEjjGkCk3sGQTLLp5ewQbqI59XvJ0O4oCyNoOgomGyNKo-1Bs6WHE'
    var fcm = new FCM(serverKey);

    var notify = req.body.message;
    // var notify = "Ngoc oc";
    var message = {
        to: token,
        data: {
            message: notify
        }
    };

    fcm.send(message).then(function (response) {
        console.log("Success", response);
        res.send(response);
    }, function (err) {
        console.log(err);
        res.send(err);
    })
});


module.exports = router;