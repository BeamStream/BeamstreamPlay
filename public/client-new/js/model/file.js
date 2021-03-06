/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 08/April/2013
* Description           : Backbone model for files
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['baseModel'], function(BaseModel) {
	var File = BaseModel.extend({ 
		objName: 'File',

		defaults: {	   
        	
            docName: '',
			docURL: '',
			docDescription: '',
			
        },
		
       	validation: {
			
            docName: {
				required: true
			},
			docURL: {
				required: true,
				pattern: 'url'
			},
			
			docDescription: {
				required: true
			},
			docAccess: {
				required: true,
			},
			
			docType: {
				required: true
			},
			streamId: {
				required: true
			},

        }

	});
        
	return File;
});