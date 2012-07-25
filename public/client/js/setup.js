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

// expires the usersession
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

/*
 * for testing in local
 */
 
// BS.login = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=login";
// BS.verifyToken ="http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=verifyToken";
// BS.verifyEmail = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=verifyEmail";
// BS.registerNewUser ="http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=registerNewUser";
// BS.loggedInUserJson = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=loggedInUserJson";
// BS.saveSchool = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=saveSchool";
// BS.schoolJson = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=schoolJson";
// BS.saveClass = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=saveClass";
// //BS.saveProfile = "http://localhost:9000/getMediafromPost";
// BS.saveProfile = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=saveProfile";
// BS.autoPopulateClass = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=autoPopulateClass";
// BS.schoolNamebyId = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=schoolNamebyId";
// BS.allSchoolForAUser = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=allSchoolForAUser";
// BS.newClass = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=newClass";
// BS.allStreamsForAUser ="http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=allStreamsForAUser";
// BS.postMessage ="http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=postMessage";
// BS.streamMessages = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=streamMessages";
// BS.signOut ="http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=signOut";
// BS.userPage ="http://localhost:9000/userPage";
// BS.userInfoViaJanRain ="http://localhost/client/api.php";
// BS.joinClass = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=joinClass";
// BS.rockedIt =  "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=rockedIt";
// BS.rockersList = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=rockersList";
// BS.profileImage = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=profileImage";
// BS.allProfileImages ="http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=allProfileImages";
// BS.classStreamsForUser = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=classStreamsForUser";
// BS.autoPopulateSchools = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php?run=autoPopulateSchools";
//// 
 
//// 
// BS.login = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=login";
// BS.verifyToken ="http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=verifyToken";
// BS.verifyEmail = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=verifyEmail";
// BS.registerNewUser ="http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=registerNewUser";
// BS.loggedInUserJson = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=loggedInUserJson";
// BS.saveSchool = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=saveSchool";
// BS.schoolJson = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=schoolJson";
// BS.saveClass = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=saveClass";
// //BS.saveProfile = "http://192.168.10.10:9000/getMediafromPost";
// BS.saveProfile = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=saveProfile";
// BS.autoPopulateClass = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=autoPopulateClass";
// BS.schoolNamebyId = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=schoolNamebyId";
// BS.allSchoolForAUser = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=allSchoolForAUser";
// BS.newClass = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=newClass";
// BS.allStreamsForAUser ="http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=allStreamsForAUser";
// BS.postMessage ="http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=postMessage";
// BS.streamMessages = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=streamMessages";
// BS.signOut ="http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=signOut";
// BS.userPage ="http://192.168.10.10:9000/userPage";
// BS.userInfoViaJanRain ="http://192.168.10.10/client/api.php";
// BS.joinClass = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=joinClass";
// BS.rockedIt =  "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=rockedIt";
// BS.rockersList = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=rockersList";
// BS.profileImage = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=profileImage";
// BS.allProfileImages ="http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=allProfileImages";
// BS.classStreamsForUser = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=classStreamsForUser";
// BS.autoPopulateSchools = "http://192.168.10.10/Beam2/BeamstreamPlay/public/client/api.php?run=autoPopulateSchools";
// 
// 
