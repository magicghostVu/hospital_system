/**
 * Created by NarX on 12/6/16.
 */


/*
* Remember that when use Promise, only resolve when you finish something
*
* */
var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');

mongoose.Promise = global.Promise;
var uri = 'mongodb://localhost/hospital';
//mongoose.connect(uri);+

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    _type: {
        type: String
    },
    token: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);


// always resolve at least 1 users
module.exports.getUserByUserName = function (username) {
    var query = { username : username };
    return new Promise(function (resolve, reject) {
        User.find(query).then(function (users) {
            if (users.length == 0)
                reject({
                    msg: "user doesn't exists."
                });
            else
                resolve(users);
        }, function (err) {
            reject(err);
        });
  });  
};

/*
* this function will save token once user login
* */
module.exports.updateToken = function (username, token) {
    var query = { username : username };
    return new Promise(function (resolve, reject) {
        User.find(query).then(function (users) {
            current_user = users[0];
            current_user.token = token;
            current_user.save().then(function (user) {
                resolve(user);
            }, function (err) {
                console.log("save token: " + err);
                reject(err);
            });
        }, function (err) {
            console.log("update token : " + err);
            reject(err);
        })
    });
};

/*
* compare password in database and data user type
* */
module.exports.comparePassword = function (candidatePassword, hash) {
    return new Promise(function(resolve, reject){
        var isMatch = bcryptjs.compareSync(candidatePassword, hash);
        if (isMatch) {
            resolve(isMatch);
        } else {
            reject(isMatch);
        }
    });
};

/*
*  create new user with a hashed password
* */
module.exports.createUser = function (newUser) {
    return new Promise(function (resolve, reject) {
        
        User.getUserByUserName(newUser.username).then(function (users) {

            reject({
                msg: "username is not available."
            });
        }, function (err) {

            var salt = bcryptjs.genSaltSync(10);
            var hashPassword = bcryptjs.hashSync(newUser.password, salt);

            newUser.password = hashPassword;

            newUser.save().then(function (user) {
                resolve(user);
                // :TODO create doctor, lab_doc,... if type == doctor (or lab_doc),...
            }, function (err) {
                reject(err);
            });
        });
    });
};



var authenticateToken= function(token){
    return new Promise(function(resolve, reject){
        var query= {
          token: token
        };
        User.find(query).then(function(users){
            if(users.length==0){
                reject({
                    msg: "token is invalid"
                });
            }else{
                resolve(users[0]);
            }
        }, function(err){

            // almost never run over there
            console.log('model/users 140 '+JSON.stringify(err));
        });
    });
};


module.exports.authenticateToken=authenticateToken;
/*
User.find({}).then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err)
});
*/
