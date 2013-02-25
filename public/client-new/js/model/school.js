/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 23/February/2013
* Description           : Backbone model for beamstream's school
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['model/baseModel'], function(BaseModel) {
	var School = BaseModel.extend({ 
		objName: 'School',
		
		/**
         *@TODO  parse the response data 
         */
        parse:function(response){
        	if(response == "School Already Exists")
        		return;
        	
        	response.id = response.id.id;
        	delete response.id.id;
        	return response;
        },
	});
        
	
	return School;
});