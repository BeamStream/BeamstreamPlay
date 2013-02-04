/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 31/January/2013
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
	var betaUserView;
	betaUserView = FormView.extend({
		objName: 'betaUserView',
		
		events:{
			'click #betaRegister': 'betaUserRegistration'
		},

		onAfterInit: function(){
			this.data.reset();
		},
		
		/**
		 * @TODO  beta userregistration 
		 */
		betaUserRegistration: function(e){
			
			e.preventDefault();
			this.saveForm();
			
		},

		
 
	})
	return betaUserView;
});