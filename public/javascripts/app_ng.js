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
    $scope.fileupload="";

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
        this.request = {
            description: $scope.requestDescription,
            // file: $scope.fileupload
        };

        console.log(this.request);
        // $http.post('/request/send', $scope.request).then(function (res) {
        //     console.log(res);
        // }, function (err) {
        //     console.log(err);
        // });

        var data = {
            request: $scope.request,
            msg: "Send a request",
            info: global_info
        };
        ng_socket_patient.emit('send_request', data);
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

var doctorContentController = app.controller('doctorContentController', function($scope, $http) {
    doctorContentScope = $scope;
    $scope.doctorLogin = false;
    $scope.listRequests = [];
    $scope.listPatients = [];
    $scope.profile = {};
    $scope.profileShow = true;
    $scope.dateTimeAppointment='';
    $scope.listRequestElement = [];

    $scope.infoNewAct='';

    $scope.classActiveForListPatient=[];

    $scope.createActShow=[];

    $scope.clickCreateAct=function (indexPatient) {
        for (i in this.createActShow){
            this.createActShow[i]=false;
        }
        this.createActShow[indexPatient]=true;
    };

    $scope.classActiveForAcivites=[];
    $scope.clickItemListPatient=function (index) {
        for (n in this.classActiveForListPatient){
            this.classActiveForListPatient[n]= 'inactive';
        }
        this.classActiveForListPatient[index]='active';
    }

    $scope.createActEmit=function (indexPatient) {
        let username=this.listPatients[indexPatient].username;
        let info=this.infoNewAct;
        let data={
            username: username,
            info: info
        };
        console.log(data);
        ng_socket_doctor.emit('createActivity', data);
    };

    $scope.clickAtivities=function (parentIdx, index) {
        for(ff in this.listPatients){
            this.classActiveForAcivites[ff]=[]
            for(aa in this.listPatients[ff].activities ){
                let ab= this.classActiveForAcivites[ff];
                if(aa==0){
                    ab[aa]=false;
                }else{
                    ab[aa]=false;
                }
            }
        }
        this.classActiveForAcivites[parentIdx][index]=true;

        for(h in this.createActShow){
            this.createActShow[h]=false;
        }
    }

    $scope.receiveDoctorData = function (data) {
        this.doctorLogin = true;
        this.listRequests = data.listRequests;
        this.profile = data.profile;
        this.listPatients=data.listPatients;


        // set default class each eletment in loop
        for (i in this.listRequests) {
            if (i == 0)
                this.listRequestElement[i] = "active";
            else
                this.listRequestElement[i] = "inactive";
        }

        for(ff in this.listPatients){
            this.createActShow[ff]=false;

            this.classActiveForAcivites[ff]=[]
            for(aa in this.listPatients[ff].activities ){
                let ab= this.classActiveForAcivites[ff];
                if(aa==0){
                    ab[aa]=true;
                }else{
                    ab[aa]=false;
                }
            }
        }
        //console.log(this.classActiveForAcivites);

        for(p in this.listPatients){
            if(p==0){
                this.classActiveForListPatient[p]='active';
            }else{
                this.classActiveForListPatient[p]='inactive';
            }
        }
    };

    $scope.updateListRequestEl = function (index) {
        for (k in this.listRequestElement) {
            if (k == index)
                this.listRequestElement[k] = "active";
            else
                this.listRequestElement[k] = "inactive";
        }
    };

    $scope.flipProfleStatus = function () {
        this.profileShow = !this.profileShow;
    };

    $scope.sendAppointment=function (index) {
        let data={};
        data.date_time=this.dateTimeAppointment;
        data.global_info=global_info;
        data.description = this.listRequests[index].description;
        data.patient_username=this.listRequests[index].username;
        // console.log(data);
        ng_socket_doctor.emit('setup_appointment',data);
    };

    $scope.update_profile = function () {
        var req = {
            token: global_info.token,
            fullname: $scope.profile.fullname,
            faculty: $scope.profile.faculty,
            mobile_phone: $scope.profile.mobile_phone,
            email: $scope.profile.email
        };

        $http.post('doctor/edit', req).then(function (res) {
            // console.log(res);
            $scope.flipProfleStatus();
            toastr.success(res.data.msg);
        }, function (err) {
            console.log(err);
            toastr.warning(err.message.msg);
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
    $scope.profileShow = true;

    $scope.receiveStaffData = function (data) {
        this.staffLogin = true;
        this.listRequests = data.listRequestsup;
        this.profile = data.profile;

        // set default
        for (i in this.listRequests) {
            if (i == 0) {
                this.listRequestElement[i] = "active";
            } else {
                this.listRequestElement[i] = "inactive";
            }
        }
    };

    $scope.flipProfileShow = function () {
        this.profileShow = !this.profileShow;
    };


    $scope.updateActiveElement = function (index) {
        for (k in this.listRequestElement) {
            if (k == index) {
                this.listRequestElement[k] = "active";
            } else {
                this.listRequestElement[k] = "inactive";
            }
        }
    };

    $scope.update_profile = function() {

        var req = {
            token: global_info.token,
            fullname: $scope.profile.fullname,
            email: $scope.profile.email,
            mobile_phone: $scope.profile.mobile_phone,
            file: $scope.profile.avatar,
        };

        $http.post('staff/edit', req).then(function (res) {
            $scope.flipProfileShow()
            if (res.data.errors) {
                for (i in res.data.errors) {
                    toastr.warning(res.data.errors[i].msg);
                }
            }
            toastr.success(res.data.msg);
        }, function(err) {
            console.log(err);
        })
    };
});

console.log("ng run");
