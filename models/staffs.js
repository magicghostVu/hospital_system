/**
 * Created by NarX on 12/14/16.
 */
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var StaffSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    fullname: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    list_serve: []
});

var Staff = module.exports = mongoose.model('Staff', StaffSchema);

module.exports.getStaffDetailByUserName = function (username) {
    var query = { username: username };
    return new Promise(function (resolve, reject) {
        Staff.find(query).then(function (staffs) {
            if (staffs.length == 0) {
                reject({
                    msg: "Staff doesn't existed"
                });
            } else {
                resolve(staffs[0]);
            }
        }, function (err) {
            console.log("staff 44 : " + JSON.stringify(err));
            reject(err);
        });
    });
};

