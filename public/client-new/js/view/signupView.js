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

define(['view/formView'], function(FormView){
	var signupView;
	signupView = FormView.extend({
		objName: 'signupView',
		
		events:{
			'click #registeration': 'registration'
		},

		onAfterInit: function(){
			console.log(this.data);
			this.data.reset();
		},
		
		/**
		 * @TODO  user registration 
		 */
		registration:function(e){
			e.preventDefault();
			this.saveForm();
			
		},
		
 
	})
	return signupView;
});