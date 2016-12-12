/**
 * Created by magic_000 on 07/12/2016.
 */
var global_info;
var app=angular.module('app', []);
var controller_authen=app.controller('au_ctrl', function($scope, $http){
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
            //handle UI logic etc here

            global_info=res;
            console.log(res);
            $scope.dismiss();

            //emit some data to receive data to build UI
            socketPatient.emit("get_data",global_info);

        }, function(err){
            // login wrong
        });
    }

});

app.directive("myModal",function() {
    return {
        restrict: "A",
        link: function(scope, element, attr){
            scope.dismiss= function(){
                console.log('run hide modal');
                console.log(element);
                element.modal('hide');

            };
        }
    }
});




controller_authen.$inject=["$scope", "$http"];
console.log("ng run");