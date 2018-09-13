import * as d3 from "d3";

const graph = (data) => {
    d3.select("svg").selectAll("*").remove();
    var svg = d3.select("svg"),
        margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function (d) {
            return x(d.match);
        })
        .y(function (d) {
            return y(d.score);
        });

    x.domain([
        d3.min(data, function (c) {
            return d3.min(c.values, function (d) {
                return d.match;
            });
        }),
        d3.max(data, function (c) {
            return d3.max(c.values, function (d) {
                return d.match;
            });
        })
    ]);

    y.domain([
        d3.min(data, function (c) {
            return d3.min(c.values, function (d) {
                return d.score;
            });
        }),
        d3.max(data, function (c) {
            return d3.max(c.values, function (d) {
                return d.score;
            });
        })
    ]);

    z.domain(data.map(function (c) {
        return c.id;
    }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("score");

    var player = g.selectAll(".player")
        .data(data)
        .enter().append("g")
        .attr("class", "player");

    player.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            return z(d.id);
        });

    player.append("text")
        .datum(function (d) {
            return {id: d.id, value: d.values[d.values.length - 1], wins: d.values[d.values.length - 1].wins, losses: d.values[d.values.length - 1].losses};
        })
        .attr("transform", function (d) {
            return "translate(" + x(d.value.match) + "," + y(d.value.score) + ")";
        })
        .attr("x", 3)
        .attr("dy", "-0.3em")
        .style("font", "10px sans-serif")
        .text(function (d) {
            return (d.value.wins + d.value.losses) == 0 ? '' : d.id + " (" + d.value.score + ")";
        });

    player.append("text")
        .datum(function (d) {
            return {id: d.id, value: d.values[d.values.length - 1], wins: d.values[d.values.length - 1].wins, losses: d.values[d.values.length - 1].losses};
        })
        .attr("transform", function (d) {
            return "translate(" + x(d.value.match) + "," + y(d.value.score) + ")";
        })
        .attr("x", 3)
        .attr("dy", "1em")
        .style("font", "10px sans-serif")
        .text(function (d) {
            return (d.value.wins + d.value.losses) == 0 ? '' : "P: " + (d.value.wins + d.value.losses) + " W: " + Math.round(d.value.wins * 100 / (d.value.wins + d.value.losses)) + '%';
        });

    function type(d, _, columns) {
        for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
    }

};

export default () => {
    jQuery.ajax({
        url: '/api/data',
        cache: false
    }).done((result) => {
        graph(result);
    });
};
