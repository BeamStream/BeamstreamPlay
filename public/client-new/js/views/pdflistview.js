BS.PdfListView = Backbone.View.extend({ 
    
            events:{
                "click .mediapopup" : "pdfpopup",
                "click .pdftitle" : "editPdfTitle",
                "click .rock_docs" : "rocksDocuments",
                "click .show_rockers" : "showDocRockers",
                "click .then-by li a" : "filterDocs",
                "click #view-files-byrock-list" : "selectViewByRock",
                "click #by-class-list li" :"sortByClass",
                "click #category-list li" :"sortBycategory",
                "click #view-by-date-list" : "selectViewByDate",
                "mouseenter .mediapopup": "showCursorMessage",
                "mouseout  .mediapopup": "hideCursorMessage"
                },
    
            initialize:function(){       	
                this.source = $("#tpl-docsview").html();
                this.template = Handlebars.compile(this.source);
                this.pdflisting();       
                },
             
            render:function (eventName) {          	
                $(this.el).html(this.template);
                return this;
                },
                
                /**
                * NEW THEM - filter docs.. and prevent default action
                */
            filterDocs :function (eventName){
                eventName.preventDefault();
                },
            
                /**
                * NEW THEME - view files 
                */
            selectViewByRock: function(eventName){
            	eventName.preventDefault();
            	$('#view-files-byrock-select').text($(eventName.target).text());
                },
            
                /**
                * NEW THEME - sort files by class/School
                */
            sortByClass: function(eventName){         	
            	eventName.preventDefault();
            	$('#by-class-select').text("by "+$(eventName.target).text());
                },
            
                /**
                * NEW THEME - view files by date 
                */
            selectViewByDate: function(eventName){
            	eventName.preventDefault();
            	$('#view-by-date-select').text($(eventName.target).text());
                },
            
                /**
                * NEW THEME - sort files by category
                */
            sortBycategory: function(eventName){
            	eventName.preventDefault();
            	$('#category-list-select').text($(eventName.target).text());
                },
                
                /**
                * NEW THEME - list all the pdf files
                */
            pdflisting :function(eventName){
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
                        var datVal = formatDateVal(pdf.creationDate);     
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
                                  // Call common Shuffling function         
                        shufflingOnSorting();
                        }
                    });                             
                },
        
                /*
                *   NEW THEME -To show the pdf view in popup  
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
                    $('#bootstrap_popup').modal('show');
                    }
                });      
                },
        
                /*
                *   NEW THEME -To edit the title and description of the pdffilelist      
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
                    $('#edit-bootstrap_popup').modal('show');
                    }
                    });
                    },

                /**
                * NEW THEME -Rocks pdf files
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
                * NEW THEME -show PDF Rockers list 
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
                $('#'+documentId+'-docRockers-list').fadeIn("fast").delay(1000).fadeOut('fast'); 
                $('#'+documentId+'-docRockers-list').html(ul);
                }
                });   
                },
                
                /**
                * NEW THEME - show a cursor message on files-media preview
                */
            showCursorMessage: function(){
                $.cursorMessage('Click to view ', {hideTimeout:0});
		},
                
                /**
                * NEW THEME - show a cursor message on files-media preview
                */
            hideCursorMessage: function(){
                $.hideCursorMessage();
		}
})