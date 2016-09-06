angular.module('tinyurlApp')
  .controller('navbarController', function($scope, Auth) {
    $scope.logout = function() {
      Auth.logout();
    };
  });