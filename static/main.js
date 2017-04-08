var socket = io.connect('http://' + document.domain + ':' + location.port);



// Set the dimensions of the canvas / graph
var margin = {
        top: 30,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().domain([0, 2000]).range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) {
        return x(d[0]);
    })
    .y(function(d) {
        return y(d[1]);
    });

// Adds the svg canvas
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

// Scale the range of the data
x.domain(d3.extent(sizeOfPackages, function(d) {
    return d[0];
}));

// y.domain([0, d3.max(sizeOfPackages, function(d) {
//     return d[1];
// })]);

// Add the valueline path.
svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(sizeOfPackages));

// Add the X Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// });


// d3.selectAll('.card-action > a').on('click', function() {
d3.select('video').on('play', function() {
    // setInterval(function() {
    //     update({
    //         0: packages++,
    //         1: Math.floor(Math.random() * 1000)
    //     });
    // }, 200);

    socket.on('connect', function() {
        console.log('package-arrived');
    });

    socket.on('package-arrived', function(data) {
        if (packages % 10 == 0)
            update({
                0: packages++,
                1: parseInt(data)
            });
        packages++;
        console.log(data);
    });
});

function update(new_item) {

    sizeOfPackages.shift();
    sizeOfPackages.push();

    x.domain(d3.extent(sizeOfPackages, function(d) {
        return d[0];

    }));
    // y.domain([0, d3.max(sizeOfPackages, function(d) {
    //     return d[1];
    // })]);

    svg.select(".line").attr("d", valueline(sizeOfPackages));
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
}

//});
