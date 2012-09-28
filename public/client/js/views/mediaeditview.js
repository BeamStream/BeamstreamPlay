BS.MediaEditView = Backbone.View.extend({
   
    
        events: {
		"click #svedtdoc" : "savedocs",
		"click #edit-close" : "close"
	 },
        initialize:function () {
            this.source = $("#document-edit-tpl").html();
            this.template = Handlebars.compile(this.source);
            //console.log("testing");
        },
        
        /**
        * render gdocs edit screen
        */
        render:function (datas) {
//            console.log(datas.type);
            $(this.el).html(this.template(datas));
            return this;
        
        },
        
        /**
        * function to save the edited tile and description 
        */
        savedocs:function(eventName){
            console.log("saved");
        },
        
        /**
        * function to close the gdocs edit screen
        */
        close:function(eventName){
//            var docId = eventName.currentTarget.id;
            var mediatype = $("#edittype").val(); 
            eventName.preventDefault(); 
            $('#gdocedit').children().detach();                 
        }
        
});
