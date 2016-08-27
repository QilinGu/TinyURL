var app = angular.module('tinyurlApp', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider) {
	$routeProvider
	    .when("/", {
	    	templateUrl: "./public/views/home.html",
	    	controller: "homeController"
	    })
	    .when('/login', {
	    	templateUrl: './public/views/login.html',
	    	controller: 'loginController'
	    })
	    .when('/signup', {
	    	templateUrl: './public/views/signup.html',
	    	controller: 'signupController'
	    })
	    .when("/urls/:shortUrl",
	    {
	    	templateUrl: "./public/views/url.html",
	    	controller: "urlController",
	    });
});