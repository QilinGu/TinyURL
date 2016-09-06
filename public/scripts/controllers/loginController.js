var app = angular.module("tinyurlApp");

app.controller('loginController', 
	['$scope', 'Auth', function($scope, Auth) {
    $scope.login = function() {
      Auth.login({
        email: $scope.email,
        password: $scope.password
      });
    };
}]);