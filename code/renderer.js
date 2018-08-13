const d3 = require('d3');

global.heatMapValues = [];
global.screenDimensions = {width: screen.width, height: screen.height};
init();

function init() {
    var noDataGraphs = [
        {key: "Nothing yet!", value: 10}
    ];
    pieChart(noDataGraphs);
    barChart(noDataGraphs);
}

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

function barChart(keyPressdata) {

    var clearBar = document.getElementById('barChart');
    clearBar.innerHTML = "";

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = screenDimensions.height * .42 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Scale the range of the data in the domains
    x.domain(keyPressdata.map(function (d) {
        return d.key;
    }));
    y.domain([0, d3.max(keyPressdata, function (d) {
        return d.value;
    })]);

    // append the rectangles for the bar chart
    svg.selectAll("#barChart")
        .data(keyPressdata)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.key);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr('fill', (d, i) => color(i))
        .on("mouseover", function (d) {
            d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "white");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current));
        })
        .each(function (d, i) {
            this._current = i;
        });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axisColour")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .attr("class", "axisColour")
        .call(d3.axisLeft(y));

}

function pieChart(keyPressData) {

    var test = document.getElementById('chart');
    test.innerHTML = "";
    var text = "";

    var width = 260;
    var height = 260;
    var thickness = 40;
    var duration = 750;

    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("#chart")
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) {
            return d.value;
        })
        .sort(null);

    var path = g.selectAll('path')
        .data(pie(keyPressData))
        .enter()
        .append("g")
        .on("mouseover", function (d) {
            let g = d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "black")
                .append("g")
                .attr("class", "text-group");

            g.append("text")
                .attr("class", "name-text")
                .text(`${d.data.key}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '-1.2em');

            g.append("text")
                .attr("class", "value-text")
                .text(`${d.data.value}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '.6em');
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current))
                .select(".text-group").remove();
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .on("mouseover", function (d) {
            d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "white");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current));
        })
        .each(function (d, i) {
            this._current = i;
        });

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(text);
}

require('electron').ipcRenderer.on('ping', (event, message) => {
    pieChart(message);
    barChart(message);
});