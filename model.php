<?php
define("JSON_FILE_PATH", "./jsons/".$_GET['collection_title']."/");

	function save() {
		$values = json_decode(file_get_contents('php://input'), true);
		$jsonFile = JSON_FILE_PATH.$values['idAttribute'].".json";
		$handle = fopen($jsonFile,"w");
		fwrite($handle, json_encode($values, JSON_UNESCAPED_UNICODE));
		fclose($handle);
		echo json_encode($values, JSON_UNESCAPED_UNICODE);
	}
	
	function fetch() {
		$jsonFile = JSON_FILE_PATH.$_GET['idAttribute'].".json";
		$fh = fopen($jsonFile, 'r');
		$content = fread($fh, filesize($jsonFile));
		fclose($fh);
		echo $content;
	}

	function destroy() {
		$jsonFile = JSON_FILE_PATH.$_GET['idAttribute'].".json";
		$data = true == unlink($jsonFile) ? "{success: true}" : "{success: false}";
		echo json_encode($data, JSON_UNESCAPED_UNICODE);
	}

	switch($_SERVER['REQUEST_METHOD']){
		case 'POST':
			// create new item
			save();
			break;
		case 'GET':
			// get item(s)
			fetch();
			break;
		case 'PUT':
			// update item
			save();
			break;
		case 'DELETE':
			// delete item
			destroy();
			break;
	}

?>
