var app = angular.module("tinyurlApp");

app.controller("homeController", ["$scope", "$http", "$location", function($scope, $http) {
	$scope.submit = function() {
		console.log($scope.longUrl);
		$http.post('/api/v1/urls', {
			longUrl: $scope.longUrl
		})
		    .success(function (data) {
		    	$location.path("/urls" + data.shortUrl)
		    });
	}
}]);