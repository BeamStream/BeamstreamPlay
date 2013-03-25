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

define(['baseModel'], function(BaseModel) {
	var Stream = BaseModel.extend({ 
		objName: 'Stream',
//		url:'/allStreamsForAUser',
        /**
         *@TODO  parse the response data because the response json is different
         */
//        parse:function(response){
//        	// @TODO some case we don't need to parse the response 
//        	if(response == "Oops there were errors during registration" || response.message)
//        		return;
////        	response.id = response.id.id;
//        	response.schoolName = response._1.schoolName;
////        	delete response.id.id;
//        	delete response._1.schoolName;
//        	return response;
//        },


	});
        
	return Stream;
});