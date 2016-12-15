/**
 * Created by NarX on 12/15/16.
 */
var express = require('express');
var router  = express.Router();

router.post('/send', function (req, res, next) {

    var token = req.token;
    var description = req.description;

    if (req.file) {
        console.log("upload file");
    }


});

module.exports = router;