angular.module('SmallcaseTask.controller', [])

.controller('stocksController', function($scope, $http) {

	$scope.stockPageSize = 8;
	$scope.currentPage = 0;
	$scope.portfolioArray = new Array();
	$scope.portfolioDict = {};

	$http.get('data/data.json').success(function(data) {
		$scope.stockPrices = getArray(data.price);
		$scope.totalStocks = $scope.stockPrices.length;
    	$scope.numberOfPages = numberOfPages($scope.stockPrices, $scope.stockPageSize);
		$scope.stockEPS = data.eps;
		$scope.stockHistoricals = data.historical;
	});

	$scope.onDragComplete=function(data,evt){
       // console.log("drag success, data:", data);
       return data
    }
    $scope.onDropComplete=function(data,evt){
        console.log("drop success, data:", data);
        $scope.portfolioDict[data] = ($scope.portfolioDict[data] || 0) + 1;
        $scope.portfolioArray = getArray(portfolioDict);
    }

    $scope.onClick=function(data) {
        $scope.portfolioDict[data] = ($scope.portfolioDict[data] || 0) + 1;
        $scope.portfolioArray = getArray($scope.portfolioDict);
    	console.log($scope.portfolioArray);
    }

})

function getArray (obj) {
	var array = new Array();
	angular.forEach(obj, function(price, name) {
		array.push([name,price]);
  	});
  	return array;
}

function countProperties(obj) {
    var count = 0;
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }
    return count;
}

function numberOfPages(dataArray, pageSize) {
	return Math.ceil(dataArray.length / pageSize);
}