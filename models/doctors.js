/**
 * Created by NarX on 12/12/16.
 */
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var User = require('./users');

var ObjectId = mongoose.Schema.Types.ObjectId;
// var uri = "mongodb://root:9235@ds019268.mlab.com:19268/hospital_uet";
// mongoose.connect(uri);

var DoctorSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    fullname: {
        type: String
    },
    falcuty: {
        type: ObjectId,
        ref: 'falcuties'
    },
    list_recommend: []
});

var Doctor = module.exports = mongoose.model('Doctor', DoctorSchema);

module.exports.getDoctorDetailByUserName = function (username) {
    var query = { username: username};
    return new Promise(function (resolve, reject) {
        Doctor.find(query).then(function (doctors) {
            if (doctors.length == 0) {
                resolve(doctors);
            } else {
                reject({
                    msg: "Doctor doesn't existed"
                })
            }
        }, function (err) {
            console.log("f: doctorsjs, l: 46" + JSON.stringify(err));
            reject(err);
        })
    });
};

module.exports.getAllDoctorDetails = function () {
    return new Promise(function (resolve, reject) {
       Doctor.find({}).then(function (doctors) {
           if (doctors.length == 0) {
               reject({
                   msg: "Can't get doctors list"
               });
           } else
            resolve(doctors);
       }, function (err) {
           console.log("f: doctorsjs, l: 57" + JSON.stringify(err));
           reject(err);
       })
    });
};


/*
Doctor.getAllDoctorDetails().then(function (doctors) {
    console.log(doctors);
}, function (err) {
    console.log(err);
});*/
