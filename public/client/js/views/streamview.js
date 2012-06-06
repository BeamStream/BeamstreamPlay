window.StreamView = Backbone.View.extend({

	 events :{
		  
	 },
	
    initialize:function () {
    	
        console.log('Initializing Stream View');
		this.source = $("#tpl-main-stream").html();
		this.template = Handlebars.compile(this.source);
    },

    render:function (eventName) {
    	 
    	
    	this.newUser = new SingleUser();
        this.newUser.fetch({success: function(e) {  
			 
			 $('.username').text(e.attributes.userName);
			 $('li.location .icon-location').after(e.attributes.location);
			 $('li.occupation .icon-silhouette').after(e.attributes.userType.name);
			 $('#user-dropdown .arrow').before(e.attributes.userName);
		}});
 
        $(this.el).html(this.template);
        return this;
    },
    
    
    
});