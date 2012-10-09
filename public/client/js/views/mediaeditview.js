BS.MediaEditView = Backbone.View.extend({
   
    
        events: {
		"click #sveeditdoc" : "savedocs",   
		"click #edit-close" : "close"
		
	 },
        initialize:function () {
            this.source = $("#document-edit-tpl").html();
            this.template = Handlebars.compile(this.source);
        },
        
        /**
        * render gdocs edit screen
        */
        render:function (datas) {
            $(this.el).html(this.template(datas));
            this.docdatas=datas;
            return this;
            
        
        },
        
        /**
        * function to save the edited tile and description 
        */
        savedocs:function(eventName){
            eventName.preventDefault(); 
            var self = this;
            if (this.docdatas.type=='Docs') {
            $.ajax({
                type : 'POST',
                url : BS.savedocedit,
                data : {
                       docName : $("#media-title").val(),
                       documentId : this.docdatas.id,
                       docDescription : $("#media-description").val()
                       },
                dataType : "json",
                success : function(data) {
                    var content = '';
                    if(data.status == 'Failure')
                        alert("Failed.Please try again");
                    else
                        {
                            alert("Doc Edit Successfully");
                            content='<h4> '+data[0].documentName+'</h4>'
                                    +'<p class="google_doc doc-description" id="'+data[0].id.id+'" >'
                                    +'<input type="hidden" id="id-'+data[0].id.id+'" value="'+data[0].documentURL+'">'
                                    +''+data[0].documentDescription+' </p>';
                            $('#media-'+data[0].id.id+'').html(content);
                            $('#gdocedit').children().detach(); 
                        }
                    }           
                });               
                }
            else 
                {
                    $('#gdocedit').children().detach(); 
                }
        },
        
        /**
        * function to close the gdocs edit screen
        */
        close:function(eventName){
//          var docId = eventName.currentTarget.id;
            var mediatype = $("#edittype").val(); 
            eventName.preventDefault(); 
            $('#gdocedit').children().detach();                 
        }
        
});
