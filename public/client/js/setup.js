$(function() {
	BS.AppRouter = new BS.AppRouter;
	Backbone.history.start();
});

/*
 * Config Variables for Url externalization
 */

// For Login Page
BS.login = "http://localhost:9000/users";
// For Verify Token
BS.verifyToken = "http://localhost:9000/verifyToken";
// For Email Verification Page
BS.verifyEmail = "http://localhost:9000/getEmailforNewUser";
// For Register New User Page
BS.registerNewUser = "http://localhost:9000/registerNewUser";
// For Getting Logged in users basic details
BS.loggedInUserJson = "http://localhost:9000/loggedInUserJson";
// For School registration Post Data
BS.saveSchool = "http://localhost:9000/detailed_reg";
// GET school details
BS.schoolJson = "http://localhost:9000/schoolJson";
// For Class registration Post Data
BS.saveClass = "http://localhost:9000/class";
// For Profile Page Post Data
BS.saveProfile = "http://localhost:9000/getMediafromPost";
// For populate list of class code
BS.autoPopulateClass = "http://localhost:9000/autoPopulateClasses";
// Get School name for a SchoolId
BS.schoolNamebyId = "http://localhost:9000/getSchoolNamebyId";
// Get all schools under a user
BS.allSchoolForAUser = "http://localhost:9000/getAllSchoolForAUser";
// For new class in class stream
BS.newClass = "http://localhost:9000/newStream";
// Gel all streams of a user
BS.allStreamsForAUser = "http://localhost:9000/allStreamsForAUser";
// Post message info
BS.postMessage = "http://localhost:9000/newMessage";
// Get all messages of a stream
BS.streamMessages = "http://localhost:9000/getAllMessagesForAStream";
// expires the user session
BS.signOut = "http://localhost:9000/signOut";
// For JanRain component
BS.userPage = "http://localhost:9000/userPage";
// Get user details vai janRain
BS.userInfoViaJanRain = "http://localhost:9000/getJSONviaJanrain";
// For auto populate case -join a class
BS.joinClass = "http://localhost:9000/joinStreams";
// For Rocked It
BS.rockedIt = "http://localhost:9000/rockedIt";
// Get Rockers list
BS.rockersList = "http://localhost:9000/returnRockers";
// profile images and videos

// For File Upload
BS.docUpload = "http://localhost:9000/newDocument";
BS.profileImage = "http://localhost:9000/getProfilePicForAUser";
// Gel all profile images
BS.allProfileImages = "http://localhost:9000/getAllProfilePicForAUser";
//Get all class streams of a user
BS.classStreamsForUser = "http://localhost:9000/allClassStreamsForAUser";
//Get all school for autopopulate
BS.autoPopulateSchools = "http://localhost:9000/getAllSchoolsForAutopopulate";
//POST bitly
BS.bitly =  "http://localhost:9000/bitly";
//POST comment
BS.newComment = "http://localhost:9000/newComment";
//Get all comments of a message
BS.allCommentsForAMessage = "http://localhost:9000/allCommentsForAMessage";
//for forgot password
BS.forgotPassword = "http://localhost:9000/forgotPassword";
//sort messages
BS.sortByDate = "http://localhost:9000/getAllMessagesForAStreamSortedbyDate";
BS.sortByVote = "http://localhost:9000/getAllMessagesForAStreamSortedbyRocks";
BS.sortByKey = "http://localhost:9000/getAllMessagesForAStreambyKeyword";
//Message Follow
BS.followMessage ="http://localhost:9000/followMessage"; 
//check follower
BS.isAFollower = "http://localhost:9000/isAFollower";  

// Get All Documebts of a user
 BS.getAllDocs = "http://localhost:9000/getAllDocumentsForAUser";



/*
 * For Cloud
 */
 
//  //For Login Page  
//  BS.login = "http://beamstream-v3.herokuapp.com/users";
//  //For Verify Token
//  BS.verifyToken ="http://beamstream-v3.herokuapp.com/verifyToken";
//  //For Email Verification Page 
//  BS.verifyEmail = "http://beamstream-v3.herokuapp.com/getEmailforNewUser";
//  //For Register New User Page 
//  BS.registerNewUser = "http://beamstream-v3.herokuapp.com/registerNewUser";
//  //For Getting Logged in users basic details 
//  BS.loggedInUserJson ="http://beamstream-v3.herokuapp.com/loggedInUserJson";
//  //For School registration Post Data 
//  BS.saveSchool ="http://beamstream-v3.herokuapp.com/detailed_reg";
//  //GET school details 
//  BS.schoolJson ="http://beamstream-v3.herokuapp.com/schoolJson";
//  //For Class registration Post Data 
//  BS.saveClass = "http://beamstream-v3.herokuapp.com/class";
//  //For Profile Page Post Data 
//  BS.saveProfile ="http://beamstream-v3.herokuapp.com/getMediafromPost";
//  //For populate list of class code 
//  BS.autoPopulateClass = "http://beamstream-v3.herokuapp.com/autoPopulateClasses";
//  //Get School name for a SchoolId 
//  BS.schoolNamebyId = "http://beamstream-v3.herokuapp.com/getSchoolNamebyId";
//  //Get all schools under a user 
//  BS.allSchoolForAUser ="http://beamstream-v3.herokuapp.com/getAllSchoolForAUser";
//  //For new class in class stream 
//  BS.newClass ="http://beamstream-v3.herokuapp.com/newStream";
//  //Gel all streams of a user 
//  BS.allStreamsForAUser="http://beamstream-v3.herokuapp.com/allStreamsForAUser";
//  //Post message info 
//  BS.postMessage ="http://beamstream-v3.herokuapp.com/newMessage";
//  //Get all messages of a stream 
//  BS.streamMessages ="http://beamstream-v3.herokuapp.com/getAllMessagesForAStream";
//  //expires the usersession 
//  BS.signOut ="http://beamstream-v3.herokuapp.com/signOut";
//   // For JanRain component 
//  BS.userPage="http://beamstream-v3.herokuapp.com/userPage";
//  // Get user details vai janRain 
//  BS.userInfoViaJanRain="http://beamstream-v3.herokuapp.com/getJSONviaJanrain";
//  // For auto populate case -join a class 
//  BS.joinClass ="http://beamstream-v3.herokuapp.com/joinStreams";
//   // For Rocked It 
//  BS.rockedIt = "http://beamstream-v3.herokuapp.com/rockedIt"
//  // Get Rockers list 
//  BS.rockersList ="http://beamstream-v3.herokuapp.com/returnRockers";
//  //profile images and videos 
//  BS.profileImage ="http://beamstream-v3.herokuapp.com/getProfilePicForAUser";
//  // get all images
//  BS.allProfileImages ="http://beamstream-v3.herokuapp.com/getAllProfilePicForAUser";
//  //Get all class streams of a user
//  BS.classStreamsForUser = "http://beamstream-v3.herokuapp.com/allClassStreamsForAUser";
//  //Get all school for autopopulate
//  BS.autoPopulateSchools = "http://beamstream-v3.herokuapp.com/getAllSchoolsForAutopopulate";
//  //POST bitly
//  BS.bitly =  "http://beamstream-v3.herokuapp.com/bitly";
//  //POST comment
//  BS.newComment = "http://beamstream-v3.herokuapp.com/newComment";
//  //Get all comments of a message
//  BS.allCommentsForAMessage = "http://beamstream-v3.herokuapp.com/allCommentsForAMessage";
//  //for forgot password
//  BS.forgotPassword = "http://beamstream-v3.herokuapp.com/forgotPassword";
//  //sort messages
//  BS.sortByDate = "http://beamstream-v3.herokuapp.com/getAllMessagesForAStreamSortedbyDate";
// 
//  BS.sortByVote = "http://beamstream-v3.herokuapp.com/getAllMessagesForAStreamSortedbyRocks";
//  BS.sortByKey = "http://beamstream-v3.herokuapp.com/getAllMessagesForAStreambyKeyword";
//
//    //Message Follow
//    BS.followMessage ="http://beamstream-v3.herokuapp.com/followMessage"; 
//    //check follower
//    BS.isAFollower = "http://beamstream-v3.herokuapp.com/isAFollower";  
//
//    // Get All Documebts of a user
//     BS.getAllDocs = "http://beamstream-v3.herokuapp.com/getAllDocumentsForAUser";
//     
//     // For File Upload
//    BS.docUpload = "http://beamstream-v3.herokuapp.com/newDocument";


