/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 06/March/2013
* Description           : Backbone collection for streams
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['collection/baseCollection'], function(BaseCollection) {
	var Streams = BaseCollection.extend({ 
		model: 'stream',
		objName: 'Streams',
//		url:'/allStreamsForAUser',
		
	});
        
	
	return Streams;
});