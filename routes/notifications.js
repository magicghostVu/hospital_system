/**
 * Created by NarX on 12/14/16.
 */
var express = require('express');
var router = express.Router();
var FCM = require('fcm-push');

router.post('/send', function (req, res, next) {
    var serverKey = "AAAAtbX1V6g:APA91bFl0IlGkXjEINIIG_-mh4LHitRRj8dAS1Af4HDp5DiYUwlla1Oskqd_15GNERWMbY4S1FXKAOSgM6hZfT_zcvt_xNnjd3-mUiUvDUGKhnmuJZCsaUD0xjIghvIW8OYBzbSnAgiWJ1VBPvR0MfhROCPQLi5QYQ";

    var token = 'cHlEWtEY6zc:APA91bFKbvVpLc3_6BDYHSV6QJVY3Q5baPQeRQmvaHLxe-EI2PTv0zzq9LJsDW7pytaa5aaidnZZ92tJ0lDQ2e1_IGEp1xGk4Syw5h4JPerFiEhlz81wzz4Tvwa8yv9oQhSDyvGo-L7i';
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