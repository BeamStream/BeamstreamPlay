window.StreamView = Backbone.View.extend({

	 events :{
		  
	 },
	
    initialize:function () {
    	
        console.log('Initializing Stream View');
		this.source = $("#tpl-main-stream").html();
		this.template = Handlebars.compile(this.source);
    },

    render:function (eventName) {
 
        $(this.el).html(this.template(window.user.toJSON()));
        return this;
    },
    
    
    
});