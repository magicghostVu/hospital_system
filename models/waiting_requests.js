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

var WaitingRequest= module.exports =mongoose.model("Waiting_request", WaitingSchema);
var findWaitingRequestByUsername= module.exports= function (username) {
    return new Promise(function (resolve, reject) {
        var query={
            username: username
        };
        WaitingRequest.find(query).then(function (requests) {
            resolve(requests);
        }, function (err) {
            console.log("waiting_requests 34"+ JSON.stringify(err))
        });
    });
};
