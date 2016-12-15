/**
 * Created by magic_000 on 14/12/2016.
 */

var express = require('express');
var router = express.Router();
var fs= require('fs');

function getExtentionOfFile(filename) {
    var subString=filename.split('.');
    return subString[subString.length-1];
}

router.post('/', function (req, res, next) {

    if (req.attachment) {
        console.log("upload file");
    };

    var pathOrigin= './public/images/'+req.file.filename;



    var extension= getExtentionOfFile(req.file.originalname);
    var pathExpect= pathOrigin+'.'+extension;

    fs.rename(pathOrigin, pathExpect, function (err) {
        if(err){
            console.log('upfile 24'+ "có lỗi khi đổi tên file" + JSON.stringify(err));
        }

    });

    var filenameExpect= req.file.filename+"."+ extension;
    //TODO: rename file name (add extension)





    console.log(pathExpect+" "+ filenameExpect);

    console.log(req.file.originalname);
    res.send({
        msg: filenameExpect
    });
});

router.get('/pageUpfile', function (req, res, next) {
    res.render('upfile');
});

module.exports = router;
