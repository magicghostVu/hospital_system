/**
 * Created by magic_000 on 13/12/2016.
 */
var mongoose= require('mongoose');
mongoose.Promise=global.Promise;

/*var uri = "mongodb://root:9235@ds019268.mlab.com:19268/hospital_uet";
mongoose.connect(uri);*/

var WaitingSchema=mongoose.Schema({
    username: {
        type: String
    },
    description: {
        type: String
    },
    file: {
        type: String
    },
    processed: {
        type : Boolean
    }
});

var WaitingRequest = module.exports = mongoose.model("Waiting_request", WaitingSchema);


/*
* Return List of waiting request by a patient
* */
module.exports.getWaitingRequestByUserName = function (username) {
    return new Promise(function (resolve, reject) {
        var query={
            username: username,
            doctorname: ''
        };
        WaitingRequest.find(query).then(function (requests) {
            resolve(requests);
        }, function (err) {
            console.log("waiting_requests 34"+ JSON.stringify(err))
        });
    });
};

/*
* Return List of waiting request of doctor
* */
module.exports.getWaitingRequestByDoctor = function (_doctorname) {
    return new Promise(function (resolve, reject) {
        var query = { doctorname: _doctorname };
        WaitingRequest.find(query).then(function (waiting_requests) {
            if (waiting_requests.length == 0) {
                reject({
                    msg: "There are no request"
                });
            } else {
                resolve(waiting_requests);
            }
        }, function (err) {
            console.log(err);
            reject(err);
        });
    });
};

/*
* Return list of all waiting request will show in staff pages
* */
module.exports.getAllWaitingRequest = function () {
    return new Promise(function (resolve, reject) {
        WaitingRequest.find({}).then(function (waiting_requests) {
            if (waiting_requests.length == 0) {
                reject({
                    msg: "Have no request"
                });
            } else {
                resolve(waiting_requests);
            }
        }, function (err) {
            console.log("waiting_request 59: " + JSON.stringify(err));
            reject(err);
        });
    });
};

module.exports.getWaitingRequestByProcessed =function (username) {
    return new Promise(function (resolve, reject) {
        var query = {
            username: username,
            processed: true
        };
        WaitingRequest.find(query).then(function (req) {
            resolve(req[0])
        }, function (err) {
            console.log(err);
        });
    });
};
// WaitingRequest.getWaitingRequestByDoctor("hoangvuong52").then(function (waiting_request) {
//     console.log(waiting_request);
// }, function (err) {
//     console.log(err);
// });


