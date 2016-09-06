var app = angular.module("tinyurlApp");

app.controller('signupController', 
	['$scope', 'Auth', function($scope, Auth) {
    $scope.signup = function() {
      Auth.signup({
        email: $scope.email,
        password: $scope.password
      });
    };
}]);