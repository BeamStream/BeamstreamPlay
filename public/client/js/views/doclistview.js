BS.DocListView = Backbone.View.extend({
    
    events:{
                "click .mediapopup" : "showDocPopup",
                "click .doctitle" : "editPdfTitle"
         },     
    
    initialize:function() {
            console.log("google docs view is loded");
            this.docsList();   
            this.source = $("#tpl-docsview").html();
            this.template = Handlebars.compile(this.source);
        },
             
        render:function (eventName) {
            $(this.el).html(this.template);
            return this;
        },
        
         /*
         *   To list the documents in the view        
         *
         */           
        docsList : function(eventName)
        {    
            //  eventName.preventDefault();              
            var i = 1;
            var j=1;
            var self = this;             
                $.ajax({
                type : 'GET',
                url :  BS.getAllDOCSFilesForAUser,          
                dataType : "json",
                success : function(docs) {
                var content = '';
                _.each(docs, function(doc) {
                        BS.filesMediaView = new BS.FilesMediaView(); 
                	var datVal =  BS.filesMediaView.formatDateVal(doc.creationDate);
                	var datas = {
                                    "doc" : doc,
                                    "datVal" :datVal,
                                    "docCount" : i
					}	
                	var source = $("#tpl-single-bucket").html();
                        var template = Handlebars.compile(source);				    
                        $('#grid').append(template(datas));         
                        $(".doc_comment_section").hide("slide", { direction: "up" }, 1);                        
                        i++;
                     });  
//                 self.pagination();                                       
                }

               });
               
             
            },
            
            showDocPopup :function(eventName){
            
            var docId = eventName.currentTarget.id;  
            $.ajax({                                       
                    type : 'POST',
                    url :  BS.getOneDocs,
                    data : {
                            documentId: docId
                            },
                    dataType : "json",
                    success : function(docs) { 
                            var pdfdatas = {
                            "id" : docs[0].id.id,
                            "url" : docs[0].documentURL,
                            "type" : 'Docs',
                            "title" : docs[0].documentName
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
          var docId = eventName.currentTarget.id;             // id to get corresponding pdf file                          
              $.ajax({                                       
                        type : 'POST',
                        url :  BS.getOneDocs,
                        data : {
                                documentId: docId  
                                },
                        dataType : "json",
                        success : function(docs) {                          
                             var pdfdatas = {
                             "id" : docs[0].id.id,
                             "url" : docs[0].documentURL,
                             "type" : 'Docs',
                             "title" : docs[0].documentName,
                             "description" : docs[0].documentDescription
			  }
            BS.mediaeditview = new  BS.MediaEditView();
            BS.mediaeditview.render(pdfdatas);
            $('#gdocedit').html(BS.mediaeditview.el);         
                  }
                    });
            }
    
})

