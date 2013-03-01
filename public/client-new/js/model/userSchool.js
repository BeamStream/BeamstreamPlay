/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/February/2013
* Description           : Backbone model for user's school
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['model/baseModel'], function(BaseModel) {
	var userSchool = BaseModel.extend({ 
		objName: 'userSchool',
		url:'/getAllSchoolForAUser'
//		defaults: {	   
//			schoolName:'',
//			schoolWebsite:''
//        },
//	        
//		/**
//         *@TODO  parse the response data 
//         */
//        parse:function(response){
//        	if(response == "There was some errors during add school" || response == "School Already Exists")
//        		return;
//        	
//        	response.id = response.id.id;
//        	delete response.id.id;
//        	return response;
//        },
//        
//        validation: {
//        	schoolName: {
//        		required: true
//        	},
//        	schoolWebsite: {
//        		required: true,
//				pattern: 'website',
//			} 
//			
//        },
	});
        
	
	return userSchool;
});