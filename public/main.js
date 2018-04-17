var resultsApp = angular.module('resultsApp', []);

resultsApp.controller('resultsController', function($scope){
    $scope.message = 'results page';
    $scope.results = [];
});


function parseRow(row){
    // Put this row into the scope of our results page controller
    // var scope = angular.element($('#resultsList')).scope();
    // scope.$apply(function(){
    //     scope.results.push(row);
    // });
    console.log(row);
}