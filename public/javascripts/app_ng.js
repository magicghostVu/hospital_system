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
        console.log('clicked');
        console.log($scope.username+" "+$scope.password);
        $scope.login($scope.username, $scope.password).then(function(res){
            //handle UI logic... etc here
            //handle each type of user




            global_info=res;
            console.log(res);
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
                console.log(global_info);

                //emit data to get data back to build UI
                socketPatient.emit("get_data_for_patient",global_info);

            }else if(global_info._type==='doctor'){
                console.log(global_info);

                //socketPatient


                console.log('doctor login');
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
                console.log('run hide modal');
                console.log($(element.children()[0]).modal('hide'));
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
            // resgi
        }
    }
});

var patientContentController=app.controller('patientContentController', function($scope){
    patientContentScope=$scope;
    $scope.patientLogin=false;
    $scope.listDoctors=[];
    $scope.sessions=[];
    $scope.profile={};
    $scope.receiveData=function(data){
        this.patientLogin=true;
        this.listDoctors=data.listDoctors;
        this.sessions=data.sessions;

    }

});

console.log("ng run");

