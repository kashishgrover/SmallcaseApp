angular.module('SmallcaseTask.directive', [])
.directive("linearChart", function($window) {
    return {
      restrict: "EA",
      template: "<svg width='850' height='200'></svg>",
      link: function(scope, elem, attrs){
        var padding = 20;
        var pathClass="path";
        var xScale, yScale, xAxisGen, yAxisGen, lineFun;

        var d3 = $window.d3;
        var rawSvg=elem.find('svg');
        var svg = d3.select(rawSvg[0]);
        var dateFormat = d3.time.format("%Y-%m-%d");
        
        scope.$watch('arrayToPlot', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            drawLineChart(scope.arrayToPlot);
            console.log("asdf");
          }
        });

        function drawLineChart(array) {

          var dateArray = [];
          var priceArray = [];

          for (var i=0;i<array.length;i++) {
            dateArray[i] = array[i].split("***")[0];
            priceArray[i] = array[i].split("***")[1];
          }


          // console.log(array);
          setChartParameters(dateArray, priceArray);

          svg.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,180)")
            .call(xAxisGen);

          svg.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(20,0)")
            .call(yAxisGen);

          svg.append("svg:path")
            .attr({
              d: lineFun(array),
              "stroke": "blue",
              "stroke-width": 2,
              "fill": "none",
              "class": pathClass
            });
        }

        function setChartParameters(dateArray, priceArray){

          xScale = d3.time.scale()
            .range([0,1000]);

          // .linear()
          //   .domain([dateArray[0], dateArray[23]])
          //   .range([padding + 5, rawSvg.attr("width") - padding]);

          var yScale = d3.scale.linear()
            .range([1000, 0]);

          // yScale = d3.scale.linear()
          //   .domain([0, 1200])
          //   .range([rawSvg.attr("height") - padding, 0]);

          xAxisGen = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

            // .ticks(dateArray.length - 1);

          yAxisGen = d3.svg.axis()
            .scale(yScale)
            .orient("left");
            
            // .ticks(5);

          lineFun = d3.svg.line()
            .x(function (d) {
              var date = d.split("***")[0].split("T")[0];
              var d3date = dateFormat.parse(String(date));
              // console.log("'"+date+"'");
              console.log(d3date);
              return xScale(d3date);
            })
            .y(function (d) {
               return yScale(d[1]);
            })
            .interpolate("basis");
        }

      }
    };
  });