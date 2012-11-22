BS.GdocPopupView = Backbone.View.extend({
    
        events: {
		"click #popup-close" : "close" 
	 },
    
        initialize: function(){
            console.log("doc popup");
            this.source = $("#document-popup-tpl").html();
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
            $('#gdocedit').children().detach(); 
        }
        
        
})