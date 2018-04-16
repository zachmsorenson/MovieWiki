// This will assign an angular app and controller to our results page to
// dynamically create links to our pages upon getting our results.

var app = angular.module('resultsApp', []);
app.controller('resultsController', function($scope){
   $scope.test = "test";
});