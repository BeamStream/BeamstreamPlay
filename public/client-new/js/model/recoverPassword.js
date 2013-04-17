/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 27/March/2013
* Description           : to recover password
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/
define(['model/user'], function(User) {
	var RecoverPassword = User.extend({
		
		validation: {

			mailId: {
				required: true,
				pattern: 'email'
			} 
		}
		
	});
		        
	return RecoverPassword;
});