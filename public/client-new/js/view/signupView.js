/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone sign up page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView' ,'model/user'], function(FormView , UserModel){
	var signupView;
	signupView = FormView.extend({
		objName: 'signupView',

		
		events:{
			'click #registeration': 'registration'
		},
				
		onAfterInit: function(){
			this.data.reset();
		},


		/**
		 * @TODO  user registration 
		 */
		registration:function(e){
			e.preventDefault();
			var user = new UserModel();
			
			user.set({
				mailId :  $('#mailid').val(),
				password :  $('#password').val(),
				confirmPassword : $('#confirmPassword').val(),
				 
			});
			
			var userDetails = JSON.stringify(user);
			console.log(userDetails);
			user.save();
			
		},
		
 
	})
	return signupView;
});