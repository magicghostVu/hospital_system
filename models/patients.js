/**
 * Created by NarX on 12/13/16.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var PatientSchema = mongoose.Schema({
    username: {
        type: String
    },
    fullname: {
        type: String
    },
    mobile_phone: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
});

var Patient = module.exports = mongoose.model('Patient', PatientSchema);

module.exports.getPaitentByUserName = function (username) {
    var query = { username: username };
    
    return new Promise(function (resolve, reject) {
        Patient.find(query).then(function (patients) {
            if (patients.length == 0) {
                reject({
                    msg: "patient doesn't exist"
                });
            } else {
                resolve(patients);
            }
        }, function (err) {
            console.log("patients 42 : " + JSON.stringify(err));
            reject(err);
        })
    });
};

module.exports.getPatientById = function (id, callback) {
    Patient.findById(id, callback);
};
