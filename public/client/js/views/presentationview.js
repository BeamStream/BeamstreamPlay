BS.PresentationView = Backbone.View.extend({ 
        events:{
                "click .presentationpopup" : "presentationpopup"
                },
    
        initialize:function(){
            this.source = $("#tpl-docsview").html();
            this.template = Handlebars.compile(this.source);
            this.presentation();         
        },
        
        render:function (eventName) {
            $(this.el).html(this.template);
            return this;
            },
                        
        presentation :function(eventName){
//            $('.coveraud').html('content');
            var i = 1;
            var self = this;
            var content='';
            $.ajax({
                        type : 'GET',
                        url :  BS.getAllPPTFilesForAUser,
                        dataType : "json",
                        success : function(ppts) {
//                              if(docs.length != 0)  {
                                $('#grid').html(""); 
                              _.each(ppts, function(ppt) { 
                                BS.filesMediaView = new BS.FilesMediaView();  
                                var datVal = BS.filesMediaView.formatDateVal(ppt.creationDate);     
                                var pptdata={
                                               "ppt" : ppt,
                                               "datVal" :datVal,
                                               "count":i
                                                }  
                                var source = $('#tpl-single-presentation').html();          //creating single bucket view for presentation list view                           
                                var template = Handlebars.compile(source);
                                $('#grid').append(template(pptdata));                    
                                i++;   
                              });
                        }
               });                      
        },
        
        /*
         *   To show the presentation view in popup        
         *
         */ 
        presentationpopup :function(eventName){          
            var docId = eventName.currentTarget.id;
            var docUrl = $('input#id-'+docId).val();     
            BS.mediafilepopupview = new BS.MediaFilePopupView();
            BS.mediafilepopupview.render(docUrl);          
            $('#gdocedit').html(BS.mediafilepopupview.el);
            
            
            /*       var pdfId = eventName.currentTarget.id;
            var pdfUrl = $('input#id-'+docId).val();       
            $.ajax({                                       
                        type : 'POST',
                        url :  BS.getOneDocs,
                        data : {
                                documentId: pdfId
                                },
                        dataType : "json",
                        success : function(pdfs) {                          
                             var datas = {
                             "id" : pdfId,
                             "url" : pdfUrl,
                             "type" : 'Pdf',
                             "title" : pdfs[0].documentName,
                             "description" : pdfs[0].documentDescription
			  }
           BS.mediafilepopupview = new BS.MediaFilePopupView();
           BS.mediafilepopupview.render(docUrl);          
           $('#gdocedit').html(BS.mediafilepopupview.el);      
                  }
                    });     */
            
            
        }
            
})