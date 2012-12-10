BS.PdfListView = Backbone.View.extend({ 
    
            events:{
                "click .mediapopup" : "pdfpopup",
                "click .pdftitle" : "editPdfTitle",
                "click #prevslid" : "previous",
                "click #nextslid" : "next",
                "click .rock_docs" : "rocksDocuments",
                "click .show_rockers" : "showDocRockers"
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
                              // Call common Shuffling function         
                              shufflingOnSorting();
                              
                              self.pagination();
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
                            $('#bootstrap_popup').modal('show');
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
                              $('#bootstrap_popup').modal('show');
                       }
                    });
                },
            
                /*
                * pagination for pdflistview
                *
                */
                pagination: function(){
                    var show_per_page = 16;                                     //number of <li> listed in the page
                    var number_of_items = $('#grid').children().size();  
                    var number_of_pages = Math.ceil(number_of_items/show_per_page);  
                    var navigation_count='';
                    $('#current_page').val(0);  
                    $('#show_per_page').val(show_per_page);  
                    var navigation_Prev = '<div class="previous_link" ></div>';  
                    var current_link = 0;  
                    while(number_of_pages > current_link){  
                        navigation_count += '<a class="page_link" href="javascript:go_to_page(' + current_link +')" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';  
                        current_link++;  
                    }  
                    var navigation_next = '<div class="next_link" ></div>';  
                    $('#prevslid').html(navigation_Prev);                       //previous slider icon
                    $('#page_navigation-count').html(navigation_count);  
                    $('#nextslid').html(navigation_next);                       //next slider icon   
                    $('#page_navigation-count .page_link:first').addClass('active_page');  

                    $('#grid').children().css('display', 'none');  

                    $('#grid').children().slice(0, show_per_page).css('display', 'block');  
                },
            
                /*
                * Part of pagination and is used to show previous page
                *
                */
                previous: function (){ 
                    new_page = parseInt($('#current_page').val()) - 1;  
                    if($('.active_page').prev('.page_link').length==true){  
                    this.go_to_page(new_page);  
                    }  
                },  
            
                /*
                * Part of pagination and is used to show next page
                *
                */
                next:function (){
                    new_page = parseInt($('#current_page').val()) + 1;  
                    if($('.active_page').next('.page_link').length==true){  
                    this.go_to_page(new_page);  
                    }  
                },
            
                /*
                * Part of pagination and is used to page setting
                *
                */
                go_to_page:function (page_num){  
                    var show_per_page = parseInt($('#show_per_page').val());  
                    start_from = page_num * show_per_page;  
                    end_on = start_from + show_per_page;  
                    $('#grid').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');  
                    $('.page_link[longdesc=' + page_num +']').addClass('active_page').siblings('.active_page').removeClass('active_page');  
                    $('#current_page').val(page_num);  
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
                        $('#'+documentId+'-docRockers-list').fadeIn("fast").delay(1000).fadeOut('fast'); 
                        $('#'+documentId+'-docRockers-list').html(ul);
                        }
                    });
         	   
                }
})