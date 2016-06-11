(function() {
	var canvas = d3.select("#map")
			.append("svg")
			.attr("width", 700)
			.attr("height", 700)
			.append("g")
				.attr("transform", "translate(50, 50)");

	var tree = d3.layout.tree()
			.size([550, 550]);

	
	d3.json("js/journey.json", function (data) {

		var toolTipDiv = document.getElementById("showTT");	
		
		function toolTip(){
			toolTipDiv.innerHTML= this.innerHTML;
		}

		// Check if data has identification property to get its children
		// from the journey.json file.
		// The journey.json file has been generated from the PHP transportapi.php file

		if(data.identification){
			data = data.identification;
		}


		var nodes = tree.nodes(data);
		console.log(nodes);
		var links = tree.links(nodes);
		console.log(links);

		var node = canvas.selectAll(".node")
				.data(nodes)
				.enter()
				.append("g")
					.attr("class", "node")
					.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"});

		node.append("circle")
			.attr("r", 10)
			.attr("fill","steelblue");

		node.append("text")
			.attr("class", "tool_tip")
			.text(function(d) {  
				this.addEventListener("mouseover", toolTip, false);
				if(d.mode){
					var t = "Mode: " + d.mode + 
						" From: " + d.from_point_name + 
						" To: " + d.to_point_name;
					return t;		
				} else if (d.duration){
					var t2 = "duration: " + d.duration;
					return t2;
				}else if( d.name){
					var t3 = "Name; "+ d.name;
					return t3;
				}
			})
			.attr("opacity", 0);


		var diagonal = d3.svg.diagonal()
				.projection(function (d) { return [d.y, d.x]; });

		canvas.selectAll(".link")
			.data(links)
			.enter()
			.append("path")
			.attr("class", "link")
			.attr("fill", "none")
			.attr("stroke", "#ADADAD")
			.attr("d", diagonal);

	});

})();
