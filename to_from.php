<?php

class Station{

	static public function stations($name){

		if(($handle = fopen("../station_codes.csv", "r")) !== false){
			echo "<select name='$name'id='{$name}_s'>";
			while(( $data = fgetcsv($handle, 1000, ",")) !== false){
				self::optionTag($data);
			}
			echo "</select>";
			fclose($handle);
		}
	}

	static private function optionTag($data){
		echo "<option value='$data[1]'> $data[0] </option>";

	}

}
