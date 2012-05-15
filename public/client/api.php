<?php
class Api
{
	function save()
	{

		$arr = array('id' => 1, 'status' => 'Success');

		echo json_encode($arr);
	}
}

$print_r($_REQUEST);
$Api = new Api();

$Api->save();