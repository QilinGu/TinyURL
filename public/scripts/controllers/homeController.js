var app = angular.module("tinyurlApp");

app.controller("homeController", 
	["$scope", "$http", "$rootScope", "$location", function($scope, $http, $rootScope, $location) {
		if (!$rootScope.currentUser) {
		    $scope.submit = function() {
			    $http.post('/api/v1/urls', {
			        longUrl: $scope.longUrl
		        })
			      .success(function (data) {
			          $location.path("/urls/" + data.shortUrl);
			      });
		    }
        } else {
        	$scope.urls = [];
        	var getUrls = function () {
                $http.get('/api/v1/users/urls')
                    .success(function (data) {
                        $scope.urls = data;
                    });
            };
            getUrls();

	        $scope.submit = function() {
		        $http.post('/api/v1/users/urls', {
			        longUrl: $scope.longUrl,
			        user: $rootScope.currentUser.email
		        })
		          .success(function (data) {
		    	      $location.path("/urls/" + data.shortUrl);
		          });
            }
        }
}]);