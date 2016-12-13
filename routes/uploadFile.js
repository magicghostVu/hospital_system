/**
 * Created by magic_000 on 14/12/2016.
 */

var express = require('express');
var router = express.Router();

router.post('/upfile', function (req, res, next) {
    console.log(req.file.filename);
    res.send({
        msg: "OK, upfile"
    });
});

router.get('/pageUpfile', function (req, res, next) {
    res.render('upfile');
});

module.exports = router;
