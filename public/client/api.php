<?php
class Api
{
	function save()
	{
 
				$arr = array('id' => 1, 'status' => 'Success' ,'iam' => '1', 'message'=>'Login suscces.', 'emailId' => 'aswathy@toobler.com');
// // 				$arr = array('id' => 1, 'status' => 'fail' , 'message'=>'The username or password you entered is incorrect.');
// 		$arr = array('id' => array(), 'userType' => array('name' => 'Educator'),'email' => 'ayush@knoldus.com' ,'firstName' => 'Ayush', 'lastName' => 'Mishra' ,'userName' => 'ayush' ,'alias' => ' ' , 'password' => 'ayush', 'orgName' => 'Ayush' ,'location' => '1212121','streams' => array( ), 'schoolId' => array(),'classId' => array());
		
				
				 
		echo json_encode($arr);
	}
}

// $print_r($_POST);
$Api = new Api();

$Api->save();