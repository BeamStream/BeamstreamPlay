 $(function() {
        BS.AppRouter = new BS.AppRouter;
        Backbone.history.start();
}); 
 
 
 /*
  * Config Variables for Url externalization
  */
 
//For Login Page
BS.login = "http://localhost:9000/users";

//For Verify Token
BS.verifyToken ="http://localhost:9000/verifyToken";

//For Email Verification Page
BS.verifyEmail = "http://localhost:9000/getEmailforNewUser";

//For Register New User Page
BS.registerNewUser = "http://localhost:9000/registerNewUser";

//For Getting Logged in users basic details
BS.loggedInUserJson = "http://localhost:9000/loggedInUserJson";

//For School registration Post Data
BS.saveSchool = "http://localhost:9000/detailed_reg";

//GET  school details 
BS.schoolJson = "http://localhost:9000/schoolJson";

//For Class registration Post Data
BS.saveClass = "http://localhost:9000/class";

//For Profile Page Post Data
BS.saveProfile = "http://localhost:9000/getMediafromPost";

//For populate list of class code
BS.autoPopulateClass  = "http://localhost:9000/autoPopulateClasses";

//Get School name for a SchoolId
BS.schoolNamebyId = "http://localhost:9000/getSchoolNamebyId";

//Get all schools under a user
BS.allSchoolForAUser = "http://localhost:9000/getAllSchoolForAUser";

//For new class in class stream
BS.newClass = "http://localhost:9000/newStream";

//Gel all streams of a user
 BS.allStreamsForAUser ="http://localhost:9000/allStreamsForAUser";

//Post message info
 BS.postMessage ="http://localhost:9000/newMessage";
 
//Get all messages of a stream
 BS.streamMessages = "http://localhost:9000/getAllMessagesForAStream";
 
 //expires the usersession
 BS.signOut ="http://localhost:9000/signOut";
 
 // For JanRain component
 BS.userPage ="http://localhost:9000/userPage";
 
// Get user details vai janRain
 BS.userInfoViaJanRain ="http://localhost:9000/getJSONviaJanrain";
 
// For auto populate case -join a class
 BS.joinClass = "http://localhost:9000/joinStreams";
 
 // For Rocked It 
 BS.rockedIt = "http://localhost:9000/rockedIt"
// 
 
 /*
  * For Cloud
  */
 
   
 /*
//For Login Page
 BS.login = "http://beamstream-v3.herokuapp.com/users";

 //For Verify Token
 BS.verifyToken ="http://beamstream-v3.herokuapp.com/verifyToken";

 //For Email Verification Page
 BS.verifyEmail = "http://beamstream-v3.herokuapp.com/getEmailforNewUser";

 //For Register New User Page
 BS.registerNewUser = "http://beamstream-v3.herokuapp.com/registerNewUser";

 //For Getting Logged in users basic details
 BS.loggedInUserJson = "http://beamstream-v3.herokuapp.com/loggedInUserJson";

 //For School registration Post Data
 BS.saveSchool = "http://beamstream-v3.herokuapp.com/detailed_reg";

 //GET  school details 
 BS.schoolJson = "http://beamstream-v3.herokuapp.com/schoolJson";

 //For Class registration Post Data
 BS.saveClass = "http://beamstream-v3.herokuapp.com/class";

 //For Profile Page Post Data
 BS.saveProfile = "http://beamstream-v3.herokuapp.com/getMediafromPost";

 //For populate list of class code
 BS.autoPopulateClass  = "http://beamstream-v3.herokuapp.com/autoPopulateClasses";

 //Get School name for a SchoolId
 BS.schoolNamebyId = "http://beamstream-v3.herokuapp.com/getSchoolNamebyId";

 //Get all schools under a user
 BS.allSchoolForAUser = "http://beamstream-v3.herokuapp.com/getAllSchoolForAUser";

 //For new class in class stream
 BS.newClass = "http://beamstream-v3.herokuapp.com/newStream";

 //Gel all streams of a user
  BS.allStreamsForAUser ="http://beamstream-v3.herokuapp.com/allStreamsForAUser";

 //Post message info
  BS.postMessage ="http://beamstream-v3.herokuapp.com/newMessage";
  
 //Get all messages of a stream
  BS.streamMessages = "http://beamstream-v3.herokuapp.com/getAllMessagesForAStream";
  //expires the usersession
  BS.signOut ="http://beamstream-v3.herokuapp.com/signOut";
 
 */
 
 
 
/* 
 * for testing in local
 */
//BS.login = "http://localhost/client2/api.php";
//BS.verifyToken ="http://localhost/client2/api.php";
//BS.verifyEmail = "http://localhost/client2/api.php";
//BS.registerNewUser = "http://localhost/client2/api.php";
//BS.loggedInUserJson = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php";
//BS.saveSchool = "http://localhost/client2/api.php";
//BS.schoolJson = "http://localhost/client/api.php";
//BS.saveClass = "http://localhost/client2/api.php";
//BS.saveProfile = "http://localhost/client2/api.php";
//BS.autoPopulateClass = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php";
//BS.schoolNamebyId = "http://localhost/client2/api.php";
//BS.allSchoolForAUser = "http://localhost/client/api.php";
//BS.newClass = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php";
//BS.allStreamsForAUser ="http://localhost/client2/api.php";
//BS.postMessage ="http://localhost/client/api.php";
//BS.streamMessages = "http://localhost/client/api.php";
//BS.signOut ="http://localhost/client/api.php";
//BS.userPage ="http://localhost:9000/userPage";
//BS.userInfoViaJanRain ="http://localhost/client/api.php";
//BS.joinClass = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php";
//BS.rockedIt = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php";
