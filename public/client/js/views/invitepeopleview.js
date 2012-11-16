BS.InvitePeopleView = Backbone.View.extend({

	events: {
		"click #close-school" : "closeScreen",
           
	    },
	
    initialize:function () {
    	
        console.log('Initializing Invite View');
        
		this.source = $("#tpl-invite-people").html();
		this.template = Handlebars.compile(this.source);
    },

     
    
    /**
     * render invite view
     */
    render:function (eventName) {
    
        $(this.el).html(this.template);
        return this;
    },
    
    /**
     * close the screen
     */
    closeScreen : function(eventName){
  	  eventName.preventDefault(); 
  	  BS.AppRouter.navigate('streams', {trigger: true});
    },

    
   
});
