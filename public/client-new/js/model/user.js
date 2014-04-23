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

define(['baseModel'], function(BaseModel) {
	var User = BaseModel.extend({ 
		objName: 'User',
        defaults: {	   
        	username:'',
            firstName: '',
			lastName: '',
			schoolName: '',
			major: '',
			gradeLevel: '',
			degreeProgram: '',
			graduate: '',
			location: '',
			cellNumber: '',
			aboutYourself: ''

        },

        
		validation: {
			username: {
				required: true
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
			gradeLevel: {
				required: true
			},
			degreeProgram: {
				required: true
			},
			graduate: {
				required: true
			},
			location: {
				required: true
			},
			cellNumber: {				
                pattern: 'phone'
			},
			otherDegree:{
				required: true
			},
			graduationDate: {
				required: true
			},
			degreeExpected:{
				required: true
			},
			mailId: {
				required: true,
				pattern: 'email'
			},
			aboutYourself: {
			}
        }
  

	});
        
	return User;
});