/**
 * Created by magic_000 on 12/12/2016.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


var uri = "mongodb://root:9235@ds019268.mlab.com:19268/hospital_uet";
//mongoose.connect(uri);

var sessionSchema= mongoose.Schema({
    description: {
      type: String
    },
    username: {
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


var sessions= mongoose.model("Session", sessionSchema);

module.exports= sessions;



var getSessionsByUsername=function(username){
  return new Promise(function(resolve, reject){
      var query={
          username: username
      }
      sessions.find(query).then(function(_sessions){
          resolve(_sessions);
      }, function(err){
          console.log("sesssions 46"+ JSON.stringify(err));
          reject(err);
      })
  });
};

module.exports.getSessionsByUsername=getSessionsByUsername;

/*
sessions.find({}).then(function(sessions){
    console.log(JSON.stringify(sessions));
}, function(err){
    console.log(err);
});*/


getSessionsByUsername("hoangvuong").then(function(_sessions){
    console.log(JSON.stringify(_sessions));
}, function(err){
    console.log("sessions 65"+ JSON.stringify(err));
});