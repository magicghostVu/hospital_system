/**
 * Created by magic_000 on 07/12/2016.
 */

//some global variable
var global_info;
var authenControllerScope;
var headerScope;
var patientContentScope;
var doctorContentScope;



var app=angular.module('app', []);

var controller_authen=app.controller('au_ctrl', function($scope, $http){
    authenControllerScope=$scope;
    $scope.username='';
    $scope.password="";
    $scope.login=function(username, password){
        console.log("Login funtion run");
        return new Promise(function(resolve, reject){
            $http.post('/login' ,{
                username: $scope.username,
                password: $scope.password
            }).then(function(res){
                console.log(res);
                if(res.data.token!=undefined){
                    resolve(res.data);
                }else{
                    reject(res.data);
                }
            }, function(err){
                // almost never go here
                console(err);
            });
        });
    }
    $scope.handleLogin=function(){
        // console.log('clicked');
        console.log($scope.username+" "+$scope.password);
        $scope.login($scope.username, $scope.password).then(function(res){
            //handle UI logic... etc here
            //handle each type of user

            global_info=res;
            // console.log(res);
            $scope.dismiss();

            // headerScope do something here, fix me
            headerScope.$apply(function(){
                headerScope.isLogin=true;
                headerScope.username=$scope.username;
            });

            //emit some data to receive data to build UI
            if(global_info._type==="patient"){
                console.log('patient login');
                /*// update UI patient
                patientContentScope.$apply(function(){
                    patientContentScope.patientLogin=true;
                });*/
                // console.log(global_info);

                //emit data to get data back to build UI
                socketPatient.emit("get_data_for_patient",global_info);

            }else if(global_info._type ==='doctor'){
                // console.log(global_info);
                console.log('doctor login');

                socketDoctor.emit("get_data_for_doctor", global_info);
            }else if(global_info._type==='staff'){



                console.log('staff login');
            }else if(global_info._type==='lab_doctor'){



                console.log('lab_doctor login');
            }

            toastr.success('Login Successful!');
            toastr.optionsOverride = 'positionclass:toastr-bottom-right';
        }, function(err){
            // login wrong
        });
    }

});

controller_authen.$inject=["$scope", "$http"];

app.directive("myModal",function() {
    return {
        restrict: "E",
        templateUrl: "templates/modal-login.html",
        link: function(scope, element, attr){
            scope.dismiss= function(){
                // console.log('run hide modal');
                $(element.children()[0]).modal('hide');
            };
        }

    }
});


var headerController=app.controller('header_controller', function($scope){
    headerScope=$scope;
    $scope.isLogin=false;
    $scope.username='';


});
var header=app.directive('myHeader', function(){
    return {
        restrict: "E",
        templateUrl: 'templates/header.html',
        link: function(scope, e, a ){
            scope.loginSuccess= function(){

            }
        }
    }
});

app.directive('patientContent', function(){
    return {
        restrict: "E",
        templateUrl: 'templates/content-patient.html',
        link : function(scope, e, attr){

        }
    }
});

var patientContentController=app.controller('patientContentController', function($scope, $http){
    patientContentScope=$scope;
    $scope.patientLogin=false;
    $scope.listDoctors=[];
    $scope.sessions=[];
    $scope.profile={};
    $scope.notifications=[];
    $scope.request={};

    $scope.receiveData=function(data){
        this.patientLogin=true;
        this.listDoctors=data.listDoctors;
        this.sessions=data.sessions;
        this.notifications=data.notifications;
        this.profile = data.profile;
    };

    $scope.update_profile = function (fullname, mobile_phone, email) {
        var req = {
            token: global_info.token,
            fullname: fullname,
            mobile_phone: mobile_phone,
            email: email
        };

        return new Promise(function (resolve, reject) {
            $http.post('patient/edit', req).then(function (res) {
                console.log(res);
                resolve(res);
            }, function (err) {
                console.log(err);
                reject(err);
            });
        });
    };

});


app.directive('doctorContent', function () {
    return {
        restrict: "E",
        templateUrl: 'templates/content-doctor.html',
        link: function (scope, e, attr) {

        }
    }
});

var doctorContentController = app.controller('doctorContentController', function($scope) {
    doctorContentScope = $scope;
    $scope.doctorLogin = false;
    $scope.listRequests = [];
    $scope.listPatients = [];
    $scope.profile = {};

    $scope.receiveDoctorData = function (data) {
        this.doctorLogin = true;
        this.listRequests = data.listRequests;
        // this.listPatients = data.listPatients;
        // this.profile = data.profile;
    }
});

console.log("ng run");
