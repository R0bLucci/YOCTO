var ajax = (function (){
	var chart_from = document.getElementById("chart_from");
	var chart_to = document.getElementById("chart_to");

	var toEl = document.getElementById("to_s");
	var fromEl = document.getElementById("from_s");

	var bar_from = document.getElementById("bar_from");
	var bar_to = document.getElementById("bar_to");

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

		var targetPieEl, targetBarEl, param;
		if(this.id == "to_s"){
			targetPieEl = chart_to;
			targetBarEl = bar_to;
			param = "to=";
		}else{
			targetPieEl = chart_from;
			targetBarEl = bar_from;
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
				var dataPie = dataManipulationPie(this.responseXML);
				var dataBar = dataManipulationBar(this.responseXML);
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
