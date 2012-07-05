BS.FilesMediaView = Backbone.View.extend({

	events: {
	       
	      
	 },
	
    initialize:function () {
    	
    	 
        console.log('Initializing Files and Media  View');
        this.template= _.template($("#tpl-files-media").html());
        
    },

    render:function (eventName) {
    	
        $(this.el).html(this.template());
       
        return this;
    },
    
    
    
});
