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
            /* for all other documents */
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
	                    {
	                        alert("Failed.Please try again");
	                    }
	                    else
	                    {
	                            alert("Doc Edit Successfully");
	                            content='<h4> '+data[0].documentName+'</h4>'
	                                    +'<p class="mediapopup doc-description" id="'+data[0].id.id+'" >'
	                                    +'<input type="hidden" id="id-'+data[0].id.id+'" value="'+data[0].documentURL+'">'
	                                    +''+data[0].documentDescription+' </p>';
	                            $('#media-'+data[0].id.id+'').html(content);
	                            $('#gdocedit').children().detach(); 
	                     }
	                 }           
	             });               
            }
            /* for Usermedia (Images /Videos */
            else if(this.docdatas.type=='UserMedia')
            {
            	$.ajax({
	                type : 'POST',
	                url : BS.changeTitleDescriptionUserMedia,
	                data : {
	                	   mediaName : $("#media-title").val(),
	                       userMediaId : this.docdatas.id,
	                       mediaDescription : $("#media-description").val()
	                       },
	                dataType : "json",
	                success : function(data) {
	                    var content = '';
	                    if(data.status == 'Failure')
	                    {
	                        alert("Failed.Please try again");
	                    }
	                    else
	                        {
	                            alert("Edit Successfully");
	                            content='<h4> '+data[0].name+'</h4>'
	                                    +'<p class="mediapopup doc-description" id="'+data[0].id.id+'" >'
	                                    +'<input type="hidden" id="id-'+data[0].id.id+'" value="'+data[0].mediaUrl+'">'
	                                    +''+data[0].description+' </p>';
	                            $('#media-'+data[0].id.id+'').html(content);
	                            $('#gdocedit').children().detach(); 
	                        }
	                    }           
	                });  
                }
        },
        
        /**
        * function to close the gdocs edit screen
        */
        close:function(eventName){
//          var docId = eventName.currentTarget.id;
            var mediatype = $("#edittype").val(); 
            eventName.preventDefault(); 
//            $('#gdocedit').children().detach();    
//$('#bootstrap_popup').modal({show:false});
   $('#bootstrap_popup').modal('hide')  

        }
        
});
