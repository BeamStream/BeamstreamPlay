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

define(['view/formView','../../lib/bootstrap.min'], function(FormView,Bootstrap ){
	var betaUserView;
	betaUserView = FormView.extend({
		objName: 'betaUserView',
		
		events:{
			'click #betaRegister': 'betaUserRegistration',
			'click .modal-share li': 'shareOnSocialMedia',
			 
		},
		
		
		onAfterInit: function(){
			this.data.reset();
		},
		
		/**
		 * @TODO  beta user registration 
		 */
		betaUserRegistration: function(e){
			e.preventDefault();
			
			// save only if user enter mail id
			if($('#mailId').val())
				var status = this.saveForm( );
			
		},
		
		/**
		 * @TODO call on form save success
		 */
		success: function(model, data){
			
			$('#mailId').val('');
			if(data.message == "Allow To Register")
				$("#modalJoin").modal('show'); 
			else
				alert(data.message);
		},
		
		/**
		 * @TODO call on form save error
		 */
		error: function(e){
			
			alert("Plaese try again !!" );
			$('#mailId').val('');
		},
		
		/**
		 * share beamstream on SocialMedia
		 */
		shareOnSocialMedia: function(e){
			e.preventDefault();
			
			//For social media sharing 
			this.socialMediad = [];
			this.socialMediad.push($(e.target).parent('li').attr('id'));
			
			showJanrainShareWidget('A FREE Social Learning Network, Built for Higher Education', 'View my Beamstream post', 'http://www.beamstream.com', '' ,this.socialMediad);
		}

	})
	return betaUserView;
});