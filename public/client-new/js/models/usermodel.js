        /***
        * BeamStream
        *
        * Author                : Cuckoo Anna (cuckoo@toobler.com)
        * Company               : Toobler
        * Email:                : info@toobler.com
        * Web site              : http://www.toobler.com
        * Created               : 17/January/2013
        * Description           : Backbone model for user details 
        * ==============================================================================================
        * Change History:
        * ----------------------------------------------------------------------------------------------
        * Sl.No.  Date   Author   Description
        * ----------------------------------------------------------------------------------------------
        *
        * 
        */

        BS.UserModel = Backbone.Model.extend({
    
            defaults: {	        	
                iam:null,
                email:null,
                password:null,
                confirmPassword:null
//                firstName:null,
//                lastName:null,
//                schoolName:null,
//                major:null,
//                aboutYourself:null,
//                gradeLevel:null,
//                degreeProgram:null,
//                graduate:null,
//                cellNumber:null,
//                location:null
	        },
                
                url:BS.verifyEmail
    
});