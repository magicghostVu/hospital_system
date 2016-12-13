/**
 * Created by magic_000 on 13/12/2016.
 */
var mongoose= require('mongoose');
mongoose.Promise = global.Promise;

/*var uri = "mongodb://root:9235@ds019268.mlab.com:19268/hospital_uet";
mongoose.connect(uri);*/

var NotificationSchema= mongoose.Schema({
    username:{
        type: String
    },
    username_doctor: {
        type: String
    },
    content: {
        type: String
    },
    seen:{
        type: Boolean
    },
    date:{
        type: String
    },
    time: {
        type: String
    }
});


var Notification= module.exports= mongoose.model("Notification", NotificationSchema);
var getNotificationByUsername=function (username) {
  return new Promise(function (resolve, reject) {
     var query= {
         username: username
     };
     Notification.find(query).then(function (notis) {
         //console.log(notis);
         resolve(notis);
     },function (err) {
         reject(err);
     });
  });
};

//console.log('jhbfvbfkj');

/*
getNotificationByUsername('hoangvuong').then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
});*/
