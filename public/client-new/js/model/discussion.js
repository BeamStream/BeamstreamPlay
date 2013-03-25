/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 14/March/2013
* Description           : Backbone model for discussion
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['baseModel'], function(BaseModel) {
	var Discussion = BaseModel.extend({ 
		objName: 'Discussion',
		url:'/newMessage',
		defaults:{
		},
		
		validation: {
			
		}

	});
        
	
	return Discussion;
});