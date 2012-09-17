BS.FilesMediaView = Backbone.View.extend({

	events: {
                "click a#file-type" : "showFilesTypes",
                "click ul.file-type li a" : "hideList",
                "click '.nav a" : "addActive",
                "click #gdoc_uploadbutton" : "uploadFile",
                "mouseenter #uploadmedia_dr":"uploadMediadwn",
                "mouseleave #dropdownnew":"uploadMediaup",
                "click #links_dr":"linksMenuList",
                "click #links_uploadbutton":"linkupload",
                "click #docs_dr":"docsMenuList",               
                "click #googledocs_dr":"googleDocs",
                "click #importfrmlink_dr": "importFromLink",                
                "click #video_dr":"videoMenuList",
                "click #youtube_dr":"youtubeMenu",
                "click #video_uploadbutton":"videoUpload",
                "click #audio_dr":"audioMenuList",               
                "click #vialink_dr":"audioVialink",
                "click #audio_uploadbutton":"audioUpload",
                "click #presentations_dr":"presentationMenuList",
                "click #presvialink_dr":"presentationVialink",
                "click #press_uploadbutton":"presentationUpload"
//              "click #profile-images":"listProfileImages",
//              "click .google_doc" : "showDocPopup",
//              "click .filter-options li a" : "filterDocs"
 
	      
	 },
	
    initialize:function () {       
     	 	
//        this.docsList();   
        
        console.log('Initializing Files and Media  View');
        
        this.source = $("#tpl-files-media").html();
        this.template = Handlebars.compile(this.source);
	    this.pictres();	
        this.videos();        
     //   this.template= _.template($("#tpl-files-media").html());

        
    },

    render:function (eventName) {
        $(this.el).html(this.template);
        return this;
    },
    
    /**
     * show file types
     */
    showFilesTypes :function(eventName){
    	
    	eventName.preventDefault();
    	$('.file-type').slideDown();
    	
    },
    
    /**
     * hide file types
     */
    hideList : function(eventName){
    	
    	eventName.preventDefault();
    	$('.file-type').slideUp();
    	
    },
    //TODO
    addActive : function(eventName){
		 var id = eventName.target;
		 var $this = $(id);
		console.log( $this);
	     if (!$this.is('.dropdown-toggle')) {
	         $this
	             .closest('ul')
	             .find('li').removeClass('active').end()
	             .end()
	             .closest('li').addClass('active');
	     }
	 },
         
      /*
        * Author:Cuckoo Anna on 09July2012
        * For Uploading docs
        * docType can be one of "GoogleDocs", "YoutubeVideo", "Other".
        * docAccess can be one of "Private", "Public", "Restricted", "Stream".
      */  
     uploadFile : function()
     {
        /* post the documents details */
       
         var documentModel = new BS.Document();
         documentModel.set({
                docName : $("#gdoc-name").val(),
                docURL : $("#gdoc-url").val(),
                docAccess: 'Public',
                docType: 'GoogleDocs'
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
                                //self.docsList(); 
                            }
                        }           
            });
       $("#dropdownnew").find('ul').hide(250); 
        },
      
        docsList : function()
        {       
            var i = 1;
            var self = this;
            BS.user.fetch({ success:function(e) {

                /* get profile images for user */
              $.ajax({
                        type : 'POST',
                        url :  BS.getAllDocs,
                        data : {
                           'userId': e.attributes.id.id
                                },
                        dataType : "json",
                        success : function(docs) {
                              _.each(docs, function(doc) {
                               console.log(docs.name+datVal); 
                        var datVal =  self.formatDateVal(doc.creationDate);
                        var content = '<div class="image-wrapper hovereffect google_doc" id="'+doc.id.id+'"><input type="hidden" id="id-'+doc.id.id+'" value="'+doc.url+'"><div class="comment-wrapper comment-wrapper2"><a href="#" class="tag-icon" data-original-title="Search by Users"></a><a href="#" class="hand-icon"></a><a href="#" class="message-icon"></a><a href="#" class="share-icon"></a></div><h4>'+doc.name+'</h4><p>The Power of The Platform Behance Network Join The Leading Platform For </p><h5> Title & Description</h5><span>State</span><span class="date">'+datVal+'</span> </div><div class="comment-wrapper comment-wrapper1"> <a class="common-icon link" href="#"><span class="right-arrow"></span></a><ul class="comment-list"><li><a class="eye-icon" href="#">87</a></li><li><a class="hand-icon" href="#">5</a></li><li><a class="message-icon" href="#">10</a></li></ul></div>'; 
                        $('#file-docs-'+i).html(content);                     
                        i++;
                        });
                        }
               });

            }});

           // $('#content').html(BS.listDocsView.el);
        },
        
        
        /*
         *function to show pictures in filesmediaview
         */
        
        
         pictres : function()
        {       
            var self = this;
            var arraypictures = new Array();
            var content='';
            var coverpicture;           
            BS.user.fetch({ success:function(e) {
                /* get images for user */
              $.ajax({
                        type : 'GET',
                        url :  BS.allProfileImages,
                        data : {
                                'userId': e.attributes.id.id
                                },
                        dataType : "json",
                        success : function(docs) {
                            if(docs.length != 0)
                            {
                                arraypictures=docs;
                                coverpicture=arraypictures[arraypictures.length-1];
                                content= '<div class="image-wrapper1"><a id="profile-images" href="#imagelist"><img src="'+coverpicture+'"></a>'
                                          +'<div class="comment-wrapper comment-wrapper1"> <a class="common-icon camera" href="#"><span class="right-arrow"></span></a>'
                                           +'<ul class="comment-list">'
                                           +'<li><a class="eye-icon" href="#">87</a></li>'
                                           +'<li><a class="hand-icon" href="#">5</a></li>'
                                           +'<li><a class="message-icon" href="#">10</a></li>'
                                           +'</ul>'
                                           +'</div>';
                                 $('#coverimage').html(content);           
                            }
                        }
               });

            }});

           // $('#content').html(BS.listDocsView.el);
        },
        
        /*
         *function to show pictures in filesmediaview
         */
        videos:function(){
            var self = this;
            var arrayvideos = new Array();
            var content='';
            var coverpicture; 
            BS.user.fetch({ success:function(e) {
                /* get videos for user */
              $.ajax({
                        type : 'GET',
                        url : BS.allProfileVideos,
                        data : {
                           'userId': e.attributes.id.id
                                },
                        dataType : "json",

                        success : function(docs) {                          
                            if(docs.length != 0)
                            {
                                arraypictures=docs;
                               coverpicture=arraypictures[arraypictures.length-1];
                                content= '<div class="image-wrapper"><a id="profile-videos" href="#videos"><img src="images/image2.jpg"></a>'
                                            +'<div class="comment-wrapper comment-wrapper1"> <a class="common-icon video" href="#"><span class="right-arrow"></span></a>'
                                            +'<ul class="comment-list">'
                                            +'<li><a class="eye-icon" href="#">87</a></li>'
                                            +'<li><a class="hand-icon" href="#">5</a></li>'
                                            +'<li><a class="message-icon" href="#">10</a></li></ul></div>';
                                 $('#covervideo').html(content);           
                            }
                        }
               });

            }});
        },
        
                
        /*
         * Format date and returns 
         */
        formatDateVal: function(dateVal)
        {
            var m_names = new Array("January", "February", "March", 
            "April", "May", "June", "July", "August", "September", 
            "October", "November", "December");
                            var d = new Date(dateVal);
                            var curr_date = d.getDate();
                            var curr_month = d.getMonth() + 1; //Months are zero based
                            var curr_year = d.getFullYear();
                           return curr_date + " " + m_names[curr_month] + ", " + curr_year;
        },
        
        /**
         * 
         * Function for uploadmedia 
         *  (slide down menu)
         * 
         */
        uploadMediadwn :function(eventName){
            eventName.preventDefault();
            if(!$('#uploadmediachild_dr').is(":visible") ) 
            $("#uploadmediachild_dr").show("slide", { direction: "up" }, 50);
        },
        
        /* Function for uploadmedia 
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
                             _.each(options, function(option) {
                              content+= '<option>'+option.streamName+'</option>';
                              i++;
                              });
                              content+='<option>Enter From Catagory</option>'              
                              $('#linkselect_dr').html(content); 
                              }
					
					  
		 });
                 
            },
        
        /*
         * Function for uploadmedia 
         * (linksupload button)
         *
         */
        linkupload: function(eventName){
            eventName.preventDefault();
            $("#dropdownnew").find('ul').hide(250); 
        },
        
        /*
         * Function for uploadmedia 
         * (childmenu from papers and docs)
         */
        docsMenuList:function(eventName){
            eventName.preventDefault();
            $("#childone_dr").find('ul').hide(100);
            $("#childthree_dr").find('ul').hide(200);
            $("#childfour_dr").find('ul').hide(200);
            $("#childfive_dr").find('ul').hide(200);
            $("#docsmenu_dr").animate({width: 'toggle'},150);
        },
        
        /*
         * Function for uploadmedia 
         * (childmenu from googledocs)
         */
         googleDocs:function(eventName){
            eventName.preventDefault();
            $("#googledocschild_dr").animate({width: 'toggle'},130);
        },
        
        /*
         * Function for uploadmedia 
         * (childmenu from Import from link )
         */
        importFromLink:function(eventName){
            eventName.preventDefault();
            $("#frmlinkchild_dr").animate({width: 'toggle'},150);
            var i='';
            var content=''; 
            $.ajax({
			type : 'GET',
			url : BS.allStreamsForAUser,
			dataType : "json",
                        success : function(options) {
                             _.each(options, function(option) {
                              content+= '<option>'+option.streamName+'</option>';
                              console.log(option.streamName);
                              i++;
                              });
                              content+='<option class="enterfromcatgry">Enter From Catagory</option>'
                              $('#vialinkselect_dr').html(content); 
                              }
					
					  
		 });
            
        },
               
         /*
         *Function for uploadmedia 
         * (childmenu from video)
         */
        videoMenuList:function(eventName){
            eventName.preventDefault();
            $("#childone_dr").find('ul').hide(200);
            $("#childtwo_dr").find('ul').hide(200);
            $("#childfour_dr").find('ul').hide(200);
            $("#childfive_dr").find('ul').hide(200);
            $("#videomenu_dr").animate({width: 'toggle'},130);
        },
        
         /*
         *Function for uploadmedia 
         * (childmenu from youtube)
         */
        youtubeMenu:function(eventName){
            eventName.preventDefault();
            $("#youtubechild_dr").animate({width: 'toggle'},350);
            var i='';
            var content=''; 
            $.ajax({
			type : 'GET',
			url : BS.allStreamsForAUser,
			dataType : "json",
			success : function(options) {
                            _.each(options, function(option) {
                             content+= '<option>'+option.streamName+'</option>';
                             i++;
                             });
                            content+='<option class="enterfromcatgry">Enter From Catagory</option>'
                            $('#videoselect_dr').html(content);
                                }		  
		 });
        },
        
        /*
         *Function for uploadmedia 
         * (childmenu from youtube and upload video)
         */
        videoUpload:function(eventName){
            eventName.preventDefault();
            $("#dropdownnew").find('ul').hide(250); 
        },
        
        /*
         *Function for uploadmedia 
         * (childmenu from audio)
         */
        
        audioMenuList:function(eventName){
            eventName.preventDefault();
            $("#childone_dr").find('ul').hide(200);
            $("#childtwo_dr").find('ul').hide(200);
            $("#childthree_dr").find('ul').hide(200);
            $("#childfive_dr").find('ul').hide(200);
            $("#audiomenu_dr").animate({width: 'toggle'},150);
        },
        
        /*
         *Function for uploadmedia 
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
                            _.each(options, function(option) {
                            content+= '<option>'+option.streamName+'</option>';
                             i++;
                              });
                              content+='<option class="enterfromcatgry">Enter From Catagory</option>'
                              $('#audioselect_dr').html(content); 
                              }	  
		 });
        },
        
         /*
         * Function for uploadmedia 
         * (upload button to upload audio)
         */
        audioUpload:function(eventName){
            eventName.preventDefault();
            $("#dropdownnew").find('ul').hide(200); 
        },
    
        /*
         * Function for uploadmedia 
         * (childmenu from presentation)
         *
         */
        presentationMenuList:function(eventName){
            eventName.preventDefault();
            $("#childone_dr").find('ul').hide(200);
            $("#childtwo_dr").find('ul').hide(200);
            $("#childfour_dr").find('ul').hide(200);
            $("#childthree_dr").find('ul').hide(200);
            $("#presentationmenu_dr").animate({width: 'toggle'},150);
        },
        
         /*
         * Function for uploadmedia 
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
                              _.each(options, function(option) {
                              content+= '<option>'+option.streamName+'</option>';
                              i++;
                              });
                              content+='<option class="enterfromcatgry">Enter From Catagory</option>'
                              $('#presentationselect_dr').html(content); 
                              }	  
		 });
        },
        
         /*
         * Function for uploadmedia 
         * (upload button to upload presentation)
         *
         */
        presentationUpload:function(eventName){
            eventName.preventDefault();
            $("#dropdownnew").find('ul').hide(250); 
        },
    
        /**
         * For uploadmedia menu
         *  for slide up
         */
        uploadMediaup :function(eventName){
             eventName.preventDefault();
             if(!$('.fixingmenu_dr').is(":visible") ) 
             $("#uploadmediachild_dr").hide("slide", { direction: "up" }, 250); 
        },
        
        /**
         * Edited By Aswathy @TODO
         * For Doc popups
         */
        showDocPopup :function(eventName){
 
        	var docId = eventName.currentTarget.id;
        	var docUrl = $('input#id-'+docId).val();
    		newwindow=window.open(docUrl,'','height=550,width=1100,top=100,left=250');
        	 
        },
        /**
         * filter docs.. and prevent default action
         */
        filterDocs :function (eventName){
        	 eventName.preventDefault();
        }
        
});

