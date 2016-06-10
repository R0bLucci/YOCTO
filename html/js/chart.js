var ddd = (function factory() {

	function removeSvg(id){
		var el = document.getElementById(id);
		var svg = el.childNodes[0];
		if(svg) el.removeChild(svg);
	}


	function createPieChart(data, elId) {
	
		removeSvg(elId);

		data = data || [0,0,0,0,0]

		var width = 600;
		var height = 600;
		var r = 50;
		
		var color = d3.scale.ordinal()
				.range(["green", "red", "blue", "orange", "white"]);

		var canvas = d3.select("#" + elId)
				.append("svg")
				.attr("width", width)
				.attr("height", height);
		
		var group = canvas.append("g")
				.attr("transform", "translate(300, 300)");

		var arc = d3.svg.arc()
				.innerRadius(200)
				.outerRadius(r);

		var pie = d3.layout.pie()
				.value(function (d) { return d;});

		var arcs = group.selectAll(".arc")
				.data(pie(data))
				.enter()
				.append("g")
				.attr("class", "arc");
		
		arcs.append("path")
			.attr("d", arc)
			.attr("fill", function (d){ return color(d.data); });


		arcs.append("text")
			.attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
			.attr("text-anchor", "middle")
			.attr("font-size", "1.5em")
			.text(function (d){ return d.data; });
	}

	function createBarChart(data, elId){
		removeSvg(elId);

		data = data || [0];

		var width = 500;

		var height = 500;

		var widthScale = d3.scale.linear()
				.domain([0, data[0]])
				.range([0, width]);	

		var color = d3.scale.linear()
				.domain([0, data[0]])
				.range(["green", "red"]);

		var canvas = d3.select("#" + elId)
				.append("svg")
				.attr("width", width)
				.attr("height", height);
		
		var bars = canvas.selectAll("rect")
				.data(data)
				.enter()
					.append("rect")
					.attr("width", function (d){ return widthScale(d); })
					.attr("fill", function (d) {return color(d); })
					.attr("height", 50)
					.attr("y", function(d, i) { return i *100; });
	}

	var API = {
			graphPie: createPieChart,
		    	graphBar: createBarChart
		};

	return API;
})();
