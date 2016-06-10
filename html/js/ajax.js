var ajax = (function (){
	// Select pie chart element 
	var chart_from = document.getElementById("chart_from");
	var chart_to = document.getElementById("chart_to");


	// Select bar chart element 
	var bar_from = document.getElementById("bar_from");
	var bar_to = document.getElementById("bar_to");


	var operators_from = document.getElementById("operators_from");
	var operators_to = document.getElementById("operators_to");

	var bad_operators_from = document.getElementById("bad_operators_from");
	var bad_operators_to = document.getElementById("bad_operators_to");

	var toEl = document.getElementById("to_s");
	var fromEl = document.getElementById("from_s");

	toEl.addEventListener("change", sendRequest, false);
	fromEl.addEventListener("change", sendRequest, false);

	function ajaxRequest(){
		try{
			var req = new XMLHttpRequest();
		}catch(e1){
			try{
				req = new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e2){
				try{
					req = new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e3){
					req = false;
				}
			}
		}
		return req;
	}
	
	function getAllOperators(xml, tagName){
		var operators = [];
		xml.getElementsByTagName(tagName)[0].childNodes.forEach( d =>operators.push(d.innerHTML));
		return operators;
	}	
	
	function showAllOperators(xml, el, badEl){
		var operators = getAllOperators(xml, "alloperators");
		if(operators.length > 0){
			var text = "<h3> Operators </h3><ul>";
			operators.forEach( function(o) {
				var t = "<li>" + o + "</li>";	
				text = text + t;
			});
			el.innerHTML = text + "</ul>";	
		}
		
		var badOperators = getAllOperators(xml, "badoperators");

		if(badOperators.length > 0){	
			var text2= "<h3> Bad Operators </h3><ul>";
			badOperators.forEach( function(o){
				var t = "<li>" + o + "</li>";	
				text2 = text2 + t;
			});
			badEl.innerHTML = text2 + "</ul>";	
		}
	}

	function dataManipulationPie(xml){
		var data = [];
		push(data, extractValue(xml, "ontime"));
		push(data, extractValue(xml, "cancelled"));
		push(data, extractValue(xml, "noreport"));
		push(data, extractValue(xml, "unknown"));
		push(data, extractValue(xml, "delay"));
		console.log(xml);
		return data;
	}

	function dataManipulationBar(xml){
		var data = [];
		push(data, extractValue(xml, "totalminsdelay"));
		return data;
	}

	function extractValue(xml, tagName){
		return xml.getElementsByTagName(tagName)[0].childNodes[0].nodeValue;
	}

	function push(arr, value){
		arr.push(value);
	}

	function sendRequest(){

		var userInput = this.value;

		var targetPieEl, targetBarEl, param, operatorEl, badOperatorEl;
		if(this.id == "to_s"){
			targetPieEl = chart_to;
			targetBarEl = bar_to;
			operatorEl =  operators_to;
			badOperatorEl =  bad_operators_to;
			param = "to=";
		}else{
			targetPieEl = chart_from;
			targetBarEl = bar_from;
			operatorEl =  operators_from;
			badOperatorEl =  bad_operators_from;
			param = "from=";

		}
		param = param + userInput;

		console.log(param);
		var request = ajaxRequest();
		request.open("POST", "http://127.0.0.1:8888/statistic.php", true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send(param);

		request.onreadystatechange = function ()
		{
		    if (this.readyState == 4)
		    {
			if (this.status == 200)
			{
			    if (this.responseXML != null){ 
				var doc = this.responseXML;
				var dataPie = dataManipulationPie(doc);
				var dataBar = dataManipulationBar(doc);
				showAllOperators(doc, operatorEl, badOperatorEl);
				ddd.graphPie(dataPie, targetPieEl.id); 
				ddd.graphBar(dataBar, targetBarEl.id); 
			    }else{

				alert("Ajax error: No data received");
			    }
			}
			else
			{
			    alter("Ajax error: " + this.statusText);
			}
		    }
		};
	}

})();
