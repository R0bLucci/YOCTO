<?php

class OpenLDBWS {

	private $soapClient;
	private static $URI = "https://lite.realtime.nationalrail.co.uk/OpenLDBWS/wsdl.aspx?ver=2016-02-16";
	private static $NS = "http://thalesgroup.com/RTTI/2010-11-01/ldb/commontypes";
	private static $TOKEN = ""; 
	private $totalMinsDelay;
	private $delay;
	private $cancelled;
	private $onTime;
	private $noReport;
	private $unknown;
	private $badOperators;
	private $allOperators;

	public function __construct(){

		$params = array("trace" => 1, "compression" => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP);
		$this->soapClient = new SoapClient(self::$URI, $params); 	
		$headerParams = array("ns2:TokenValue" => self::$TOKEN);
		$soapStruct = new SoapVar($headerParams, SOAP_ENC_OBJECT);
		$header = new SoapHeader(self::$NS, "AccessToken", $soapStruct, false);
		$this->soapClient->__setSoapHeaders($header);
		$this->init();

	}

	private function init(){
		$this->totalMinsDelay = 0; // total delay time
		$this->delay = 0; // Delays can be either by time differential or by the key work Delay
		$this->noReport = 0;
		$this->cancelled = 0;
		$this->onTime = 0;
		$this->unknown = 0;
		$this->badOperators = array();
		$this->allOperators = array();
	}

	private function reset(){
		$this->init();
	}

	public function call($method, $args = array()){
		try{

			return $this->soapClient->$method($args);
		}catch(SoapFault $ex){

			echo "<pre>";
			print_r($ex);
			echo "</pre>";
		}
	}
	
	public function debug($obj, $xml = false){
		if($xml) header("Content-type: text/xml");
		echo "<pre>";
		print_r($obj);
		echo "</pre>";
	}

	public function req(){
		header("Content-type: text/xml");
		echo $this->soapClient->__getLastRequest();
	}

	public function res(){
		header("Content-type: text/xml");
		echo $this->soapClient->__getLastResponse();
	}


	public function parseObj($rawObj){
		$obj = $rawObj;
		$this->reset();
		$resultObj = $obj->GetStationBoardResult;
		if(property_exists($resultObj, "trainServices")){
			$services = $resultObj->trainServices;
			foreach($services->service as $service ){
				$this->fillOperatorsArray($service);
				$this->analizer($service);
			}
		}
	}


	private function getTimeDiff($dt1, $dt2){
		if($dt1 < $dt2){
			$this->totalMinsDelay += $this->timeDiff($dt1, $dt2);
			$this->delay++;
		}
	}

	private function checkEstimatedTime($time){
		$pattern = "/\\d\\d:\\d\\d/";
		return preg_match($pattern, $time);
	}


	private function analizer($service){
		
		if(property_exists($service, "etd")){
			if($this->checkEstimatedTime($service->etd)){
				$this->delay++;
				$this->getTimeDiff($service->std, $service->etd);
				$this->checkOperator($service);
			}else{
				$this->checkValue($service->etd);

			}
		}

		if(property_exists($service, "eta")){
			if($this->checkEstimatedTime($service->eta)){
				$this->getTimeDiff($service->sta, $service->eta);
				$this->checkOperator($service);
			}else{
				$this->checkValue($service->eta);
			}
		}
	}

	private function fillOperatorsArray($service){
		if(property_exists($service, "operator")){
			if(!in_array($service->operator, $this->allOperators)){
				array_push($this->allOperators, $service->operator);
			}
		}
	}
		

	public function checkOperator($service){
		if(property_exists($service, "operator")){

			array_push($this->badOperators, $service->operator);
		}
	}
	
	private function checkValue($value){
		if($this->isOnTime($value)) $this->onTime++;
		else if($this->isCancelled($value)) $this->cancelled++;
		else if($this->isDelayed($value)) $this->delay++;
		else if($this->isNoReport($value)) $this->noReport++;
		else $this->unknown++; 
	}

	private function timeDiff($firstTime,$lastTime) {
    		$time1 = strtotime($firstTime);
		$time2 = strtotime($lastTime);
		$diff = $time2 - $time1;
		return floatval(date('H.i', $diff)) * 100;
	}

	private function isDelayed($value){
		return preg_match("/.*?Delayed.*?/i", $value);
	}

	private function isCancelled($value){
		return preg_match("/.*?Cancelled.*?/i", $value);
	}

	private function isOnTime($value){
		return preg_match("/.*?On time.*?/i", $value);
	}

	private function isNoReport($value){
		return preg_match("/.*?No report.*?/i", $value);
	}


	public function getOnTime(){
		return $this->onTime;
	}

	public function getCancelled(){
		return $this->cancelled;
	}
	
	public function getNoReport(){
		return $this->noReport;
	}

	public function getUnknown(){
		return $this->unknown;
	}

	public function getDelay(){
		return $this->delay;
	}

	public function getTotalMinDelay(){
		return $this->totalMinDelay;
	}

	public function getBadOperators(){ 
		return 	array_count_values($this->badOperators); 
	}

	public function getAllOperators(){
		return $this->allOperators;
	}

	public function transformToXML(){
		$xml = new DomDocument("1.0", "UTF-8");
		$parent = $this->createAndAppend($xml, $xml, "data");
		$this->createAndAppend($xml, $parent, "ontime", $this->onTime);
		$this->createAndAppend($xml, $parent, "cancelled", $this->cancelled);
		$this->createAndAppend($xml, $parent, "noreport", $this->noReport);
		$this->createAndAppend($xml, $parent, "unknown", $this->unknown);
		$this->createAndAppend($xml, $parent, "delay", $this->delay);
		$this->createAndAppend($xml, $parent, "totalminsdelay", $this->totalMinsDelay);
		$parent2 = $this->createAndAppend($xml, $parent, "alloperators");
		foreach($this->allOperators as $operator){
		
			$this->createAndAppend($xml, $parent2, "operator", $operator);
		}

		$parent3 = $this->createAndAppend($xml, $parent, "badoperators");

		foreach($this->getBadOperators() as $operator => $value){
		
			$this->createAndAppend($xml, $parent3, "badoperator", $operator . ": ". $value);
		}

		$xml->FormatOutput = true;
		header("Content-type: text/xml");
		echo $xml->saveXML();
	}


	private function createAndAppend($dom, $parent, $elName, $elTextNodeValue = null){
		if($elTextNodeValue !== null) {
			$elName = str_replace(" ", "_", $elName);
			$create = $dom->createElement($elName, "$elTextNodeValue");
		} else { 
			$create = $dom->createElement($elName);	
		}

		$create = $parent->appendChild($create);	
		return $create;

	}
	public function getAll(){
		echo "cancelled: ". $this->cancelled ."<br />";
		echo "on time: ". $this->onTime ."<br />";
		echo "no report: ". $this->noReport ."<br />";
		echo "unknown: ". $this->unknown ."<br />";
		echo "delay: ". $this->delay ."<br />";
		echo "total mins delay: ". $this->totalMinsDelay ."<br />";
		foreach($this->getBadOperators() as $o => $v){
			echo $o . "  " . $v. "<br />";
		}
	}
}


function consume(){
	if(isset($_POST)){
		$ldbws = new OpenLDBWS();
		$crs = (isset($_POST["to"])) ? $_POST["to"] : $_POST["from"];
		$res = $ldbws->call("GetArrivalDepartureBoard", array("numRows" => 149, "crs" => $crs));
		//$ldbws->debug($res);
		$ldbws->parseObj($res);
		//$ldbws->getAll();
		$ldbws->transformToXML();
		unset($_POST);
	}
}
