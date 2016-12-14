/**
 * Created by magic_000 on 12/12/2016.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


var uri = "mongodb://root:9235@ds019268.mlab.com:19268/hospital_uet";
//mongoose.connect(uri);

var SessionSchema= mongoose.Schema({
    description: {
      type: String
    },
    username: {
        type: String
    },
    username_doctor:{
        type: String
    },

    status: {
        type: String
    },
    activities: [],
    result: {
        type: String
    }
});


var Session = mongoose.model("Session", SessionSchema);

module.exports= Session;

/*
* Return sessions belong to a patient
* */
module.exports.getSessionsByUsername = function(username){
  return new Promise(function(resolve, reject){
      var query={
          username: username
      };
      Session.find(query).then(function(_sessions){
          resolve(_sessions);
      }, function(err){
          console.log("sesssions 46"+ JSON.stringify(err));
          reject(err);
      })
  });
};

module.exports.getActiveSessionByDoctor = function (doctorname) {
    return new Promise(function (resolve, reject) {
        var query = {
            username_doctor: doctorname,
            status: "active"
        };
        Session.find(query).then(function (sessions) {
            if (sessions.length == 0) {
                reject({
                    msg: "Found no sessions"
                });
            } else {
                resolve(sessions);
            }
        }, function (err) {
            console.log("session 63: " + JSON.stringify(err));
            reject(err);
        });
    });
};
/*
sessions.find({}).then(function(sessions){
    console.log(JSON.stringify(sessions));
}, function(err){
    console.log(err);
});*/


/*
getSessionsByUsername("hoangvuong").then(function(_sessions){
    console.log(JSON.stringify(_sessions));
}, function(err){
    console.log("sessions 65"+ JSON.stringify(err));
});*/
