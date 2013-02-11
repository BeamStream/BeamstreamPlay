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
                defaults: {	        	
                    iam:'0'
                },
                
		validation: {

			mailId: {
				required: true,
				pattern: 'email',
//				msg: 'Please provide your first name'
			} ,
			password: {
				required: true
//				pattern: 'password'
			},
			confirmPassword: {
				required: true
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
                    },
		
//		showError:function(){
//			console.log("no");
//		},
//		showValid: function(){
//			console.log("sss  ");
//		}
               

	});
        
	return User;
});