$(function() {
BS.AppRouter = new BS.AppRouter;
Backbone.history.start();
});



/*
* Config Variables for Url externalization
*/

BS.URLRequired ="http://beamstream.knoldus.com";     // for cloud use BS.URLRequired ="http://beamstream-v3.herokuapp.com";
 


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
BS.userPage = BS.URLRequired+"/userPage";
// Get user details vai janRain
BS.userInfoViaJanRain = BS.URLRequired+"/getJSONviaJanrain";
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
 

 
 