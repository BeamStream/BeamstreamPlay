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

define(['view/formView','../../lib/bootstrap.min'], function(FormView ,Bootstrap ){
	var betaUserView;
	betaUserView = FormView.extend({
		objName: 'betaUserView',
		
		events:{
			'click #betaRegister': 'betaUserRegistration'
		},

		onAfterInit: function(){
			this.data.reset({'mailId':''});
		},
		
		/**
		 * @TODO  beta user registration 
		 */
		betaUserRegistration: function(e){
			e.preventDefault();
			this.saveForm();
			
		},

		
 
	})
	return betaUserView;
});