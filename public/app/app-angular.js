var app = angular.module('MyApp',["ngRoute"]);
app.run(function(){
    console.log("My App is Running!");
});

app.config(function($routeProvider) {    $routeProvider
.when("/", {
        templateUrl : "login.html"
    });
});


app.controller('mainCont', function($scope, $http, $location, $sce) {
    console.log("This is Main Controller!");
    
    $scope.startButton = function () {
        console.log("Started");
        $http({
            method: 'GET',
            url: 'http://localhost:8888/startButton'
            
        }).then(function (response) {
            $scope.trustedHtml =  $sce.trustAsHtml( response.data ); 
            console.log("Start : " + response.data );
        });
    };
    
    $scope.getToken = function (newCode) {
        console.log("Get Token");
        $http({
            method: 'POST',
            data : { "data" : newCode },
            url: 'http://localhost:8888/getToken'
            
        }).then(function (response) {
            //$scope.trustedHtml =  response.data;
            console.log("Token : " + response.data );
        });
    };
    
    $scope.refreshToken = function (oldToken) {
        console.log("Refresh Token");
        $http({
            method: 'POST',
            data : { "data" : oldToken },
            url: 'http://localhost:8888/refreshToken'
            
        }).then(function (response) {
            //$scope.trustedHtml =  response.data;
            console.log("Refreshed Token : " + response.data );
        });
    };
    
    $scope.getData = function ( newToken ) {
        console.log("Get Data");
        $http({
            method: 'POST',
            data : { "data" : newToken },
            url: 'http://localhost:8888/getData'
            
        }).then(function (response) {
            //$scope.trustedHtml =  response.data;
            console.log("Refreshed Token : " + response.data );
        });
    };
    
});