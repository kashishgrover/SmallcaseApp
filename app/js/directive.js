angular.module('SmallcaseTask.directive', [])
.directive("linearChart", function($window) {
  return {
    restrict: "EA",
    template: "<svg width='320' height='210'></svg>",
    link: function(scope, elem, attrs){
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 320 - margin.left - margin.right,
          height = 210 - margin.top - margin.bottom;

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);
      
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var parseDate = d3.time.format("%Y-%m-%d").parse;
      
      var data = null;
      
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0])

      scope.$watch('arrayToPlot', function(newVal, oldVal) {

        if (newVal !== oldVal) {

          d3.selectAll("svg > *").remove();

          arrData = scope.arrayToPlot;
          
          data = arrData.map(function(d) {
            // console.log(+parseDate(d[0]));
            // console.log(+d[1]);
            return {
               date : +parseDate(d[0])/100000,
               totalprice : +d[1]
            };            
          });
          // console.log(data);

          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain(d3.extent(data, function(d) { return d.totalprice; }));

          var line = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.totalprice); });

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .text("Time");

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price (₹)");

          svg.append("path")
            .datum(data)
            .attr("fill", "steelblue")
            .attr("class", "line")
            .attr("d", line);
        }
      });
    }
  };
});

// function mapData(arrData) {
//   var data = arrData.map(function(d) {
//     console.log(+parseDate(d[0]));
//     console.log(+d[1]);
//     return {
//        date : +parseDate(d[0])/100000,
//        totalprice : +d[1]
//     };            
//   });

//   return data;
// }