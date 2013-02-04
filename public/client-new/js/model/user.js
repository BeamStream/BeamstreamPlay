/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone model for user details 
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['model/baseModel'], function(BaseModel) {
	var User = BaseModel.extend({ 
		objName: 'User',
//		url: '/user', 
		validation: {
			mailId: {
				required: true,
				pattern: 'email'
			} ,
			password: {
				required: true,
				pattern: 'password'
			},
			confirmPassword: {
				required: true,
//				equalTo: 'password'
			},
            firstName: {
				required: true
			},
			lastName: {
				required: true
			},
			schoolName: {
				required: true
			},
			major: {
				required: true
			},
			aboutYourself: {
				required: true
			},
			location: {
				required: true
			},
			cellNumber: {				
                pattern: 'phone'
			}
		}

	});
	return User;
});