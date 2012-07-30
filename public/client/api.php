
<?php
class Api {

	function save()
	{
		 $arr =  array('images/smiley.jpg' , 'images/placeholders/face1.png' ,'images/image4.jpg');
		 echo json_encode($arr);
	}
	
	function login(){
		$arr = array('id' => 1, 'status' => 'success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function verifyToken(){
		$arr = array('id' => 1, 'status' => 'Success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function verifyEmail(){
		$arr = array('id' => 1, 'status' => 'Success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function registerNewUser(){
		$arr = array('id' => 1, 'status' => 'Success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function loggedInUserJson(){
		$arr = array('id' => array('id' => "10000"), 'userType' => array('name' => 'Educator'),'email' => 'ayush@knoldus.com' ,'firstName' => 'Ayush', 'lastName' => 'Mishra' ,'userName' => 'ayush' ,'alias' => ' ' , 'password' => 'ayush', 'orgName' => 'Ayush' ,'location' => 'India','streams' => array( ), 'schoolId' => array(),'classId' => array());
		echo json_encode($arr);
	}
	function saveSchool(){
		$arr = array('id' => 1, 'status' => 'Success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function schoolJson(){
		$arr = array(array('id' => array('id' => '23wewewe'),'assosiatedSchoolId' =>array('id'=> '111111'), 'schoolName' => 'LALJIHIGH' ,'year' => array('name' => 'Senior'),'degree' => array('name' => 'Other'),'major' => 'Bhinguj','graduated' => array('name' => 'attending') , 'degreeExpected' => array('name' => 'Winter 2012') ,'classes' => array()),array('id' => array('id' => '1222adsa'), 'assosiatedSchoolId' =>array('id' => '2222222'),'schoolName' => 'testscjhool' ,'year' => array('name' => 'Senior'),'degree' => array('name' => 'Other'),'major' => 'Bhinguj','graduated' => array('name' => 'attending') , 'degreeExpected' => array('name' => 'Winter 2012') ,'classes' => array()));
		echo json_encode($arr);
	}
	function saveClass(){
		$arr = array('id' => 1, 'status' => 'Success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function saveProfile(){
		$arr = array('id' => 1, 'status' => 'Success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function autoPopulateClass(){
		$arr = array(array('id' => array('id' => '4fd8682c84aefd97fa529b2b'), 'classCode' => '001', 'className' => 'phy' ,'classType' => 'quarter', 'classTime' => '11:00AM' , 'startingDate' => '10/11/1970' ,'schoolId' => array('id' => '4fd867a384aefd97fa529b2a') ,'streams' => array()) ,array('id' => array('id' => '12121'), 'classCode' => '002', 'className' => '121' ,'classType' => 'semester', 'classTime' => '12:00AM' , 'startingDate' => '02/12/1970' ,'schoolId' => array('id' => '121') ,'streams' => array()),array('id' => array('id' => '444'), 'classCode' => '003', 'className' => 'ddd' ,'classType' => 'semester', 'classTime' => '09:00AM' , 'startingDate' => '11/11/1970' ,'schoolId' => array('id' => '4fd867a384aefd97fa529b2a') ,'streams' => array()));
		echo json_encode($arr);
	}
	
	function schoolNamebyId(){
		$arr =  "SSSChool";
		echo $arr;
	}
	function allSchoolForAUser(){
		$arr = array(array('id' => array('id' => '23wewewe'),'assosiatedSchoolId' =>array('id'=> '111111'), 'schoolName' => 'LALJIHIGH' ,'year' => array('name' => 'Senior'),'degree' => array('name' => 'Other'),'major' => 'Bhinguj','graduated' => array('name' => 'attending') , 'degreeExpected' => array('name' => 'Winter 2012') ,'classes' => array()),array('id' => array('id' => '1222adsa'), 'assosiatedSchoolId' =>array('id' => '2222222'),'schoolName' => 'testscjhool' ,'year' => array('name' => 'Senior'),'degree' => array('name' => 'Other'),'major' => 'Bhinguj','graduated' => array('name' => 'attending') , 'degreeExpected' => array('name' => 'Winter 2012') ,'classes' => array()));
		echo json_encode($arr);
	}
	function newClass(){
		$arr = array('id' => 1, 'status' => 'success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function allStreamsForAUser(){
		$arr =array(array('id' => array('id' => '11'), 'streamName' => 'asasas' ,'streamType' => 'Class' , 'creatorOfStream' => array('schoolId' => '4fe0014084ae288122bf5b8f') , 'usersOfStream' => array('schoolId' => '4fe0014084ae288122bf5b8f'),'postToMyProfile' => 'true' ,'streamTag' => 'NeeelllllJi'), array('id' => array('id' => '344444'), 'streamName' => 'aaaaaaa' ,'streamType' => 'Project' , 'creatorOfStream' => array('schoolId' => '4fe0014084ae288122bf5b8f') , 'usersOfStream' => array('schoolId' => '4fe0014084ae288122bf5b8f'),'postToMyProfile' => 'true' ,'streamTag' => 'NeeelllllJi'),array('id' => array('id' => '1111111'), 'streamName' => 'vvvvvvvv' ,'streamType' => 'Class' , 'creatorOfStream' => array('schoolId' => '4fe0014084ae288122bf5b8f') , 'usersOfStream' => array('schoolId' => '4fe0014084ae288122bf5b8f'),'postToMyProfile' => 'true' ,'streamTag' => 'NeeelllllJi'),array('id' => array('id' => '44545'), 'streamName' => 'mmmmm' ,'streamType' => 'Project' , 'creatorOfStream' => array('schoolId' => '4fe0014084ae288122bf5b8f') , 'usersOfStream' => array('schoolId' => '4fe0014084ae288122bf5b8f'),'postToMyProfile' => 'true' ,'streamTag' => 'NeeelllllJi'));
		echo json_encode($arr);
	}
	function postMessage(){
		$arr = array(array('id' => array('id' => '111'),'messageBody' => 'hi this one http://www.youtube.com/watch?v=ZbcgyPtYBY0' ,'messageType' => array('name' => 'Audio'),'messageAccess' => array('name' => 'Public'), 'timeCreated' => '2012-06-20T11:53:44Z' , 'userId' => array(),'streamId' =>array(),'firstNameofMsgPoster' => 'Neelkanth', 'lastNameofMsgPoster' => 'Sachdeva', 'rocks' => '0','rockers' =>array()));
		echo json_encode($arr);
	}
	function streamMessages(){
		$arr = array(array('id' => array('id' => '1112'),'messageBody' => 'http://bit.ly/Q0uyK6' ,'messageType' => array('name' => 'Audio'),'messageAccess' => array('name' => 'Public'), 'timeCreated' => '2012-12-20T11:53:44Z' , 'userId' => array('id' => '121212' ),'imageUrl' => 'images/back.png','streamId' =>array(),'firstNameofMsgPoster' => 'Neelkanth', 'lastNameofMsgPoster' => 'Sachdeva', 'rocks' => '0','rockers' =>array()),array('id' => array('id' => '222'),'messageBody' => 'http://www.flickr.com/photos/churchclothing/2597225382/' ,'messageType' => array('name' => 'Audio'),'messageAccess' => array('name' => 'Private'), 'timeCreated' => '2012-06-20T11:53:44Z' , 'userId' => array('id' => '2323222' ),'imageUrl' => 'images/and.png', 'streamId' =>array(),'firstNameofMsgPoster' => 'Neelkanth', 'lastNameofMsgPoster' => 'Sachdeva', 'rocks' => '0','rockers' =>array()),array('id' => array('id' => '333'),'messageBody' => 'Hi All' ,'messageType' => array('name' => 'Audio'),'messageAccess' => array('name' => 'Public'), 'timeCreated' => '2012-06-20T11:53:44Z' , 'userId' => array('id' => '5656' ),'imageUrl' => 'images/hand.png','streamId' =>array(),'firstNameofMsgPoster' => 'Neelkanth', 'lastNameofMsgPoster' => 'Sachdeva', 'rocks' => '0','rockers' =>array()));
		echo json_encode($arr);
	}
	
	
	function signOut(){
		$arr = array('id' => 1, 'status' => 'fail' , 'message'=>'The username or password you entered is incorrect.');
		echo json_encode($arr);
	}
	function userPage(){
		$arr = array('id' => 1, 'status' => 'success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function userInfoViaJanRain(){
		$arr = array('id' => 1, 'status' => 'success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function joinClass(){
		$arr = array('id' => 1, 'status' => 'success' , 'message'=>'Login suscces.');
		echo json_encode($arr);
	}
	function rockedIt(){
		$arr = "12";
		echo $arr;
	}
	function rockersList(){
		$arr =  array('Neel' , 'Aswathy' ,'Cuckoo');
		echo json_encode($arr);
	}
	function profileImage(){
		$arr = "images/image4.jpg";
		echo json_encode($arr);
// 		$arr = array('id' => array(),'userId' => array(), 'mediaUrl' => 'images/placeholders/face1.png' , 'contentType'=> array('name' => 'Image'),'isProfile' => 'true');
// 		echo json_encode($arr);
	}
	function allProfileImages(){
		$arr =  array('images/smiley.jpg' , 'images/placeholders/face1.png' ,'images/image4.jpg');
		echo json_encode($arr);
	}
	function classStreamsForUser(){
		$arr = array(array('id' => array('id'=> '11') , 'streamName' => 'asasas'),array('id' => array('id'=> '1111111') , 'streamName' => 'vvvvvvvv'));
		echo json_encode($arr);
	}
	function autoPopulateSchools(){
		$arr = array(array('id' => array('id' => '23wewewe'),'assosiatedSchoolId' =>array('id'=> '111111'), 'schoolName' => 'LALJIHIGH' ,'year' => array('name' => 'Senior'),'degree' => array('name' => 'Other'),'major' => 'Bhinguj','graduated' => array('name' => 'attending') , 'degreeExpected' => array('name' => 'Winter 2012') ,'classes' => array()),array('id' => array('id' => '1222adsa'), 'assosiatedSchoolId' =>array('id' => '2222222'),'schoolName' => 'testscjhool' ,'year' => array('name' => 'Senior'),'degree' => array('name' => 'Other'),'major' => 'Bhinguj','graduated' => array('name' => 'attending') , 'degreeExpected' => array('name' => 'Winter 2012') ,'classes' => array()));
		echo json_encode($arr);
	}
	function bitly(){
		$arr = array('status_code'=> '200', 'status_txt' => 'OK' , 'data' =>array('long_url' => 'https://mongohq.com/databases/beamstream-v3', 'url' => 'http://bit.ly/Q0uyK6' , 'hash' => 'Q0uyK6' , 'global_hash'=> 'Q0uyK7' , 'new_hash' => '1') );
		 
		echo json_encode($arr);
	}
	function newComment(){
		$arr = array(array('id' => array('id' => '00001'),'messageBody' => 'Hi this is comment' , 'timeCreated' => '2012-06-20T11:53:44Z' , 'userId' => array('id' => '0128j7126'),'firstNameofMsgPoster' => 'Neelkanth','lastNameofMsgPoster' => 'Sachdev','rocks' => '0' ,'rockers' => array(),'comments' => array()));
		echo json_encode($arr);
	}
	function allCommentsForAMessage(){
		$arr = array(array('id' => array('id' => '1000'),'messageBody' => 'aaaaaa' , 'timeCreated' => '2012-06-20T11:53:44Z' , 'userId' => array('id' => '01sdfsd7126'),'firstNameofMsgPoster' => 'Neelkaddnth','lastNameofMsgPoster' => 'dfd','rocks' => '0' ,'rockers' => array(),'comments' => array()),array('id' => array('id' => '2000'),'messageBody' => 'bbbbbbbbbb' , 'timeCreated' => '2012-06-20T11:53:44Z' , 'userId' => array('id' => '0128j7126'),'firstNameofMsgPoster' => 'ddd','lastNameofMsgPoster' => 'Sachdev','rocks' => '0' ,'rockers' => array(),'comments' => array()),array('id' => array('id' => '30000'),'messageBody' => 'cccccccc' , 'timeCreated' => '2012-06-20T11:53:44Z' , 'userId' => array('id' => '0128j7126'),'firstNameofMsgPoster' => 'Neelkanth','lastNameofMsgPoster' => 'Sachdev','rocks' => '0' ,'rockers' => array(),'comments' => array()));
		echo json_encode($arr);
	}
	
}


if (isset($_GET['run']) && method_exists('Api',$_GET['run'])){
	$view = new Api();
	$view->$_GET['run']();
} else {
	echo 'Function not found';
}