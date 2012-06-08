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
        	
			 $('.username').text(e.attributes.firstName + ' ' + e.attributes.lastName);
			 $('li.location .icon-location').after(e.attributes.location);
			 $('li.occupation .icon-silhouette').after(e.attributes.userType.name);
			 $('#user-dropdown .arrow').before(e.attributes.firstName + ' ' + e.attributes.lastName);
			 $('li.screen_name').text(e.attributes.firstName + ' ' + e.attributes.lastName);
		}});
        
        $(this.el).html(this.template);
        return this;
    },
    
    
     
    
    
    
});