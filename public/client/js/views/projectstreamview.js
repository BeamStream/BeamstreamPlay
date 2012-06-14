BS.ProjectStreamView = Backbone.View.extend({

	events : {

	},

	initialize : function() {
		
		console.log('Initializing Project Stream View');
		
 
		this.source = $("#tpl-project-stream").html();
		this.template = Handlebars.compile(this.source);
		 
	},

	
	 
	/**
	 * render class Info screen
	 */
	render : function(eventName) {
	 
		$(this.el).html(this.template());
		 
		return this;
	},
	
	
    
	
	

});
