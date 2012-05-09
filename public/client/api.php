<?php
class Api
{
	function save()
	{
		$arr = array('id' => 1, 'status' => 'Success');

		echo json_encode($arr);
	}
}


$Api = new Api();

$Api->save();