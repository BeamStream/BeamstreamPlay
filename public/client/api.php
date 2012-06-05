<?php
class Api
{
	function save()
	{
// 		print_R($_POST);
				$arr = array('id' => 1, 'status' => 'Success' ,'iam' => '1', 'message'=>'Login suscces.', 'emailId' => 'aswathy@toobler.com');
// // 				$arr = array('id' => 1, 'status' => 'fail' , 'message'=>'The username or password you entered is incorrect.');
// // 		$arr = array(array('id' => array('schoolId' => '4fbf0fdfsdfc6e84aebaf604fb43eb'), 'schoolName' => 'ggg','year' => 'Sophomore' ,'degree' => 'Doctorate(Phd)', 'major' => 'Chemsitry' ,'graduated' => 'yes' ,'graduationDate' => '01/05/2011' , 'degreeExpected' => 'Winter 2013', 'classes' => array()),array('id' => array('schoolId' => '121222222'), 'schoolName' => 'school2','year' => 'Sophomore' ,'degree' => 'Doctorate(Phd)', 'major' => 'Chemsitry' ,'graduated' => 'yes' ,'graduationDate' => '01/05/2011' , 'degreeExpected' => 'Winter 2013', 'classes' => array()));
		
		echo json_encode($arr);
	}
}

// $print_r($_POST);
$Api = new Api();

$Api->save();