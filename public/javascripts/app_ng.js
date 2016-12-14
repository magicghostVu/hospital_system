/**
 * Created by magic_000 on 07/12/2016.
 */

//some global variable
var global_info;
var authenControllerScope;
var headerScope;
var patientContentScope;
var doctorContentScope;
var staffContentScope;


// socket var use in ng-ap
var ng_socket_doctor;
var ng_socket_patient;
var ng_socket_staff;



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
                socketStaff.emit("get_data_for_staff", global_info);
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
    $scope.requestDescription="";
    $scope.profileDisplay=true;
    $scope.receivePatientData=function(data){
        this.patientLogin=true;
        this.listDoctors=data.listDoctors;
        this.sessions=data.sessions;
        this.notifications=data.notifications;
        this.profile = data.profile;
    };

    $scope.updateDisplayProfileToFix=function () {
        this.profileDisplay=!this.profileDisplay;
    };

    $scope.update_profile = function () {
        var req = {
            token: global_info.token,
            fullname: $scope.profile.fullname,
            mobile_phone: $scope.profile.mobile_phone,
            email: $scope.profile.email
        };

        $http.post('patient/edit', req).then(function (res) {
            $scope.updateDisplayProfileToFix();
            toastr.success("Update Successful");
        }, function (err) {
            console.log(err);
        });
    };

    $scope.sendRequest= function () {
        // TODO: send file image first to get back img ID
        // $http send file to server ...
        // then emit description to server
        console.log(this.requestDescription);

    }

});


app.directive('doctorContent', function () {
    return {
        restrict: "E",
        templateUrl: 'templates/content-doctor.html',
        link: function (scope, e, attr) {

        }
    }
});

var doctorContentController = app.controller('doctorContentController', function($scope, $http) {
    doctorContentScope = $scope;
    $scope.doctorLogin = false;
    $scope.listRequests = [];
    $scope.listPatients = [];
    $scope.profile = {};

    $scope.dateTimeAppointment='';

    $scope.listRequestElement = [];

    $scope.updateListRequestEl = function (index) {
        for (k in this.listRequestElement) {
            if (k == index)
                this.listRequestElement[k] = "active";
            else
                this.listRequestElement[k] = "inactive";
        }
    };

    $scope.receiveDoctorData = function (data) {
        this.doctorLogin = true;
        this.listRequests = data.listRequests;
        this.profile = data.profile;

        // set default class each eletment in loop
        for (i in this.listRequests) {
            if (i == 0)
                this.listRequestElement[i] = "active";
            else
                this.listRequestElement[i] = "inactive";
        }
    }

    $scope.sendAppointment=function (index) {
        let data={};
        data.date_time=this.dateTimeAppointment;
        data.global_info=global_info;
        data.description = this.listRequests[index].description;
        data.patient_username=this.listRequests[index].username;


        console.log(data);
        ng_socket_doctor.emit('setup_appointment',data);
    };

    $scope.update_profile = function (fullname, mobile_phone, email) {
        var req = {
            token: global_info.token,
            fullname: this.profile,
            mobile_phone: this.profile.mobile_phone,
            email: this.profile.email
        };

        $http.post('doctor/edit', req).then(function (res) {
            console.log(res);
        }, function (err) {
            console.log(err);
        });
    };
});

app.directive('staffContent', function () {
    return {
        restrict: "E",
        templateUrl: 'templates/content-staff.html',
        link: function (scope, e, attr) {

        }
    }
});

var staffContentController = app.controller('staffContentController', function ($scope, $http) {
    staffContentScope = $scope;
    $scope.staffLogin = false;
    $scope.listRequests = [];
    $scope.profile = {};
    $scope.listRequestElement = [];

    $scope.receiveStaffData = function (data) {
        this.staffLogin = true;
        this.listRequests = data.listRequests;
        this.profile = data.profile;

        // set default
        for (i in this.listRequests) {
            if (i == 0) {
                this.listRequestElement[i] = "active";
            } else {
                this.listRequestElement[i] = "inactive";
            }
        }
    }

    $scope.updateActiveElement = function (index) {
        for (k in this.listRequestElement) {
            if (k == index) {
                this.listRequestElement[k] = "active";
            } else {
                this.listRequestElement[k] = "inactive";
            }
        }
    };

    $scope.update_profile = function(fullname, email, mobile_phone) {
        var req = {
            fullname: this.profile.fullname,
            email: this.profile.email,
            mobile_phone: this.profile.mobile_phone,
        }

        $http.post('staff/edit', req).then(function (res) {
            console.log(res);
        }, function(err) {
            console.log(err);
        })
    };
});

console.log("ng run");
