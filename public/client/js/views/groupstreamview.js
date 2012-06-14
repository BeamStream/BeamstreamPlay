BS.GroupStreamView = Backbone.View.extend({

	events : {
		 "click .datepicker" :"setIndex",
	},

	initialize : function() {
		
		console.log('Initializing Group Stream View');
		
 
		this.source = $("#tpl-group-stream").html();
		this.template = Handlebars.compile(this.source);
		 
	},

	
	 
	/**
	 * render class Info screen
	 */
	render : function(eventName) {
	 
		$(this.el).html(this.template());
		 
		return this;
	},
	
	
	setIndex:function(){
		$('.datepicker').css('z-index','9999');
	}
	
	

});
