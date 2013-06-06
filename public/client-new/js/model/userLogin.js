/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone model for user login details 
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['model/user'], function(User) {
	var UserLogin = User.extend({ 
		
		defaults: {	   
        	mailId: '',
			password: '',

        },
		validation: {

			mailId: {
				required: true,
				pattern: 'email'
			},
			password: {
				required: true,
				minLength : 6
			}
        }
  

	});
        
	return UserLogin;
});