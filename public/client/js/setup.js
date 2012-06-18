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

 
///**
// * for testing in local
// *  */
// 
//BS.login = "http://localhost/client2/api.php";
//
// 
//BS.verifyToken ="http://localhost/client2/api.php";
//
// 
//BS.verifyEmail = "http://localhost/client2/api.php";
// 
//BS.registerNewUser = "http://localhost/client2/api.php";
//
// 
//BS.loggedInUserJson = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php";
//
// 
//BS.saveSchool = "http://localhost/client2/api.php";
//
// 
//BS.schoolJson = "http://localhost/client/api.php";
//
// 
//BS.saveClass = "http://localhost/client2/api.php";
//
// 
//BS.saveProfile = "http://localhost/client2/api.php";
//
//BS.autoPopulateClass = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php";
//BS.schoolNamebyId = "http://localhost/client2/api.php";
//BS.allSchoolForAUser = "http://localhost/client/api.php";
//BS.newClass = "http://localhost/Beam2/BeamstreamPlay/public/client/api.php";
 