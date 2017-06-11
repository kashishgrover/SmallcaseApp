angular.module('SmallcaseTask.controllers', []).
controller('stocksController', function($scope, $http) {
  $http.get('data/data.json').success(function(data) {
    $scope.stockPrices = data.price;
    console.log($scope.stockPrices);
  });
});