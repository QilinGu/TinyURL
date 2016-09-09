var app = angular.module('tinyurlApp', ['ngRoute', 'ngResource', 'ngMessages', 'mgcrea.ngStrap', 'chart.js']);

app.config(function ($routeProvider) {
	$routeProvider
	    .when("/", {
	    	templateUrl: "./public/views/home.html",
	    	controller: "homeController"
	    })
	    .when("/login", {
	    	templateUrl: "./public/views/login.html",
	    	controller: "loginController"
	    })
	    .when("/signup", {
	    	templateUrl: "./public/views/signup.html",
	    	controller: "signupController"
	    })
	    .when("/urls/:shortUrl",
	    {
	    	templateUrl: "./public/views/url.html",
	    	controller: "urlController",
	    });
	})
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push(function ($rootScope, $q, $window, $location) {
        return {
          request: function(config) {
            if ($window.localStorage.token) {
              config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
          },
          responseError: function(response) {
            if (response.status === 401 || response.status === 403) {
              $location.path('/login');
            }
            return $q.reject(response);
          }
        }
      });
    });