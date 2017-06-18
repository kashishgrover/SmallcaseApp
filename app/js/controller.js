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
		$scope.stockEPS = data.eps;
		console.log($scope.stockEPS);
		$scope.stockHistoricals = data.historical;
	});

    $scope.onDropComplete=function(data,evt) {
    	isDropping = true;
        // console.log("drop success, data:", data);
        $scope.portfolioDict[data] = ($scope.portfolioDict[data] || 0) + 1;
        $scope.portfolioArray = getArray($scope.portfolioDict);
        $scope.netWorth = calculateNetWorth($scope.portfolioArray);
    	// console.log("26: ",$scope.portfolioArray);
    }

    $scope.onClick=function(data) {
    	if (isDropping) 
    		isDropping = false;
    	else {
	        $scope.portfolioDict[data] = ($scope.portfolioDict[data] || 0) + 1;
	        $scope.portfolioArray = getArray($scope.portfolioDict);
	        $scope.netWorth = calculateNetWorth($scope.portfolioArray);
	    	// console.log("32: ",$scope.portfolioArray);
    	}
    }

    $scope.incrementShareCount = function(element) {
        $scope.portfolioDict[element[0]] = ($scope.portfolioDict[element[0]] || 0) + 1;        
        $scope.portfolioArray = getArray($scope.portfolioDict);
        $scope.netWorth = calculateNetWorth($scope.portfolioArray);
    	// console.log("41: ",$scope.portfolioArray);
    }

    $scope.decrementShareCount = function(element) {
    	if($scope.portfolioDict[element[0]] == 1) {
    		delete $scope.portfolioDict[element[0]];
        	$scope.portfolioArray = getArray($scope.portfolioDict);
        	$scope.netWorth = calculateNetWorth($scope.portfolioArray);
        	// console.log("48: ",$scope.portfolioArray);
    	}
    	else {
    		$scope.portfolioDict[element[0]] = ($scope.portfolioDict[element[0]] || 0) - 1;
        	$scope.portfolioArray = getArray($scope.portfolioDict);
        	$scope.netWorth = calculateNetWorth($scope.portfolioArray);
        	// console.log("53: ",$scope.portfolioArray);
    	}
    }

    $scope.getWeightage = function(element) {
    	// Weightage = (Stock Price * Shares Held)/Net Worth
    	var price = element[0].split(",")[1];
    	var shareCount = element[1];
    	// console.log("Stock Price: ", price);
    	// console.log("Shares Held: ", element[1]);
    	// console.log("Net Worth: ", $scope.netWorth);
    	var weightage = parseFloat(Math.round(((price * shareCount) / $scope.netWorth) * 100)).toFixed(2);
    	return weightage;
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
	// console.log(array);
	var arrayLength = array.length;
	var netWorth = 0;
	for (var i = 0; i < arrayLength; i++) {
		var price = array[i][0].split(",")[1];
		var count = array[i][1];
		// console.log("Element", array[i]);
		// console.log("Price: ",price);
		// console.log("Count: ",count);
		netWorth += (price * count);
	}
	// console.log("NetWorth = ",netWorth)
	return netWorth;
}