var app = angular.module("tinyurlApp");

app.controller('signupController', 
	['$scope', 'Auth', function($scope, Auth) {
    $scope.signup = function() {
      Auth.signup({
      	name: $scope.displayName,
        email: $scope.email,
        password: $scope.password
      });
    };
}]);