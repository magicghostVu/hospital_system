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
//mongoose.connect(uri);

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
        required: true,
        bcrypt: true
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
        bcrypt.compare(candidatePassword, hash).then(function (isMatch) {
            resolve(isMatch);
        }, function (err) {
            // console.log("bcy: " + err);
            reject(err);
        });
    }, function (err) {
        // console.log("compare pass: " + err);
        reject(err);
    });
};

/*
*  create new user with a hashed password
* */
module.exports.createUser = function (newUser) {
    return new Promise(function (resolve, reject) {
        
        User.getUserByUserName(newUser.username).then(function (users) {

            // explain ???

            // reject immediately
            if (users.length == 0) {
                resolve(user)
            } else {
                reject({
                    msg: "username is not available."
                });
            }
        }, function (err) {



            // if err.msg != undefined ....

            // wtf ??? why ??
            bcrypt.hash(newUser.password, 10).then(function (hash) {

                // ser hashed password
                newUser.password = hash;

                newUser.save().then(function (user) {
                    resolve(user);
                }, function (err) {
                    reject(err);
                });
            });
            // console.log(err);
            // reject(err);
        });
    });
};
/*
User.find({}).then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err)
});
*/
