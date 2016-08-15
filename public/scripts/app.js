var app = angular.module('tinyurlApp', ['ng-Route', 'ng-Resource']);

app.config(function ($routeProvider) {
	$routeProvider
	    .when("/", {
	    	templateUrl: "../views/home.html",
	    	controller: "homeController"
	    })
	    .when("/url/:shortUrl", {
	    	templateUrl: "../views/url.html",
	    	controller: "urlController"
	    });
});