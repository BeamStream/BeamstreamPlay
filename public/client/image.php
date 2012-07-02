<?php
class Image
{
	function save()
	{
		print_R($_FILES);
// 		print_R($_POST);
// 		$arr = array('id' => 1, 'status' => 'success' , 'message'=>'Login suscces.');
// 		echo json_encode($arr);
	}
}
$Api = new Image();

$Api->save();