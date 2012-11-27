 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/November/2012
	 * Description           : Backbone view for stream discussions page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.DiscussionView = Backbone.View.extend({
	
		events : {
			 
		},
	
		initialize : function() {
			
			console.log('Initializing Discussion View');
			this.source = $("#tpl-discussion-middle-contents").html();
			this.template = Handlebars.compile(this.source);
			 
		},
		
		/**
		 * render class Info screen
		 */
		render : function(eventName) {
			
			$(this.el).html(this.template);
			return this;
		},
		
	 
	  
	});
