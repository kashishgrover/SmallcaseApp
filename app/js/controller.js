angular.module('SmallcaseTask.controller', [])

.controller('stocksController', function($scope, $http) {

	$scope.stockPageSize = 8;
	$scope.currentPage = 0;
	$scope.portfolioArray = new Array();
	$scope.portfolioDict = {};
	$scope.netWorth = 0;

	var isDropping = true;

	$http.get('data/data.json').success(function(data) {
		$scope.stockPrices = getArray(data.price);
		$scope.totalStocks = $scope.stockPrices.length;
    	$scope.numberOfPages = numberOfPages($scope.stockPrices, $scope.stockPageSize);
		$scope.stockEPSobj = data.eps;
		// console.log("Stock EPS",$scope.stockEPSobj);
		$scope.stockHistoricals = data.historical;
	});

    $scope.onDropComplete=function(data,evt) {
    	isDropping = true;
        $scope.portfolioDict[data] = ($scope.portfolioDict[data] || 0) + 1;
        $scope.portfolioArray = getArray($scope.portfolioDict);
        $scope.netWorth = calculateNetWorth($scope.portfolioArray);
    }

    $scope.onClick=function(data) {
    	if (isDropping) 
    		isDropping = false;
    	else {
	        $scope.portfolioDict[data] = ($scope.portfolioDict[data] || 0) + 1;
	        $scope.portfolioArray = getArray($scope.portfolioDict);
	        $scope.netWorth = calculateNetWorth($scope.portfolioArray);
    	}
    }

    $scope.incrementShareCount = function(element) {
        $scope.portfolioDict[element[0]] = ($scope.portfolioDict[element[0]] || 0) + 1;        
        $scope.portfolioArray = getArray($scope.portfolioDict);
        $scope.netWorth = calculateNetWorth($scope.portfolioArray);
    }

    $scope.decrementShareCount = function(element) {
    	if($scope.portfolioDict[element[0]] == 1) {
    		delete $scope.portfolioDict[element[0]];
        	$scope.portfolioArray = getArray($scope.portfolioDict);
        	$scope.netWorth = calculateNetWorth($scope.portfolioArray);
    	}
    	else {
    		$scope.portfolioDict[element[0]] = ($scope.portfolioDict[element[0]] || 0) - 1;
        	$scope.portfolioArray = getArray($scope.portfolioDict);
        	$scope.netWorth = calculateNetWorth($scope.portfolioArray);
    	}
    }

    $scope.getWeightage = function(element) {
    	// Weightage = (Stock Price * Shares Held)/Net Worth
    	var price = element[0].split(",")[1];
    	var shareCount = element[1];
    	var weightage = (price * shareCount) / $scope.netWorth * 100;
    	return weightage.toFixed(2);
    }

    $scope.getPERatio = function() {
    	// Portfolio P/E Ratio = Net Worth/Sum(Stock EPS * Shares Held)
    	var netWorth = $scope.netWorth;
    	var array = $scope.portfolioArray;

    	if (array.length === 0) {
    		return 0;
    	}

    	var stockEPSobj = $scope.stockEPSobj;

    	var sum = 0;
		for (var i = 0; i < array.length; i++) {
			var stockName = array[i][0].split(",")[0];
			var stockEPS = stockEPSobj[stockName];
			var stockSharesHeld = array[i][1];
			sum += (stockEPS * stockSharesHeld);
		}

		return (netWorth/sum).toFixed(2);
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

function calculateNetWorth(array) {
	var arrayLength = array.length;
	var netWorth = 0;
	for (var i = 0; i < arrayLength; i++) {
		var price = array[i][0].split(",")[1];
		var count = array[i][1];
		netWorth += (price * count);
	}
	return netWorth.toFixed(2);
}