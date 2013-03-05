/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone model for steam details 
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['model/baseModel'], function(BaseModel) {
	var Stream = BaseModel.extend({ 
		objName: 'Stream',
			idAttribute: "_id",
	        
	        /**
	         *@TODO  parse the response data because the response json is different
	         */
	        parse:function(response){
	        	
	        	// @TODO some case we don't need to parse the response 
	        	if(response == "Oops there were errors during registration" || response.message)
	        		return;
	        	response.id = response.id.id;
	        	response.schoolName = response.schoolName;
//	        	response.lastName = response.user.lastName;
//	        	response.major = response.userSchool.major;
//	        	response.aboutYourself = response.user.about;
//	        	response.gradeLevel = response.userSchool.year.name;
//	        	response.degreeProgram = response.userSchool.degree.name;
//	        	response.graduate = response.userSchool.graduated.name;
//	        	response.location = response.user.location;
//	        	response.cellNumber = response.user.contact;
	        	
	        	delete response.id.id;
	        	delete response.schoolName;
//	        	localStorage["registrationDetails"] = JSON.stringify(response);
	        	return response;
	        },


	});
        
	return Stream;
});