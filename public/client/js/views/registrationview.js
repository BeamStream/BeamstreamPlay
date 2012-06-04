window.RegistrationView = Backbone.View.extend({

	 
	
    initialize:function () {
    	
        console.log('Initializing Basic Registration View');
        this.template= _.template($("#tpl-basic-profile").html());
        
    },

    render:function (eventName) {
    	
        $(this.el).html(this.template());
        return this;
    },
    
    
     
   
    
});