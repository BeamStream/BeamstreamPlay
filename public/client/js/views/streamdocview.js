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