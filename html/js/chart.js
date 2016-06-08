(function () {
	var dataA = [20, 33, 67, 80];
	var width = 500;
	var height = 500;

	var widthScale = d3.scale.linear()
			.domain([0, 80])
			.range([0, width]);

	var color = d3.scale.linear()
			.domain([0, 80])
			.range(["red", "blue"]);


	var canvas = d3.select("#chart_to")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

	var bars = canvas.selectAll("rect")
			.data(dataA)
			.enter()
				.append("rect")
				.attr("width", function(d) {return widthScale(d); })
				.attr("height", 50)
				.attr("fill", function (d) { return color(d);})
				.attr("y", function(d,i) { return i * 100 });
})();

(function () {
	var dataA = [20, 33, 67, 80];
	var width = 500;
	var height = 500;

	var widthScale = d3.scale.linear()
			.domain([0, 80])
			.range([0, width]);

	var color = d3.scale.linear()
			.domain([0, 80])
			.range(["red", "blue"]);


	var canvas = d3.select("#chart_from")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

	var bars = canvas.selectAll("rect")
			.data(dataA)
			.enter()
				.append("rect")
				.attr("width", function(d) {return widthScale(d); })
				.attr("height", 50)
				.attr("fill", function (d) { return color(d);})
				.attr("y", function(d,i) { return i * 100 });
})();
