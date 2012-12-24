BS.GoogleDocsView = Backbone.View.extend({
        
            events:{
     //           "click #gdoc_uploadbutton" : "uploadFile",
                "click .mediapopup" : "showDocPopup",
                "click .doctitle" : "editDocTitle",
                "click .rock_docs" : "rocksDocuments",
//              "click .doc_msg" : "commentDocuments",
     //           "click .show_rockers" : "showDocRockers"
//              "click .comment_button" : "postDocComment",
                "click .then-by li a" : "filterDocs",
                "click #view-files-byrock-list" : "selectViewByRock",
                "click #by-class-list li" :"sortByClass",
                "click #category-list li" :"sortBycategory",
                "click #view-by-date-list" : "selectViewByDate",
                "mouseenter .mediapopup": "showCursorMessage",
                "mouseout  .mediapopup": "hideCursorMessage"
            },
                 
            initialize:function() {
                console.log("google docs view is loded");
                var type = "files";
                this.docsList();   
                this.source = $("#tpl-docsview").html();
                this.template = Handlebars.compile(this.source);
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
                * NEW THEME - view files 
                */
            selectViewByRock: function(eventName){
            	eventName.preventDefault();
            	$('#view-files-byrock-select').text($(eventName.target).text());
                },
            
            
                /**
                * NEW THEME - sort files by category
                */
            sortBycategory: function(eventName){
            	eventName.preventDefault();
            	$('#category-list-select').text($(eventName.target).text());
                },
            
                /*
                *   NEW THEME -To list the documents in the view        
                *
                */           
            docsList : function(eventName)
                {    
                var i = 1;
                var j=1;
                var self = this;                
                 /* get profile images for user */
                $.ajax({
                    type : 'GET',
                    url :  BS.getAllDocs,
                    dataType : "json",
                success : function(docs) {
                    $('#grid').html(""); 
                    var content = '';                   
                    _.each(docs, function(doc) { 	                	                  
                        var datVal =formatDateVal(doc.creationDate);
                        var datas = {
                            "doc" : doc,
                            "datVal" :datVal,
                            "docCount" : i,
                            "image" :'google_docs_image.png'
                            }	
                        var source = $("#tpl-single-bucket").html();
                        var template = Handlebars.compile(source);				    
                        $('#grid').append(template(datas)); 
                        $(".doc_comment_section").hide("slide", { direction: "up" }, 1);                        
                        i++;
                        });  	                
 	                    // Call common Shuffling function         
                    shufflingOnSorting();               
                    }
                    });        
                },
        
                /**
                * Edited By Aswathy @TODO
                * For Doc popups
                */
            showDocPopup :function(eventName){   
            	
                var docId = eventName.currentTarget.id;
                var docUrl = $('input#id-'+docId).val();     
                BS.gdocpopupview = new BS.GdocPopupView();
                BS.gdocpopupview.render(docUrl);           
                $('#gdocedit').html(BS.gdocpopupview.el); 
                $('#bootstrap_popup').modal('show');
                },

                /*NEW THEME -Edit the googledoc title
                * 
                */  
            editDocTitle :function(eventName){  
                var docId = eventName.currentTarget.id;             // id to get corresponding docs   
                var docUrl = $('input#id-'+docId).val();
                $.ajax({                                       
                    type : 'POST',
                    url :  BS.getOneDocs,
                    data : {
                        documentId: docId  
                        },
                    dataType : "json",
                    success : function(docs) {                          
                        var datas = {
                        "id" : docId,
                        "url" : docUrl,
                        "type" : 'Docs',
                        "title" : docs[0].documentName,
                        "description" : docs[0].documentDescription
                        }
                    BS.mediaeditview = new  BS.MediaEditView();
                    BS.mediaeditview.render(datas);
                    $('#gdocedit').html(BS.mediaeditview.el);  
                    $('#edit-bootstrap_popup').modal('show');
                    }
                });
                },
       
                /**
                * NEW THEME -  Rocks Google docs
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





