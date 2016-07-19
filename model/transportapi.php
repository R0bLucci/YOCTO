<?php

class TransportAPI {
	private static $URI = "http://transportapi.com/v3/uk/";
	private static $APP_ID = "";
	private static $APP_KEY = "";


	public function __construct(){}

	private function apiParams($moreParams = array()){	
		return "?app_id=".self::$APP_ID."&app_key=".self::$APP_KEY.$this->parseParams($moreParams);

	}

	private  function parseParams($params= array()){
		$string = "";

		foreach($params as $key => $value){
			$string .= "&".$key."=".$value;
		}

		return $string;
	}

	public function timeTable($mode, $stationCode, $date = "", $time = "", $addParams = array()){

		return self::$URI."$mode/station/$stationCode/$date/$time/timetable.json".$this->apiParams($addParams);
	}

	public function liveService($mode, $stationCode, $addParams = array()){

		return self::$URI."$mode/station/$stationCode/live.json".$this->apiParams($addParams);
	}

	public function journeyDetail($mode, $from, $to, $type = "", $date = "", $time= "", $addParams= array()){

		return self::$URI."$mode/journey/from/{$this->encodeName($from)}/to/{$this->encodeName($to)}/$type/$date/$time.json".$this->apiParams($addParams);
	}

	public function journey($mode, $from, $to, $addParams= array()){

		return self::$URI."$mode/journey/from/{$this->encodeName($from)}/to/{$this->encodeName($to)}.json".$this->apiParams($addParams);
	}

	public function parse($URI){
		$jsonData = file_get_contents($URI);
		$json = json_decode($jsonData, true); 
		$this->formatOutput($json);
	}

	private function formatOutput($obj){
		echo "<pre>";
		print_r($obj);
		echo "</pre>";
	}

	private function encodeName($station){
		return str_replace(" ", "%20", $station);
	}

	public function getStationName($code){
		$result = "";
		if(($handle = fopen("../station_codes.csv", "r")) !== false){
			while(($data = fgetcsv($handle, 1000,",")) !== false){
				if($this->isStation($data, $code)){
					$result = $data[0];
					break;
				}
			}
			fclose($handle);
		}	
		return $result;
	}

	public function changeKey($json){
		$json = str_replace("routes", "children", $json);
		$json = str_replace("route_parts", "children", $json);
		$json = str_replace("from_options", "children", $json);
		$json = str_replace("to_options", "children", $json);
		return $json;
	}
	


	private function isStation($data, $code){
		if($code == $data[1]){
			return true;	
		}
		return false;
	}
	
}

if(isset($_POST["submit"])){
	$client = new TransportAPI();
	//$client->parse($client->timeTable("train", "LBG", null, null, ["passenger" => 3]));

	$query = $client->journey("public", $client->getStationName($_POST["from"]) , $client->getStationName($_POST["to"]), ["region" => "tfl"]);

	$content = file_get_contents($query);
	$content = $client->changeKey($content);
	echo $content;

	file_put_contents("js/journey.json", $content);
}
