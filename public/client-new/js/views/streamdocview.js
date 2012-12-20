 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/September/2012
	 * Description           : Backbone view for showing documents on a popup in stream page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.StreamDocView = Backbone.View.extend({
	    
        events: {
			"click #popup-close" : "close" 
		 },
	    
        initialize: function(){
            console.log("doc popup");
            this.source = $("#stream-document-tpl").html();
            this.template = Handlebars.compile(this.source);     
        },
	    
        /**
        * render gdocs edit screen
        */
        render:function (docUrl) {
            $(this.el).html(this.template({"docUrl":docUrl}));
            return this;
        
        },
        
        /**
        * function to close the docs view
        */
        close:function(eventName){
            eventName.preventDefault(); 
            $('#streamdocview').children().detach(); 
        }
	        
	        
	})