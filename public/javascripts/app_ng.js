/**
 * Created by magic_000 on 07/12/2016.
 */

//some global variable
var global_info;
var authenControllerScope;
var headerScope;

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

            global_info=res;
            console.log(res);
            $scope.dismiss();

            // headerScope do something here, fix me
            headerScope.$apply(function(){
                headerScope.isLogin=true;
                headerScope.username=$scope.username;
            });

            //emit some data to receive data to build UI
            socketPatient.emit("get_data",global_info);
            toastr.success('Login Successful!');
            toastr.optionsOverride = 'positionclass:toastr-bottom-right';
        }, function(err){
            // login wrong
        });
    }

});

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


var headrController=app.controller('header_controller', function($scope){
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


controller_authen.$inject=["$scope", "$http"];
console.log("ng run");