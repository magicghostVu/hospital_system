/**
 * Created by NarX on 12/14/16.
 */
var express = require('express');
var router = express.Router();
var FCM = require('fcm-push');

router.post('/send', function (req, res, next) {
    var serverKey = "AAAAtbX1V6g:APA91bFl0IlGkXjEINIIG_-mh4LHitRRj8dAS1Af4HDp5DiYUwlla1Oskqd_15GNERWMbY4S1FXKAOSgM6hZfT_zcvt_xNnjd3-mUiUvDUGKhnmuJZCsaUD0xjIghvIW8OYBzbSnAgiWJ1VBPvR0MfhROCPQLi5QYQ";

    var token = 'exNhy93zyqg:APA91bEWlOhOtvZA8sDn53sJMqW_ms6FeJRNQkTOynPeZGSvKXhL93xMt2KLVtAab60raaf5s1qZFnT1fx370B_tOUvpYfr6aRKEQccB5SlcKZIP5E7IIIIbNE9ob1xfMhNXdIc6X1O-';
    var fcm = new FCM(serverKey);

    var notify = req.body.message;
    var message = {
        to: token,
        data: {
            message: notify
        },
        notification: {
            title: "Hospital Notified",
            body: notify
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