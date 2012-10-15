BS.PdfListView = Backbone.View.extend({ 
    
     events:{
                "click .mediapopup" : "pdfpopup",
                "click .pdftitle" : "editPdfTitle"
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
            var i = 1;
            var self = this;
            var content='';
            $.ajax({
                     type : 'GET',
                     url :  BS.getAllPDFFilesForAUser,
                     dataType : "json",
                     success : function(pdfs) {
                              $('#grid').html(""); 
                              _.each(pdfs, function(pdf) { 
                              BS.filesMediaView = new BS.FilesMediaView();                                   
                              var datVal = BS.filesMediaView.formatDateVal(pdf.creationDate);     
                              var pdfdata={
                                           "pdf" : pdf,
                                           "datVal" :datVal,
                                           "count":i
                                            }                                                
                              var source = $('#tpl-single-pdf').html();          //creating single bucket view for pdf list view                           
                              var template = Handlebars.compile(source);
                              $('#grid').append(template(pdfdata));
                              i++;
                              });
                        }
               });
            
                                 
        },
        
         /*
         *   To show the pdf view in popup  
         *
         */ 
        pdfpopup :function(eventName){
            var pdfId = eventName.currentTarget.id;  
            $.ajax({                                       
                    type : 'POST',
                    url :  BS.getOneDocs,
                    data : {
                            documentId: pdfId
                            },
                    dataType : "json",
                    success : function(pdfs) { 
                            var pdfdatas = {
                            "id" : pdfs[0].id.id,
                            "url" : pdfs[0].documentURL,
                            "type" : 'Pdf',
                            "title" : pdfs[0].documentName
			  }
            BS.mediafilepopupview = new BS.MediaFilePopupView();
            BS.mediafilepopupview.render(pdfdatas);            
            $('#gdocedit').html(BS.mediafilepopupview.el);       
                  }
                    });      
        },
        
        /*
         *   To edit the title and description of the pdffilelist      
         *
         */ 
        editPdfTitle :function(eventName){  
          var pdfId = eventName.currentTarget.id;             // id to get corresponding pdf file                          
              $.ajax({                                       
                        type : 'POST',
                        url :  BS.getOneDocs,
                        data : {
                                documentId: pdfId  
                                },
                        dataType : "json",
                        success : function(pdfs) {                          
                             var pdfdatas = {
                             "id" : pdfs[0].id.id,
                             "url" : pdfs[0].documentURL,
                             "type" : 'Docs',
                             "title" : pdfs[0].documentName,
                             "description" : pdfs[0].documentDescription
			  }
            BS.mediaeditview = new  BS.MediaEditView();
            BS.mediaeditview.render(pdfdatas);
            $('#gdocedit').html(BS.mediaeditview.el);         
                  }
                    });
                          
//            BS.mediaeditview = new  BS.MediaEditView();
//            BS.mediaeditview.render(datas);
//            $('#gdocedit').html(BS.mediaeditview.el);
            }
})