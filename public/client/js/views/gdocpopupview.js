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
            console.log('docUrl');
            console.log(docUrl);
            $(this.el).html(this.template({"docUrl":docUrl}));
            return this;
        
        },
        
        insertdoc:function(){
            
        },
        
        /**
        * function to close the gdocs edit screen
        */
        close:function(eventName){
            eventName.preventDefault(); 
            $('#gdocedit').children().detach(); 
            var googledocsview = new BS.GoogleDocsView();
        },
        
        save:function(eventName){
            eventName.preventDefault(); 
            console.log("saved");
        }
})