BS.PdfListView = Backbone.View.extend({ 
    
     events:{

                "click .mediapopup" : "pdfpopup",
                "click .pdftitle" : "editPdfTitle",
                "click .rock_docs" : "rocksDocuments",
                "click .show_rockers" : "showDocRockers"
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
            },
            
            /**
             * Rocks Google docs
             */
            rocksDocuments:function(eventName){
         	   
                 eventName.preventDefault();
                 var element = eventName.target.parentElement;
                 var docId =$(element).attr('id');
     	  		 // post documentId and get Rockcount 
                 $.ajax({
     	               type: 'POST',
     	               url:BS.rockDocs,
     	               data:{
     	            	   documentId:docId
     	               },
     	               dataType:"json",
     	               success:function(data){	              	 
     	              	// display the rocks count  
     	            	$('#'+docId+'-activities li a.hand-icon').html(data);	   
     	               }
     	         });
            },
            /**
             * show PDF Rockers list 
             */
            showDocRockers :function(eventName){
         	   eventName.preventDefault();
         	   var element = eventName.target.parentElement; 
               var documentId =$(element).closest('div').parent('div').attr('id');
                
         	   $.ajax({
                    type: 'POST',
                    url:BS.documentRockers,
                    data:{
                   	  documentId:documentId
                    },
                    dataType:"json",
                    success:function(data){
                   	 
                   	  // prepair rockers list
                     var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">Who Rocked it ?</div><ul class="rock-list">';
                   	_.each(data, function(rocker) { 					 
                   		ul+= '<li>'+rocker+'</li>';
       			    });
                   	ul+='</ul>';  
                   	console.log(ul);
                   	$('#'+documentId+'-docRockers-list').fadeIn("fast").delay(1000).fadeOut('fast'); 
                   	$('#'+documentId+'-docRockers-list').html(ul);

                    }
                 });
         	   
          }
})