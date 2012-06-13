BS.ClassStreamView = Backbone.View.extend({

	events : {

	},

	initialize : function() {
		console.log('Initializing Class Stream View');
		this.source = $("#tpl-class-stream").html();
		this.template = Handlebars.compile(this.source);
		 
	},

	/**
	 * render class Info screen
	 */
	render : function(eventName) {
		 
		var sCount = {
				
				"times" : BS.times
		}
		$(this.el).html(this.template(sCount));
		 
		return this;
	},
	

});
