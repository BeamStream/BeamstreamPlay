BS.PdfListView = Backbone.View.extend({ 
    
     events:{
                "click .pdfpopup" : "pdfpopup"
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
            
            
            var docId = eventName.currentTarget.id;
            var docUrl = $('input#id-'+docId).val();     
            BS.mediafilepopupview = new BS.MediaFilePopupView();
            BS.mediafilepopupview.render(docUrl);            
            $('#gdocedit').html(BS.mediafilepopupview.el);
            
            
        }
})