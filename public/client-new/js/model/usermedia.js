/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 10/April/2013
* Description           : Backbone model for user media details 
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['baseModel'], function(BaseModel) {
	var UserMedia = BaseModel.extend({ 
		objName: 'UserMedia',
		defaults: {	  
			docName : '',
			docDescription: '',

        },
       
        
        validation: {

			docName: {
				required: true,
			} ,
			docDescription: {
				required: true,
			},
        }
		

	});
        
	return UserMedia;
});