/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 18/March/2013
* Description           : Backbone model for question
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['baseModel'], function(BaseModel) {
	var Question = BaseModel.extend({ 
		objName: 'Question',
		defaults:{
		},
		
		validation: {
			
		}

	});
        
	
	return Question;
});
