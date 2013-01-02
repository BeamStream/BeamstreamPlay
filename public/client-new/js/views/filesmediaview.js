/***
	 * BeamStream
	 *
	 * Author                : Cuckoo Anna (cuckoo@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 20/September/2012
	 * Description           : Backbone view for main stream page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
    
BS.FilesMediaView = Backbone.View.extend({
                

            events: {
                "click .gdoc_uploadbutton" : "uploadFile",
                "click .doctitle" : "editDocTitle",
                "click .imgtitle" : "editImgTitle",
                "click .videotitle" : "editVideoTitle",  
                //"click .audiotitle" : "editAudioTitle",
                "click .pdftitle" : "editPdfTitle",
                "click .presentationtitle" : "editPresentationTitle",
                "mouseenter #uploadmedia_dr":"uploadMediadwn",
                "mouseleave #dropdownnew":"uploadMediaup",
                    "click #classdoc_dr":"classdocMenuList",
                    "click .classdocument_mycomp":"classdocFileForm",
                    "click .vialink_dr":"vialinkMenu",
                    "click #vialink_uploadbutton":"vialinkUpload",
                     "click .googledocs_dr":"googleDocs",
                     "click #assignment_dr":"assignmentMenuList", 
                     "click .importfrmlink_dr": "importFromLink",
                     "click #homework_dr":"homeMenuList",
                     "click #notes_dr":"notesMenuList",
                     "click #projects_dr":"projectsMenuList",
                     "click #lecture_dr":"lectureMenuList",
                     "click #reference_dr":"referenceMenuList",
                     "click #tutorial_dr":"tutorialMenuList",
                     "click #edtech_dr":"edtechMenuList",
                     "click #amusement_dr":"amusementMenuList",
                     "click #public_dr":"publicMenuList",
                "click #links_dr":"linksMenuList",
                "click #links_uploadbutton":"linkupload",  
                "click #googledocs_mycomp":"showFileForm",
                         
               
                                
               
               
                
                "click #audio_dr":"audioMenuList",               
 //               "click #vialink_dr":"audioVialink",
                "click #audio_uploadbutton":"audioUpload",
               
                "click #presvialink_dr":"presentationVialink",
                "click #press_uploadbutton":"presentationUpload",
                "click .docfrmcomputer_uploadbutton": "saveMyFile",
                'change #doc-from-computer' :'displayImage',
                'click #docfrmcomputer_closePopup': "hidePopUpBlock",    
                //"click #select_dr":"selectboxdwn",
                //"blur #select_dr":"selectboxup"
                //"click #profile-images":"listProfileImages",                       
                "click .then-by li a" : "filterDocs",
                "click #view-by-list" : "selectViewByAll",
                "click #view-files-byrock-list" : "selectViewByRock",
                "click .rock-medias" : "rocksMeidas",
                "click .rock_docs" : "rocksDocuments",
                "click #by-class-list li" :"sortByClass",
                "click #category-list li" :"sortBycategory",
                "click .browse-right a" :"selectViewStyle",
                "click #view-by-date-list" : "selectViewByDate",	
                "click #uploadmediachild_dr li" :"removeOptions"
               
                },

	
            initialize:function () {         	 	            
                this.source = $("#tpl-files-media").html();
                this.template = Handlebars.compile(this.source);
                this.pictres();	
                this.videos();   
                this.docsList();
//                this.audio();  
                this.spreadsheet();  
                this.presentation();  
                this.pdffiles();
                this.docFromComputer();
                //this.links(); 
                //this.template= _.template($("#tpl-files-media").html()); 
                },

            render:function (eventName) {
                $(this.el).html(this.template);
                return this;
                },

    
            /**
             * NEW THEME - hide visual drop down list
             */
            
             removeOptions:function(eventName){
            	eventName.stopPropagation();
                },
                

                /**
                * NEW THEME - view files 
                */
            selectViewByAll: function(eventName){
                eventName.preventDefault();
                $('#view-by-select').text($(eventName.target).text());
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
                * NEW THEME - rocks media( images/videos) 
                */
            rocksMeidas: function(eventName){
                eventName.preventDefault();
                var element = eventName.target.parentElement;
                var imageId =$(element).attr('id');
                var parent = $('div#'+imageId).parent('li');

                // post documentId and get Rockcount 
                $.ajax({
                type: 'POST',
                url:BS.rockTheUsermedia,
                data:{
                    userMediaId:imageId
                },
                dataType:"json",
                success:function(data){	              	 
                    // display the rocks count  
                    $('#'+imageId+'-activities li a.hand-icon').html(data);	   
                    $(parent).attr('data-rock',data);
                    }
                });
                },
                
                /**
                * NEW THEME - select files view style
                */
            selectViewStyle: function(eventName){
                eventName.preventDefault();
                $('.browse-right a.activebtn').removeClass('activebtn');
                $(eventName.target).parents('a').addClass('activebtn');
                },
                
                /**
                * NEW THEME - sort files by class/School
                */
            sortByClass: function(eventName){           	
                eventName.preventDefault();
                $('#by-class-select').text("by "+$(eventName.target).text());
                },
                
                /**
                * NEW THEME - sort files by category
                */
            sortBycategory: function(eventName){
                eventName.preventDefault();
                $('#category-list-select').text($(eventName.target).text());
                },
                
                /**
                * NEW THEME - rocks other documents 
                */
            rocksDocuments: function(eventName){     	
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
                
         
                /*
                * Author:Cuckoo Anna on 09July2012
                * For Uploading docs
                * docType can be one of "GoogleDocs", "YoutubeVideo", "Other".
                * docAccess can be one of "Private", "Public", "Restricted", "Stream".
                */  
            uploadFile : function(){
                                      /* Upload the googledocs from url with details */
                var documentModel = new BS.Document();
                if($("#gdoc-url").val().length != 0){
                    documentModel.set({
                    docName : $("#gdoc-name").val(),
                    docURL : $("#gdoc-url").val(),  
                    docAccess: 'Public',
                    docType: 'GoogleDocs',
                    streamId: $("#doc-class-list").val(),
                    docDescription: $("#gdoc-description").val()
                    });
                    var documentData = JSON.stringify(documentModel);
                    var self = this;
                    $.ajax({
                        type : 'POST',
                        url : BS.docUpload,
                        data : {
                            data : documentData
                            },
                        dataType : "json",
                    success : function(data) {
                        if(data.status == 'Failure')
                            alert("Failed.Please try again");
                        else
                            {
                            alert("Doc Uploaded Successfully");
                                self.docsList(); 
                                console.log("Doc Uploaded Successfully");
                            }
                        }           
                    });
                    }
                $("#dropdownnew").find('ul').hide(250); 
                },
      
                /**
                * NEW THEM - filter docs.. and prevent default action
                */
            filterDocs :function (eventName){
                eventName.preventDefault();
                },
                
                /**
                * NEW THEME-Display the google doc
                */    
            docsList : function(){  
                var i = 1;
                var self = this;
                $.ajax({
                    type : 'GET',
                    url :  BS.getAllDocs,
                    dataType : "json",
                success : function(docs) {
                    if(docs.length != 0)  {
                        _.each(docs, function(doc) {
                        var datVal = formatDateVal(doc.creationDate);                   
                        docContent= '<li data-groups="["recent"]" data-date-created="'+doc.creationDate+'" class="item" >'
                            +'<div class="image-wrapper hovereffect" id="'+doc.id.id+'">'
                            +' <div class="hover-div"><img class="cover-picture" src="images/google_docs_image.png ">'
                            +'<div class="hover-text">'               
                            +'<div class="comment-wrapper">'                                
                            +'<a href="#googledocs" style="text-decoration: none">'
                            +' <div id="media-'+doc.id.id+'" >'
                            +' <h4 id="name-'+doc.id.id+'">'+doc.documentName+'</h4>'                                
                            +'<div class="description-info"><div class="description-left"><p id="description-'+doc.id.id+'" class="doc-description">'+doc.documentDescription+'</p></div></a>'
                            +' <div id="'+doc.id.id+'" class="comment-wrapper2">'
                            +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock_docs"></a>'
                            +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                            +'</div></div></div>'
                            +'<h5 class="doctitle" id="'+doc.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                            +'<div class="dateinfo"><span class="state">'+doc.documentAccess.name+'</span><span class="date">'+datVal+'</span></div>'
                            +'</div></div></div>'
                            +'<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>'
                            +'<ul id="'+doc.id.id+'-activities" class="comment-list">'
                            +'<li><a class="eye-icon" href="#">0</a></li>'
                            +'<li><a class="hand-icon" href="#">'+doc.documentRocks+'</a></li>'
                            +'<li><a class="message-icon" href="#">0</a></li>'
                            +'</ul>'
                            +'</div></li>';                               
                            });
                            $('.files-list').append(docContent);                          
                            }
                        }
                    });
                },

                /**
                * NEW THEME-Display the doc files uploaded from computer
                */       
            docFromComputer :function(){
                var extensionpattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
                var self = this;
                $.ajax({
                type : 'GET',
                url :  BS.getAllDOCSFilesForAUser,
                dataType : "json",
                success : function(docs) {
                    if(docs.length != 0)  {
                    var comContent;
                    _.each(docs, function(doc) {  
                    var extension = (doc.documentURL).match(extensionpattern); 
                                                                              // set first letter of extension in capital letter  
                    extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
                        return letter.toUpperCase();
                        });
                    var datVal = formatDateVal(doc.creationDate);                      
                    comContent=  '<li  data-groups="["oldest"]"  data-date-created="'+doc.creationDate+'" class="item" >'
                        +'<div class="image-wrapper hovereffect" id="'+doc.id.id+'">'
                        +' <div class="hover-div"><img class="cover-picture" src="images/textimage.png"><h3 class="common-doctext" >'+extension+'</h3>'
                        +'<div class="hover-text">'               
                        +'<div class="comment-wrapper">'                                
                        +'<a href="#docs" style="text-decoration: none">'
                        +' <div id="media-'+doc.id.id+'" >'
                        +' <h4 id="name-'+doc.id.id+'">'+doc.documentName+'</h4>'                                
                        +'<div class="description-info"><div class="description-left"><p class="doc-description" id="description-'+doc.id.id+'">'+doc.documentDescription+'</p></div></a>'
                        +' <div id="'+doc.id.id+'" class="comment-wrapper2">'
                        +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock_docs"></a>'
                        +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                        +'</div></div></div>'
                        +'<h5 class="doctitle" id="'+doc.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                        +'<div class="dateinfo"><span class="state">'+doc.documentAccess.name+'</span><span class="date">'+datVal+'</span></div>'
                        +'</div></div></div>'
                        +'<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>'
                        +'<ul id="'+doc.id.id+'-activities" class="comment-list">'
                        +'<li><a class="eye-icon" href="#">0</a></li>'
                        +'<li><a class="hand-icon" href="#">'+doc.documentRocks+'</a></li>'
                        +'<li><a class="message-icon" href="#">0</a></li>'
                        +'</ul>'
                        +'</div></li>';                                           
                        });
                        $('.files-list').append(comContent);   
                    }
                    }
                });
                },
        
                /*
                *NEW THEME-Edit the document title 
                */
            editDocTitle :function(eventName){        	
                var docId = eventName.currentTarget.id;             
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
                        "description" :docs[0].documentDescription
                        }
                    BS.mediaeditview = new  BS.MediaEditView();
                    BS.mediaeditview.render(datas);
                    $('#edit-popup').html(BS.mediaeditview.el);  
                    $('#edit-bootstrap_popup').modal('show');
                    }
                    });          
                },
        
                /*
                *NEW THEME-function to show pictures in filesmediaview
                */
            pictres : function(){  
                var self = this;
                var arraypictures = new Array();
                var content='';
                var coverpicture;           
                /* get images for user */
                $.ajax({
                    type : 'GET',
                    url :  BS.allProfileImages,
                    dataType : "json",
                success : function(images) {
                    if(images.length != 0)
                        {
                        _.each(images, function(image) {                            		
                        var datVal = formatDateVal(image.dateCreated);  
                        picContent='<li   data-rock="'+image.rocks+'" data-date-created="'+image.dateCreated+'" class="item" >'
                            +'<div class="image-wrapper hovereffect"  id="'+image.id.id+'"><div class="hover-div">'
                            +'<img class="filmedia-picture" src="'+image.mediaUrl+'">'
                            +'<div class="hover-text">'
                            +'<div class="comment-wrapper"> '
                            +'<a href="#imagelist" style="text-decoration: none">'
                            +' <div id="media-'+image.id.id+'" >'
                            +' <h4 id="name-'+image.id.id+'">'+image.name+'</h4>'
                            +'<div class="description-info"><div class="description-left"><p class="doc-description" id="description-'+image.id.id+'" >'+image.description+'</p></div></a>'
                            +' <div id="'+image.id.id+'" class="comment-wrapper2">'
                            +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock-medias"></a>'
                            +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                            +'</div></div></div>'
                            +'<h5 class="imgtitle" id="'+image.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                            +'<div class="dateinfo"><span class="state">'+image.access.name+'</span><span class="date">'+datVal+'</span></div>'
                            +'</div></div></div>'
                            +'<div class="comment-wrapper1"> <a class="common-icon camera" href="#"></a>'
                            +'<ul id="'+image.id.id+'-activities" class="comment-list">'
                            +'<li><a class="eye-icon" href="#">0</a></li>'
                            +'<li><a class="hand-icon" href="#">'+image.rocks+'</a></li>'
                            +'<li><a class="message-icon" href="#">0</a></li>'
                            +'</ul>'
                            +'</div>'
                            +'</li>';
                        });
                        $('.files-list').append(picContent);
                        }
                    }
                    });
                },
        
                /*
                * NEW THEME-Edit the Image's  title and Description
                */ 
            editImgTitle :function(eventName){      	 
        	var imageId = eventName.currentTarget.id;      
                /* post new title and description */
                $.ajax({                                       
                    type : 'POST',
                    url :  BS.getMedia,
                    data : {
                	userMediaId: imageId  
                    },
                    dataType : "json",
                success : function(imagess) {                 	
                    var imagedatas = {
                        "id" : imagess[0].id.id,
                        "url" : imagess[0].mediaUrl,
                        "type" : 'UserMedia',
                        "title" : imagess[0].name,
                        "description" : imagess[0].description
                        }    
                    BS.mediaeditview = new  BS.MediaEditView();
                    BS.mediaeditview.render(imagedatas);
                    $('#edit-popup').html(BS.mediaeditview.el);
                    $('#edit-bootstrap_popup').modal('show');
                    }
                    });
                },
        
            /*
            *NEW THEME-function to show videos in filesmediaview
            */
            videos:function(){
                var self = this;
                var arrayvideos = new Array();
                var content='';
                var coverpicture; 
                /* get videos for user */
                $.ajax({
                    type : 'GET',
                    url : BS.allProfileVideos,
                    dataType : "json",
                success : function(videos) {                        	
                    if(videos.length != 0)
                    {
                    arraypictures=videos;
                    coverpicture=arraypictures[arraypictures.length-1];                               
                    _.each(videos, function(video) {
                    var datVal = formatDateVal(video.dateCreated);   
                    videoContent= '<li data-rock="'+video.rocks+'" data-date-created="'+video.dateCreated+'" class="item" >'
                        +'<div class="image-wrapper hovereffect">'
                        +' <div class="hover-div"><img class="filmedia-picture" src="'+video.frameURL+'">'
                        +'<div class="hover-text">'               
                        +'<div class="comment-wrapper">'                                
                        +'<a href="#videos" style="text-decoration: none">'
                        +' <div id="media-'+video.id.id+'" >'
                        +' <h4 id="name-'+video.id.id+'">'+video.name+'</h4>'                                
                        +'<div class="description-info"><div class="description-left"><p id="description-'+video.id.id+'" class="doc-description">'+video.description+'</p></div></a>'
                        +' <div id="'+video.id.id+'" class="comment-wrapper2">'
                        +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock-medias"></a>'
                        +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                        +'</div></div></div>'
                        +'<h5 class="videotitle" id="'+video.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                        +'<div class="dateinfo"><span class="state">'+video.access.name+'</span><span class="date">'+datVal+'</span></div>'
                        +'</div></div></div>'
                        +'<div class="comment-wrapper1"> <a class="common-icon video" href="#"></a>'
                        +'<ul id="'+video.id.id+'-activities" class="comment-list">'
                        +'<li><a class="eye-icon" href="#">0</a></li>'
                        +'<li><a class="hand-icon" href="#">'+video.rocks+'</a></li>'
                        +'<li><a class="message-icon" href="#">0</a></li>'
                        +'</ul>'
                        +'</div></li>';	
                        });
                    $('.files-list').append(videoContent);
                    shufflingOnSorting(); 
                        }
                    }
                    });
            },
        
            /*
            * NEW THEME-Edit the Video title and decsription
            */  
            editVideoTitle :function(eventName){             
                var videoId = eventName.currentTarget.id;            
                $.ajax({                                       
                    type : 'POST',
                    url :  BS.getMedia,
                    data : {
                        userMediaId: videoId  
                    },
                    dataType : "json",
                success : function(imagess) {                          
                    var imagedatas = {
                        "id" : imagess[0].id.id,
                        "url" : imagess[0].mediaUrl,
                        "type" : 'UserMedia',
                        "title" : imagess[0].name,
                        "description" : imagess[0].description
                        }
                BS.mediaeditview = new  BS.MediaEditView();
                BS.mediaeditview.render(imagedatas);
                $('#edit-popup').html(BS.mediaeditview.el);
                $('#edit-bootstrap_popup').modal('show');
                    }
                    });
                },
        
                /**
                * Function for show audio
                */
            audio :function(eventName){
//             $('.coveraud').html('content');
                var self = this;
                $.ajax({
                type : 'GET',
                url :  BS.getaudioFilesOfAUser,
                dataType : "json",
                success : function(data) {
              //if(docs.length != 0)  {
                _.each(data, function(audio) {
                var datVal = formatDateVal(audio.creationDate);     
                var content= '<div data-groups="["recent"]" class="image-wrapper hovereffect">'
                +' <div class="hover-div"><img class="cover-picture" src="images/audio_image.png">'
                +'<div class="hover-text">'               
                +'<div class="comment-wrapper">'                                
                +'<a href="#audioview" style="text-decoration: none">'
                +' <div id="media-'+audio.id.id+'" >'
                +' <h4 id="name-'+audio.id.id+'">'+audio.documentName+'</h4>'                                
                +'<div class="description-info"><div class="description-left"><p id="description-'+audio.id.id+'" class="doc-description">'+audio.documentDescription+'</p></div></a>'
                +' <div class="comment-wrapper2">'
                +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon"></a>'
                +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                +'</div></div></div>'
                +'<h5 class="audiotitle" id="'+audio.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                +'<div class="dateinfo"><span class="state">'+audio.access.name+'</span><span class="date">'+datVal+'</span></div>'
                +'</div></div></div>'
                +'<div class="comment-wrapper1"> <a class="common-icon music" href="#"></a>'
                +'<ul class="comment-list">'
                +'<li><a class="eye-icon" href="#">87</a></li>'
                +'<li><a class="hand-icon" href="#">5</a></li>'
                +'<li><a class="message-icon" href="#">10</a></li>'
                +'</ul>'
                +'</div>';
                $('#coveraudio').html(content);                              
                });
            //   }
                }
                });                 
                },
        
                /*
                *   To edit the title and description of the Audio file      
                *
                */ 
            editAudioTitle :function(eventName){  
                var datas = {
                    "type" : 'Audio',
                    "title" : '',
                    "description" :''
                    }
                BS.mediaeditview = new  BS.MediaEditView();
                BS.mediaeditview.render(datas);
                $('#gdocedit').html(BS.mediaeditview.el);
                },
        
                /**
                * Function for show spreadsheet
                * 
                */
            spreadsheet :function(eventName){
                content= '<div class="hover-div"><img class="cover-picture" src="images/video_image.png"/><div class="hover-text"><div class="image-wrapper"><a id="profile-videos" href="#videos"><img src="images/image2.jpg"></a>'
                +'</div></div><div class="comment-wrapper comment-wrapper1"> <a class="common-icon video" href="#"></a>'
                +'<ul class="comment-list">'
                +'<li><a class="eye-icon" href="#">87</a></li>'
                +'<li><a class="hand-icon" href="#">5</a></li>'
                +'<li><a class="message-icon" href="#">10</a></li></ul></div>';
                $('#coverspreadsheet').html('content');  
                },
        
                /**
                * NEW THEME-Function for show presentation
                * 
                */
            presentation :function(eventName){
                var self = this;
                $.ajax({
                    type : 'GET',
                    url :  BS.getAllPPTFilesForAUser,
                    dataType : "json",
                success : function(ppts) {
                    if(ppts.length != 0)  {
                        var presContent;
                        _.each(ppts, function(ppt) {
                        var datVal = formatDateVal(ppt.creationDate);     
                        presContent= '<li  data-groups="["recent"]"  data-date-created="'+ppt.creationDate+'" class="item" >'
                            +'<div class="image-wrapper hovereffect" id="'+ppt.id.id+'">'
                            +' <div class="hover-div"><img class="cover-picture" src="images/presentations_image.png">'
                            +'<div class="hover-text">'               
                            +'<div class="comment-wrapper">'                                
                            +'<a href="#presentationview" style="text-decoration: none">'
                            +' <div id="media-'+ppt.id.id+'" >'
                            +' <h4 id="name-'+ppt.id.id+'">'+ppt.documentName+'</h4>'                                
                            +'<div class="description-info"><div class="description-left"><p id="description-'+ppt.id.id+'" class="doc-description">'+ppt.documentDescription+'</p></div></a>'
                            +' <div id="'+ppt.id.id+'" class="comment-wrapper2">'
                            +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock_docs"></a>'
                            +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                            +'</div></div></div>'
                            +'<h5 class="presentationtitle" id="'+ppt.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                            +'<div class="dateinfo"><span class="state">'+ppt.documentAccess.name+'</span><span class="date">'+datVal+'</span></div>'
                            +'</div></div></div>'
                            +'<div class="comment-wrapper1"> <a class="common-icon presentation" href="#"></a>'
                            +'<ul id="'+ppt.id.id+'-activities" class="comment-list">'
                            +'<li><a class="eye-icon" href="#">0</a></li>'
                            +'<li><a class="hand-icon" href="#">'+ppt.documentRocks+'</a></li>'
                            +'<li><a class="message-icon" href="#">0</a></li>'
                            +'</ul>'
                            +'</div></li>';
                            });
                        $('.files-list').append(presContent); 
                        shufflingOnSorting();                           	
                        }
                        }
                    });       
                },
        
                /*
                *   NEW THEME-To edit the title and description of the presentation file      
                *
                */ 
            editPresentationTitle :function(eventName){  
                var pptId = eventName.currentTarget.id;             // id to get corresponding presentation   
                $.ajax({                                       
                    type : 'POST',
                    url :  BS.getOneDocs,
                    data : {
                            documentId: pptId  
                            },
                    dataType : "json",
                success : function(ppts) {                          
                    var pptdatas = {
                    "id" : ppts[0].id.id,
                    "url" : ppts[0].documentURL,
                    "type" : 'Docs',
                    "title" : ppts[0].documentName,
                    "description" : ppts[0].documentDescription
                    }
                BS.mediaeditview = new  BS.MediaEditView();
                BS.mediaeditview.render(pptdatas);
                $('#edit-popup').html(BS.mediaeditview.el);
                $('#edit-bootstrap_popup').modal('show');
                }
                });
                },
        
                /**
                * NEW THEME-Function for show pdffiles
                * 
                */
            pdffiles :function(eventName){
                var self = this;
                $.ajax({
                type : 'GET',
                url :  BS.getAllPDFFilesForAUser,
                dataType : "json",
                success : function(pdfs) {	
                    if(pdfs.length != 0)  {
                    var pdfContent ;
                    _.each(pdfs, function(pdf) {
                    var datVal = formatDateVal(pdf.creationDate);                
                    pdfContent= '<li  data-groups="["oldest"]"  data-date-created="'+pdf.creationDate+'" class="item" >'
                        +'<div class="image-wrapper hovereffect" id="'+pdf.id.id+'">'
                        +' <div class="hover-div"><img class="filmedia-picture" src="'+pdf.previewImageUrl+'">'
                        +'<div class="hover-text">'               
                        +'<div class="comment-wrapper">'                                
                        +'<a href="#pdflistview" style="text-decoration: none">'
                        +' <div id="media-'+pdf.id.id+'" >'
                        +' <h4 id="name-'+pdf.id.id+'">'+pdf.documentName+'</h4>'                                
                        +'<div class="description-info"><div class="description-left"><p id="description-'+pdf.id.id+'" class="doc-description">'+pdf.documentDescription+'</p></div></a>'
                        +' <div id="'+pdf.id.id+'" class="comment-wrapper2">'
                        +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock_docs"></a>'
                        +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                        +'</div></div></div>'
                        +'<h5 class="pdftitle" id="'+pdf.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                        +'<div class="dateinfo"><span class="state">'+pdf.documentAccess.name+'</span><span class="date">'+datVal+'</span></div>'
                        +'</div></div></div>'
                        +'<div class="comment-wrapper1"> <a class="common-icon pdf" href="#"></a>'
                        +'<ul id="'+pdf.id.id+'-activities" class="comment-list">'
                        +'<li><a class="eye-icon" href="#">0</a></li>'
                        +'<li><a class="hand-icon" href="#">'+pdf.documentRocks+'</a></li>'
                        +'<li><a class="message-icon" href="#">0</a></li>'
                        +'</ul>'
                        +'</div></li>';
                        });
                    $('.files-list').append(pdfContent); 
                    shufflingOnSorting();                            	
                    }
                    }
                });
                },
        
                /*
                *   NEW THEME-To edit the title and description of the pdffilelist      
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
                $('#edit-popup').html(BS.mediaeditview.el); 
                $('#edit-bootstrap_popup').modal('show');
                }
                });
                },         
        
                /**
                * Function for show links
                * 
                */
            links :function(eventName){
                content= '<div class="hover-div"><img class="cover-picture" src="images/video_image.png"/><div class="hover-text"><div class="image-wrapper"><a id="profile-videos" href="#videos"><img src="images/image2.jpg"></a>'
                +'</div></div><div class="comment-wrapper comment-wrapper1"> <a class="common-icon video" href="#"></a>'
                +'<ul class="comment-list">'
                +'<li><a class="eye-icon" href="#">87</a></li>'
                +'<li><a class="hand-icon" href="#">5</a></li>'
                +'<li><a class="message-icon" href="#">10</a></li></ul></div>';
                $('#coverlink').html(content);  
                },
                
             
           
        
                /**
                * 
                * NEW THEME-Function for uploadmedia (dropdown menu)
                *  (slide down menu)
                * 
                */
            uploadMediadwn :function(eventName){         
                eventName.preventDefault();
                if(!$('#uploadmediachild_dr').is(":visible") )       
                $("#uploadmediachild_dr").slideDown();         
                },
        
                /* NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from Links)
                */
            linksMenuList:function(eventName){
                eventName.preventDefault();
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#linksmenu_dr").animate({width: 'toggle'},120);
                var i='';
                var content='';       
                $.ajax({
                    type : 'GET',
                    url : BS.allStreamsForAUser,
                    dataType : "json",
                success : function(options) {
                    content+='<option>Save to Class</option>'
                    _.each(options, function(option) {
                        content+= '<option>'+option.streamName+'</option>';
                        i++;
                        });
                    content+='<option>Profile</option>'
                           +'<option>My Docs</option>';             
                    $('#link-class-list').html(content); 
                    }		  
                    });                               
                },
 
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (linksupload button)
                *
                */
            linkupload: function(eventName){
                eventName.preventDefault();
                $("#dropdownnew").find('ul').hide(250); 
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from papers and docs)
                */
            assignmentMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#assigncmenu_dr").animate({width: 'toggle'},150);
                },
                
            
                
                                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from homework)
                */
            homeMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#homeworkmenu_dr").animate({width: 'toggle'},150);
                },
                
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from Notes)
                */
            notesMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#notesmenu_dr").animate({width: 'toggle'},150);
                },
                
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from projects)
                */
            projectsMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#projectsmenu_dr").animate({width: 'toggle'},150);
                },
                
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from lecture)
                */
            lectureMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#lecturemenu_dr").animate({width: 'toggle'},150);
                },
                
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from reference)
                */
            referenceMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#referencemenu_dr").animate({width: 'toggle'},150);
                },
                
                  /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from tutorial)
                */
            tutorialMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#tutorialmenu_dr").animate({width: 'toggle'},150);
                },
                
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from 'EdTech tool')
                */
            edtechMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#edtechmenu_dr").animate({width: 'toggle'},150);
                },
                
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from 'Amusement')
                */
            amusementMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#amusementmenu_dr").animate({width: 'toggle'},150);
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from googledocs)
                */
            showFileForm:function(eventName){
                eventName.preventDefault();
                $("#childtwo_two_dr").find('ul').hide(200);
                $("#dooclinkchild_dr").animate({width: 'toggle'},130);
                //select box for stream
                var i='';
                var optioncontent=''; 
                $.ajax({
                    type : 'GET',
                    url : BS.allStreamsForAUser,
                    dataType : "json",
                success : function(options) {
                    optioncontent+='<option>Save to Class</option>'
                    _.each(options, function(option) {
                    optioncontent+= '<option value="'+option.id.id+'">'+option.streamName+'</option>';
                    i++;
                        });                      	  
                    $('#doc-class-list-computer').html(optioncontent); 
                    }		  
                });          
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from googledocs)
                */
            classdocFileForm:function(eventName){
                eventName.preventDefault();
                console.log($(eventName.target).next().attr('class'))
                $(".childone_two_dr").find('ul').hide(200);
                $(".childone_three_dr").find('ul').hide(200);
            //  $(".classdocchild_dr").animate({width: 'toggle'},130);
                $(eventName.target).next().animate({width: 'toggle'},130);
                //select box for stream
                var i='';
                var optioncontent=''; 
                $.ajax({
                    type : 'GET',
                    url : BS.allStreamsForAUser,
                    dataType : "json",
                success : function(options) {
                    optioncontent+='<option>Save to Class</option>'
                    _.each(options, function(option) {
                    optioncontent+= '<option value="'+option.id.id+'">'+option.streamName+'</option>';
                    i++;
                    });                     
                    console.log(optioncontent);
                    $('.doc-class-list-computer').html(optioncontent); 
                    }										  
                    });         
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from googledocs)
                */
            googleDocs:function(eventName){
                eventName.preventDefault();
                $(".childone_one_dr").find('ul').hide(200);
                $(".childone_two_dr").find('ul').hide(200);
//                $("#googledocschild_dr").animate({width: 'toggle'},130);
                $(eventName.target).next().animate({width: 'toggle'},130); 
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from Import from link )
                */
            importFromLink:function(eventName){
                eventName.preventDefault();
//                $("#frmlinkchild_dr").animate({width: 'toggle'},150);
                $(eventName.target).next().animate({width: 'toggle'},130);
                var i='';
                var content=''; 
                $.ajax({
                    type : 'GET',
                    url : BS.allStreamsForAUser,
                    dataType : "json",
                success : function(options) {                          
                    content+='<option>Save to Class</option>'
                    _.each(options, function(option) {
                    content+= '<option value="'+option.id.id+'">'+option.streamName+'</option>';
                    i++;
                    });
                    $('#doc-class-list').html(content); 
                    }		  
                });
                },
               
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from video)
                */
           classdocMenuList:function(eventName){
                eventName.preventDefault();              
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#childeleven_dr").find('ul').hide(200);
                $("#classdocmenu_dr").animate({width: 'toggle'},130);
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from youtube)
                */
            vialinkMenu:function(eventName){
                eventName.preventDefault();
                $(".childone_one_dr").find('ul').hide(200);
                $(".childone_three_dr").find('ul').hide(200);
//                $("#vialinkchild_dr").animate({width: 'toggle'},130);
                  $(eventName.target).next().animate({width: 'toggle'},130);
                var i='';
                var content=''; 
                $.ajax({
                    type : 'GET',
                    url : BS.allStreamsForAUser,
                    dataType : "json",
                success : function(options) {
                    content+='<option>Save to Class</option>'
                    _.each(options, function(option) {
                    content+= '<option>'+option.streamName+'</option>';
                    i++;
                    });
                    content+='<option>Profile</option>'
                           +'<option>My Docs</option>';
                    $('#link-class-list').html(content);
                    }		  
		 });
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from youtube and upload video)
                */
            vialinkUpload:function(eventName){
                eventName.preventDefault();
                $("#dropdownnew").find('ul').hide(250); 
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from audio)
                */
        
            audioMenuList:function(eventName){
                eventName.preventDefault();
    //            $("#childone_dr").find('ul').hide(200);
    //            $("#childtwo_dr").find('ul').hide(200);
    //            $("#childthree_dr").find('ul').hide(200);
    //            $("#childfive_dr").find('ul').hide(200);
    //            $("#audiomenu_dr").animate({width: 'toggle'},150);
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from audio vialink)
                */
            audioVialink:function(eventName){
                eventName.preventDefault();
                $("#vialinkchild_dr").animate({width: 'toggle'},350); 
                var i='';
                var content=''; 
                $.ajax({
                    type : 'GET',
                    url : BS.allStreamsForAUser,
                    dataType : "json",
                success : function(options) {
                    content+='<option>Save to Class</option>'
                    _.each(options, function(option) {
                    content+= '<option>'+option.streamName+'</option>';
                    i++;
                    });
                    content+='<option>Profile</option>'
                    +'<option>My Docs</option>';
                    $('#audio-class-list').html(content); 
                    }	  
		 });
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (upload button to upload audio)
                */
            audioUpload:function(eventName){
                eventName.preventDefault();
                $("#dropdownnew").find('ul').hide(200); 
                },
    
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from public)
                *
                */
            publicMenuList:function(eventName){
                eventName.preventDefault();
                $("#childone_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#childthree_dr").find('ul').hide(200);
                $("#childfour_dr").find('ul').hide(200);
                $("#childfive_dr").find('ul').hide(200);
                $("#childsix_dr").find('ul').hide(200);
                $("#childseven_dr").find('ul').hide(200);
                $("#childeight_dr").find('ul').hide(200);
                $("#childnine_dr").find('ul').hide(200);
                $("#childten_dr").find('ul').hide(200);
                $("#publicmenu_dr").animate({width: 'toggle'},150);
                },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from presentation vialink)
                *
                */
            presentationVialink:function(eventName){
                eventName.preventDefault();
                $("#presvialinkchild_dr").animate({width: 'toggle'},350);
                var i='';
                var content=''; 
                $.ajax({
                    type : 'GET',
                    url : BS.allStreamsForAUser,
                    dataType : "json",
                success : function(options) {
                    content+='<option>Save to Class</option>'
                    _.each(options, function(option) {
                    content+= '<option>'+option.streamName+'</option>';
                    i++;
                    });
                    content+='<option>Profile</option>'
                        +'<option>My Docs</option>';
                        $('#presentation-class-list').html(content); 
                        }	  
                    });
                    },
        
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (upload button to upload presentation)
                *
                */
            presentationUpload:function(eventName){
                eventName.preventDefault();
                $("#dropdownnew").find('ul').hide(250); 
                },
    
                /**
                * For uploadmedia menu  (dropdown menu)
                *  for slide up
                */
            uploadMediaup :function(eventName){
                eventName.preventDefault();
                if(!$('.fixingmenu_dr').is(":visible") ) 
                $("#uploadmediachild_dr").slideUp(50); 
                },

                /*
                * NEW THEME-Save docs from My computer
                */
            saveMyFile: function(eventName){
                eventName.preventDefault();
                var self = this;
                var status = true;
                var message ='';
                var streamId = $(".doc-class-list-computer").val();
                
                //get message access private ? / public ?
                var docAccess;
                var access =  $('#id-private').attr('checked');
                if(access == "checked")
                {
                	docAccess = "PrivateToSchool";
                }
                else
                {
                	docAccess = "PrivateToClass";
                }
                                console.log(docAccess);

                var data;
                data = new FormData();
                data.append('streamId', streamId);
                data.append('docAccess',docAccess);
                data.append('docData', this.image);  
                data.append('docDescription',message);
                document.getElementById('loader-message').innerHTML="<img src='images/loading.gif'>";
                
                console.log("streamId -"+streamId+","+"docAccess - "+docAccess+","+"message -"+message)
                
                /* post profile page details */
                $.ajax({
                    type: 'POST',
                    data: data,
                    url: BS.uploaddocFrmComputer,
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType : "json",
                    success: function(data){
                        if(data!== " ") {
                        document.getElementById('loader-message').innerHTML = data.message;
                        self.docsList();
                        self.docFromComputer();
//                        self.audio();
                        self.presentation();
                        self.pdffiles();  
                        $("#dooclinkchild_dr").hide(200);
                        }
                    }
                    }); 
                },
         
                /**
                * display profile photo
                */ 
            displayImage:function (e) {
                var self = this;;
                file = e.target.files[0];
                var reader = new FileReader();      
        	 /* capture the file informations */
                reader.onload = (function(f){         	 
                self.image = file;          	
                })(file);          
                // read the image file as data URL
                reader.readAsDataURL(file);        
                },
    
            hidePopUpBlock: function(){
                $("#dooclinkchild_dr").find('ul').hide(100);
                $("#docsmenu_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#uploadmediachild_dr").find('ul').hide(200);
                }
                
});

