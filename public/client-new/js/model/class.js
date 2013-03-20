/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/February/2013
* Description           : Backbone model for user's class
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['model/baseModel'], function(BaseModel) {
	var Class = BaseModel.extend({ 
		idAttribute: "_id",
		objName: 'Class',
		defaults:{
			schoolId: '',
			classCode: '',
			className: '',
			classTime: '',
			startingDate: '',
			classType:'semester'
		},
		
		/**
         *@TODO  parse the response data because the response json is different
         */
//        parse:function(response){
//        	
//        	delete response.user;
//        	delete response.userSchool;
//        	return response;
//        },
		
		validation: {
			schoolId: {
				required: true
			},
			classCode: {
				required: true
			},
			className: {
				required: true
			},
			classTime: {
				required: true
			},
			startingDate: {
				required: true
			}
		}

	});
        
	
	return Class;
});