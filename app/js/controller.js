angular.module('SmallcaseTask.controller', [])

.controller('stocksController', function($scope, $http) {

	$scope.stockPageSize = 8;
	$scope.currentPage = 0;

	$http.get('data/data.json').success(function(data) {
		$scope.stockPrices = getArray(data.price);
		$scope.totalStocks = $scope.stockPrices.length;
    	$scope.numberOfPages = numberOfPages($scope.stockPrices, $scope.stockPageSize);
		$scope.stockEPS = data.eps;
		$scope.stockHistoricals = data.historical;
	});

	$scope.onDragComplete=function(data,evt){
       console.log("drag success, data:", data);
    }
    $scope.onDropComplete=function(data,evt){
        // console.log("drop success, data:", data);
        $scope.dragText = data;
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