var ajax = (function (){
	var chart_from = document.getElementById("chart_from");
	var chart_to = document.getElementById("chart_to");

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


	function sendRequest(){

		var userInput = this.value;

		var targetEl, param;
		if(this.id == "to_s"){
			targetEl = chart_to;
			param = "to=";
		}else{
			targetEl = chart_from;
			param = "from=";

		}
		param = param + userInput;


		var request = ajaxRequest();
		console.log(request);
		request.open("POST", "http://127.0.0.1:8888/statistic.php", true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send(param);

		request.onreadystatechange = function ()
		{
		    if (this.readyState == 4)
		    {
			if (this.status == 200)
			{
			    if (this.responseText != null)
			    {
			    	console.log(this.responseText);
				var el = ddd.graph(null, targetEl.id); 
			    }
			    else
			    {
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
