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

define(['baseModel'], function(BaseModel) {
	var School = BaseModel.extend({ 
		objName: 'School',
		
		defaults: {	   
			schoolWebsite:'',
			schoolName:''
        },
	        
		/**
         *@TODO  parse the response data 
         */
        parse:function(response){
        	if(response == "There was some errors during add school" || response == "School Already Exists")
        		return;
        	
        	response.id = response.id.id;
        	delete response.id.id;
        	return response;
        },
        
        validation: {
        	schoolName: {
        		required: true
        	},
        	schoolWebsite: {
        		required: true,
				pattern: 'website',
			} 
			
        },
	});
        
	
	return School;
});