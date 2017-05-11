var margin = {
        top: 30,
        right: 20,
        bottom: 30,
        left: 50
},
width = 600 - margin.left - margin.right,
height = 270 - margin.top - margin.bottom;

var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var valueline = d3.svg.line()
    .x(function(d) {
        return x(d[0]);
    })
    .y(function(d) {
        return y(d[1]);
    });

var svg = d3.select(".visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var packages = 0;
var sizeOfPackages = [];

for (var i = 0; i < 150; i++) {
    var d = {
        0: packages++,
        1: 0
    };
    sizeOfPackages.push(d);
}

x.domain(d3.extent(sizeOfPackages, function(d) {
    return d[0];
}));

y.domain([0, d3.max(sizeOfPackages, function(d) {
    return d[1];
})]);

svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(sizeOfPackages));

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

d3.select('video').on('play', function() {
    var interval = setInterval(function() {
        update({
            0: packages++,
            1: packagesFromServer.shift() 
        });	
    }, 200);
});

function update(new_item) {

    sizeOfPackages.shift();
    sizeOfPackages.push(new_item);

    x.domain(d3.extent(sizeOfPackages, (d) =>  d[0]));

    y.domain([0, d3.max(sizeOfPackages, (d) =>  d[1])]);

    svg.select(".line").attr("d", valueline(sizeOfPackages));
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
}
