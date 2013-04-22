$(function() {
BS.AppRouter = new BS.AppRouter;
Backbone.history.start();
});



/*
* Config Variables for Url externalization
*/

BS.URLRequired ="http://localhost:9000";   

//BS.URLRequired ="http://192.168.2.31:9000";   


//BS.URLRequired ="http://www.beamstream.com";


//BS.URLRequired ="http://test.beamstream.com"

	
// For Login Page
BS.login = BS.URLRequired+"/users";
// For Verify Token
BS.verifyToken = BS.URLRequired+"/verifyToken";
// For Email Verification Page
BS.verifyEmail = BS.URLRequired+"/getEmailforNewUser";
// For Register New User Page
BS.registerNewUser = BS.URLRequired+"/registerNewUser";
// For Getting Logged in users basic details
BS.loggedInUserJson = BS.URLRequired+"/loggedInUserJson";
// For School registration Post Data
BS.saveSchool = BS.URLRequired+"/detailed_reg";
// GET school details
BS.schoolJson = BS.URLRequired+"/schoolJson";
// For Class registration Post Data
BS.saveClass = BS.URLRequired+"/class";
// For Profile Page Post Data
BS.saveProfile = BS.URLRequired+"/getMediafromPost";
// For populate list of class code
BS.autoPopulateClass = BS.URLRequired+"/autoPopulateClasses";
// Get School name for a SchoolId
BS.schoolNamebyId = BS.URLRequired+"/name/school";				//GET 	/name/school/:schoolId
// Get all schools under a user
BS.allSchoolForAUser = BS.URLRequired+"/getAllSchoolForAUser";
// For new class in class stream
BS.newClass = BS.URLRequired+"/newStream";
// Gel all streams of a user
BS.allStreamsForAUser = BS.URLRequired+"/allStreamsForAUser";
// Post message info
BS.postMessage = BS.URLRequired+"/newMessage";
// Get all messages of a stream
BS.streamMessages = BS.URLRequired+"/getAllMessagesForAStream";
// expires the user session
BS.signOut = BS.URLRequired+"/signOut";
// For JanRain component
// Deprecated, see BS.social_authentication
//BS.userPage = BS.URLRequired+"/userPage";
// Get user details vai janRain
//BS.userInfoViaJanRain = BS.URLRequired+"/getJSONviaJanrain";
// Social authentication
BS.social_authentication = BS.URLRequired+"/social/social_authentication";
// For auto populate case -join a class
BS.joinClass = BS.URLRequired+"/joinStreams";
// For Rocked It
BS.rockedIt = BS.URLRequired+"/rockedIt";
// Get Rockers list
BS.rockersList = BS.URLRequired+"/returnRockers";
// For File Upload
BS.docUpload = BS.URLRequired+"/document";
//profile images and videos
BS.profileImage = BS.URLRequired+"/profilePicFor/user";
// Gel all profile images
BS.allProfileImages = BS.URLRequired+"/allProfilePicsFor/user";	//GET 	/allProfilePicsFor/user
//Get all class streams of a user
BS.classStreamsForUser = BS.URLRequired+"/streams";
//Get all school for autopopulate
BS.autoPopulateSchools = BS.URLRequired+"/getAllSchoolsForAutopopulate";
//POST bitly
BS.bitly = BS.URLRequired+"/bitly";
//POST comment
BS.newComment = BS.URLRequired+"/newComment";
//Get all comments of a message
//BS.allComments = BS.URLRequired+"/comments"; 	//deprecated:  use /messages or /questions
//for forgot password
BS.forgotPassword = BS.URLRequired+"/forgotPassword";
//sort messages
//BS.sortByDate = BS.URLRequired+"/getAllMessagesForAStreamSortedbyDate";    // use /allMessagesForAStream
//BS.sortByVote =BS.URLRequired+"/getAllMessagesForAStreamSortedbyRocks";
//BS.sortByKey = BS.URLRequired+"/getAllMessagesForAStreambyKeyword";
//Message Follow
BS.followMessage =BS.URLRequired+"/followMessage";
//check follower
BS.isAFollower = BS.URLRequired+"/isAFollowerOf/message";		//GET 	/isAFollowerOf/message/:messageId
// Get All Documents of a user
BS.getAllDocs = BS.URLRequired+"/documents";
// Rocks comments
BS.rockingTheComment = BS.URLRequired+"/rockingTheComment";
// get comment rockers list
BS.commentRockers = BS.URLRequired+"/rockersOf/comment";			//GET     /rockersOf/comment/:commentId 
// get profile videos 
BS.allProfileVideos = BS.URLRequired+"/allProfileVideoFor/user";	//GET 	/allProfileVideoFor/user
//get no of users attending class
BS.noOfUsersAttendingAClass = BS.URLRequired+"/noOfUsers/stream";  //GET 	 /noOfUsers/stream/:streamId
//populate class codes
BS.autoPopulateClassesbyCode = BS.URLRequired+"/autoPopulateClassesbyCode";
//populate class names
BS.autoPopulateClassesbyName = BS.URLRequired+"/autoPopulateClassesbyName";
//DeleteStrewams
BS.deleteStream = BS.URLRequired+"/remove/stream";	//PUT 	/remove/stream/:streamId/:deleteStream/:removeAccess
//Add new school name $ website
BS.addSchool =  BS.URLRequired+"/school";
//save edit document
BS.savedocedit = BS.URLRequired+"/document";	//PUT 	/document/:documentId/:name/:description
//Rocks the Google docs 
BS.rockDocs = BS.URLRequired+"/rock/document";	//PUT 	/rock/document/:documentId
//Document rockers list 
BS.documentRockers =BS.URLRequired+"/rockersOf/document";	//GET 	/rockersOf/document/:documentId
//get one google doc to edit
BS.getOneDocs = BS.URLRequired+"/document"; 	//GET 	/document/:documentId
//Upload Doc from My Computer the Google docs 
BS.uploaddocFrmComputer = BS.URLRequired+"/getDocumentFromDisk";
//Get audio Files of a User
BS.getaudioFilesOfAUser = BS.URLRequired+"/audioFilesOfAUser";
//get all ppt Files of a user
BS.getAllPPTFilesForAUser = BS.URLRequired+"/allPPTFilesForAUser";
//get all pdf Files of a user
BS.getAllPDFFilesForAUser = BS.URLRequired+"/allPDFFilesForAUser";
// Get All Docs of a user (docs upload from computer)
BS.getAllDOCSFilesForAUser = BS.URLRequired+"/allDOCSFilesForAUser";
// Rock Video /image 
BS.rockTheUsermedia = BS.URLRequired+"/rock/media";		//PUT 	/rock/media/:mediaId
// Rockers list - image /video
BS.giveMeRockersOfUserMedia = BS.URLRequired+"/rockersOf/media";	//GET 	/rockersOf/media/:mediaId
//Get data progress
BS.dataProgress = BS.URLRequired+"/returnProgress";
// delete Message
BS.deleteMessage = BS.URLRequired+"/remove/message";		//PUT 	/remove/message/:messageId
// delete Comments
BS.deleteTheComment = BS.URLRequired+"/remove/comment";		//PUT   /remove/comment/:commentId
// browser close 
BS.browserClosed =BS.URLRequired+"/browserClosed";  
//change Title and Description of User Media 
BS.changeTitleDescriptionUserMedia =BS.URLRequired+"/media";	//PUT 	/media/:mediaId/:name/:description
//get details of a image/video 
BS.getMedia =BS.URLRequired+"/getMedia";
//check if the logged user is already rock a particular message
BS.isARockerOfMessage =BS.URLRequired+"/isARockerOf/message";	//GET 	/isARockerOf/message/:messageId
//check if the logged user is already rock a particular comment
BS.isARockerOfComment =BS.URLRequired+"/isARockerOf/comment";  //GET     /isARockerOf/comment/:commentId 
// Follow User
BS.followUser =BS.URLRequired+"/followUser";


/* New -design */
//get details of online users
BS.onlineUsers = BS.URLRequired+"/onlineUsers"; 

/* for question page */
BS.newQuestion =BS.URLRequired+"/question";
BS.rockQuestion =BS.URLRequired+"/rock/question";							//PUT  	/rock/question/:questionId
BS.followQuestion =BS.URLRequired+"/follow/question";						//PUT  	/follow/question/:questionId
BS.giveMeRockersOfQuestion =BS.URLRequired+"/rockersOf/question";			//GET 	/rockersOf/question/:questionId
BS.getAllQuestionsOfAStream =BS.URLRequired+"/getAllQuestionForAStream";	
BS.deleteQuestion =BS.URLRequired+"/remove/question";						//PUT 	/remove/question/:questionId
BS.votepoll=BS.URLRequired+"/voteAnOptionOf/question";						//PUT  	/voteAnOptionOf/question/:optionId
//BS.sortQuestionsByRock =BS.URLRequired+"/getAllQuestionsForAStreamSortedbyRocks";  //deprecated use /getAllQuestionsForAStream
//BS.sortQuestionsByKey = BS.URLRequired+"/getAllQuestionsForAStreambyKeyword";


 



/* for beta users */
BS.toLogin = BS.URLRequired+'/beamstream/index.html#login';
BS.betaUser = BS.URLRequired+'/betaUser';
