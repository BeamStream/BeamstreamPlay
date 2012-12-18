$(function() {
BS.AppRouter = new BS.AppRouter;
Backbone.history.start();
});



/*
* Config Variables for Url externalization
*/
//BS.URLRequired ="http://localhost:9000";   
//BS.URLRequired ="http://192.168.10.10:9000";   
//BS.URLRequired ="http://192.168.10.24:9000";   

 
//BS.URLRequired ="http://www.beamstream.com";
 
BS.URLRequired ="http://test.beamstream.com"

	
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
BS.schoolNamebyId = BS.URLRequired+"/getSchoolNamebyId";
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
BS.docUpload = BS.URLRequired+"/newDocument";
//profile images and videos
BS.profileImage = BS.URLRequired+"/getProfilePicForAUser";
// Gel all profile images
BS.allProfileImages = BS.URLRequired+"/getAllProfilePicForAUser";
//Get all class streams of a user
BS.classStreamsForUser = BS.URLRequired+"/allClassStreamsForAUser";
//Get all school for autopopulate
BS.autoPopulateSchools = BS.URLRequired+"/getAllSchoolsForAutopopulate";
//POST bitly
BS.bitly = BS.URLRequired+"/bitly";
//POST comment
BS.newComment = BS.URLRequired+"/newComment";
//Get all comments of a message
BS.allCommentsForAMessage = BS.URLRequired+"/allCommentsForAMessage";
//for forgot password
BS.forgotPassword = BS.URLRequired+"/forgotPassword";
//sort messages
BS.sortByDate = BS.URLRequired+"/getAllMessagesForAStreamSortedbyDate";
BS.sortByVote =BS.URLRequired+"/getAllMessagesForAStreamSortedbyRocks";
BS.sortByKey = BS.URLRequired+"/getAllMessagesForAStreambyKeyword";
//Message Follow
BS.followMessage =BS.URLRequired+"/followMessage";
//check follower
BS.isAFollower = BS.URLRequired+"/isAFollower";
// Get All Documebts of a user
BS.getAllDocs = BS.URLRequired+"/getAllDocumentsForAUser";
// Rocks comments
BS.rockingTheComment = BS.URLRequired+"/rockingTheComment";
// get comment rockers list
BS.commentRockers = BS.URLRequired+"/commentRockers";
// get profile videos 
BS.allProfileVideos = BS.URLRequired+"/getAllProfileVideoForAUser";
//get no of users attending class
BS.noOfUsersAttendingAClass = BS.URLRequired+"/noOfUsersAttendingAClass";
//populate class codes
BS.autoPopulateClassesbyCode = BS.URLRequired+"/autoPopulateClassesbyCode";
//populate class names
BS.autoPopulateClassesbyName = BS.URLRequired+"/autoPopulateClassesbyName";
//DeleteStrewams
BS.deleteStream = BS.URLRequired+"/deleteStream";
//Add new school name $ website
BS.addSchool =  BS.URLRequired+"/school";
//save edit document
BS.savedocedit = BS.URLRequired+"/changeTitleAndDescriptionForADocument";
//Rocks the Google docs 
BS.rockDocs = BS.URLRequired+"/rockTheDocument";
//Document rockers list 
BS.documentRockers =BS.URLRequired+"/getRockers";
//get one google doc to edit
BS.getOneDocs = BS.URLRequired+"/getDocument"; 
//Upload Doc from My Computer the Google docs 
BS.uploaddocFrmComputer = BS.URLRequired+"/getDocumentFromDisk";
//Get audio Files of a User
BS.getaudioFilesOfAUser = BS.URLRequired+"/audioFilesOfAUser";
//get all ppt Files of a user
BS.getAllPPTFilesForAUser = BS.URLRequired+"/getAllPPTFilesForAUser";
//get all pdf Files of a user
BS.getAllPDFFilesForAUser = BS.URLRequired+"/getAllPDFFilesForAUser";
// Get All Docs of a user (docs upload from computer)
BS.getAllDOCSFilesForAUser = BS.URLRequired+"/getAllDOCSFilesForAUser";
// Rock Video /image 
BS.rockTheUsermedia = BS.URLRequired+"/rockTheUsermedia";
// Rockers list - image /video
BS.giveMeRockersOfUserMedia = BS.URLRequired+"/giveMeRockersOfUserMedia";
//Get data progress
BS.dataProgress = BS.URLRequired+"/returnProgress";
// delete Message
BS.deleteMessage = BS.URLRequired+"/deleteMessage";
// delete Comments
BS.deleteTheComment = BS.URLRequired+"/deleteTheComment";
// browser close 
BS.browserClosed =BS.URLRequired+"/browserClosed";  
//change Title and Description of User Media 
BS.changeTitleDescriptionUserMedia =BS.URLRequired+"/changeTitleAndDescriptionUserMedia";
//get details of a image/video 
BS.getMedia =BS.URLRequired+"/getMedia";
//check if the logged user is already rock a particular message
BS.isARockerOfMessage =BS.URLRequired+"/isARockerOfMessage";
//check if the logged user is already rock a particular comment
BS.isARockerOfComment =BS.URLRequired+"/isARockerOfComment";

/* New -design */
 
BS.newQuestion =BS.URLRequired+"/newQuestion";
//get details of online users
BS.onlineUsers = BS.URLRequired+"/onlineUsers"; 
 



/* for beta users */
BS.toLogin = BS.URLRequired+'/beamstream/index.html#login';
BS.betaUser = BS.URLRequired+'/betaUser';
