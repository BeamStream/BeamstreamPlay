 /***
	 * BeamStream
	 *
	 * Author                : Cuckoo Anna (cuckoo@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 17/January/2013
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
			
		},
		initialize : function() {
			
			console.log('Initializing Basic Registration View');
			this.source = $("#tpl-userregistration_home").html();
			this.template = Handlebars.compile(this.source);
	
		},
		
		render : function(eventName) {
			
			 $(this.el).html(this.template);
			 return this;
			 
		}
         
	});
