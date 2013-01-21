 /***
	 * BeamStream
	 *
	 * Author                : Aswathy P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 18/January/2013
	 * Description           : Backbone view for registration
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.RegistrationView = Backbone.View.extend({
	
		events : {
			"click #done_step1" : "completeFirstStep",
			"click #done_step2" : "comepleteSecondStep"
		},
		
		initialize : function() {
			
			console.log('Initializing Basic Registrationdf View');
			this.source = $("#tpl-registration").html();
			this.template = Handlebars.compile(this.source);
	
		},
		
		render : function(eventName) {
			
			 $(this.el).html(this.template);
			 return this;
		},
		
		/**
		 * first step registration - janRain 
		 */
		completeFirstStep: function(eventName){
			eventName.preventDefault();
			$('#step_1').hide(500);
			$('#step1_block').removeClass('active-border');
			$('#step2_block').addClass('active-border');
			$('#step_2').show(500);
		},
		
		/**
		 *  second step registration 
		 */
		comepleteSecondStep: function(eventName){
			eventName.preventDefault();
			$('#step_2').hide(500);
			$('#step2_block').removeClass('active-border');
//			$('#step3_block').addClass('active-border');
			$('#step_3').show(500);
		}
       
            

	});
