define(['pageView',
        'view/filesOverView', 
        'view/imageListView',
        'view/videoListView',
        'view/documentListView',
        'view/pdfListView',
        'view/presentationListView',
        'view/googleDocListView',
        'model/stream',
        'text!templates/linkdropdown.tpl',
        'text!templates/privateToList.tpl',
        ],function(PageView,FilesOverView, ImageListView, VideoListView, DocumentListView,pdfListView,PresentationListView, GoogleDocListView,StreamModel, Linkdropdown,PrivateToListTpl){
	
	var BrowseMediaView;
	BrowseMediaView = PageView.extend({
		objName: 'BrowseMediaView',
		events:{
			"click '.nav a" : "addActive",
			"click #uploadmedia_dr":"preventDefault",
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
      "click #uploadmediachild_dr li" :"removeOptions",
      'change .dropdownselect' :'dropdownselect',
      "click .then-by li a" : "filterDocs",
      "click #view-by-list" : "selectViewByAll",
      "click #view-by-date-list" : "selectViewByDate",
      "click #view-files-byrock-list" : "selectViewByRock",
      "click #category-list li" :"sortBycategory",
      "click .browse-right a" :"selectViewStyle",

      'click .upload-from-computer': "uploadFileFromComputer",
      'change #doc-from-computer' :'fetchDocument', 
		},

  
		
		onAfterInit: function(){	
			// this.data.reset();
      var self = this;
      streams = new StreamModel();
      streams.fetch({
        success : function(data, response) {

          var listTemplate = Handlebars.compile(PrivateToListTpl);
          $('#by-class-list').html(listTemplate(response));

          /* added stream list to dropdown list */
          self.streams='';
          _.each(response, function(data) {
            
             self.streams+='<option value="'+data.stream.id.id+'">'+data.stream.streamName+'</option>';
          });
        
          $('.doc-class-list-computer').html(self.streams);
          $('#link-class-list').prepend(self.streams);
          $('#doc-class-list').prepend(self.streams);

         
        }

      });
    
		},


    /**
    * fetch uploaded file
    */ 
    fetchDocument:function (e) {
        var self = this;;
        file = e.target.files[0];

        var reader = new FileReader();      
        /* capture the file informations */
        reader.onload = (function(f){            
          self.file = file;            
        })(file);          
        // read the image file as data URL
        reader.readAsDataURL(file);        
    },
		
		
		addActive : function(eventName){
			var id = eventName.target;
			var $this = $(id);		
		    if (!$this.is('.dropdown-toggle')) {
		        $this
		            .closest('ul')
		            .find('li').removeClass('active').end()
		            .end()
		            .closest('li').addClass('active');
		    }
		
		},
		
		preventDefault : function(eventName){
            eventName.preventDefault();
    	    $("#uploadmediachild_dr").slideUp(50); 
        },
        
		 /**        
         * Function for uploadmedia 
         *  (slide down menu)        
         */
	 
		uploadMediadwn: function(eventName){
			eventName.preventDefault();
			if(!$('#uploadmediachild_dr').is(":visible") )       
	        $("#uploadmediachild_dr").slideDown();         
		},
		
		uploadMediaup: function(eventName){
			eventName.preventDefault();
			if(!$('.fixingmenu_dr').is(":visible") ) 
	        $("#uploadmediachild_dr").slideUp(50); 
 			
			
		},
		classdocMenuList:function(eventName){
            eventName.preventDefault();    
            $('.link-dropdwn').html("");  
            // $('.dropdwnmycomputer').html(""); 
            // $('.dropdwnmycomputer').css("display","none");
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
            
        classdocFileForm:function(eventName){
            eventName.preventDefault();            
            $(".childone_two_dr").find('ul').hide(200);
            $(".childone_three_dr").find('ul').hide(200);
            $(".classdocchild_dr").animate({width: 'toggle'},130);

            
        },
        
        vialinkMenu:function(eventName){
            eventName.preventDefault(); 
            // $('.dropdwnmycomputer').html(""); 
            // $('.dropdwnmycomputer').css("display","none");
            $(".childone_one_dr").find('ul').hide(200);
            $(".childone_three_dr").find('ul').hide(200);
            $(eventName.target).next().animate({width: 'toggle'},130);
          /*  var i='';
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
	 });  */
        },
            
            /**
             * NEW THEME-Function for uploadmedia (dropdown menu)
             * (childmenu from youtube and upload video)
             */
         vialinkUpload:function(eventName){
             eventName.preventDefault();
             $("#dropdownnew").find('ul').hide(250); 
         },    
             
             
             /**
              * NEW THEME-Function for uploadmedia (dropdown menu)
              * (childmenu from googledocs)
              */
          googleDocs:function(eventName){
              eventName.preventDefault();
              // $('.dropdwnmycomputer').html(""); 
              // $('.dropdwnmycomputer').css("display","none");
              $(".childone_one_dr").find('ul').hide(200);
              $(".childone_two_dr").find('ul').hide(200);
              $(eventName.target).next().animate({width: 'toggle'},130); 
          },
              
              /**
               * NEW THEME-Function for uploadmedia (dropdown menu)
               * (childmenu from papers and docs)
               */
	      assignmentMenuList:function(eventName){
	          eventName.preventDefault();
	          $('.link-dropdwn').html(""); 
	          // $('.dropdwnmycomputer').html(""); 
	          // $('.dropdwnmycomputer').css("display","none");
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
		
	      
          /**
           * NEW THEME-Function for uploadmedia (dropdown menu)
           * (childmenu from Import from link )
           */
       importFromLink:function(eventName){
          eventName.preventDefault();

          var compiledTemplate = Handlebars.compile(Linkdropdown);
          $(eventName.target).next().html(compiledTemplate);
          $(eventName.target).next().animate({width: 'toggle'},130);
          $('#doc-class-list').prepend(this.streams);
           var i='';
           var content=''; 
           // $('.link-dropdwn').html("");   
          /* var source = $("#tpl-lindropdown").html();
           var template = Handlebars.compile(source);				    
           $(eventName.target).next().append(template()); 
           $.ajax({
               type : 'GET',
               url : BS.allStreamsForAUser,
               dataType : "json",
           success : function(options) {                          
               content+='<option>Save to Class</option>'
               _.each(options, function(option) {
               content+= '<option value="'+option._1.id.id+'">'+option._1.streamName+'</option>';
               i++;
               });
               $('#doc-class-list').html(content); 
               }		  
           });  */
        },
           
           /**
            * NEW THEME-Function for uploadmedia (dropdown menu)
            * (childmenu from homework)
            */
        homeMenuList:function(eventName){
            eventName.preventDefault();
            $('.link-dropdwn').html("");  
            // $('.dropdwnmycomputer').html(""); 
            // $('.dropdwnmycomputer').css("display","none");
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
        
        
        /**
         * NEW THEME-Function for uploadmedia (dropdown menu)
         * (childmenu from Notes)
         */
	     notesMenuList:function(eventName){
	         eventName.preventDefault();
	         $('.link-dropdwn').html("");
	         // $('.dropdwnmycomputer').html(""); 
	         // $('.dropdwnmycomputer').css("display","none");
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
         
         /**
          * NEW THEME-Function for uploadmedia (dropdown menu)
          * (childmenu from projects)
          */
	     projectsMenuList:function(eventName){
	         eventName.preventDefault();
	         $('.link-dropdwn').html(""); 
	         // $('.dropdwnmycomputer').html(""); 
	         // $('.dropdwnmycomputer').css("display","none");
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
//	         this.streamid="";
	            
	     },
	     
         /**
          * NEW THEME-Function for uploadmedia (dropdown menu)
          * (childmenu from lecture)
          */
	     lectureMenuList:function(eventName){
	         eventName.preventDefault();
	         $('.link-dropdwn').html(""); 

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
	     
         /**
          * NEW THEME-Function for uploadmedia (dropdown menu)
          * (childmenu from reference)
          */
	      referenceMenuList:function(eventName){
	          eventName.preventDefault();
	          $('.link-dropdwn').html(""); 
	          // $('.dropdwnmycomputer').html(""); 
	          // $('.dropdwnmycomputer').css("display","none");
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
//	           this.streamid="";
	            
	          },
	          
              /**
               * NEW THEME-Function for uploadmedia (dropdown menu)
               * (childmenu from tutorial)
               */
          tutorialMenuList:function(eventName){
              eventName.preventDefault();
              $('.link-dropdwn').html("");
              // $('.dropdwnmycomputer').html(""); 
              // $('.dropdwnmycomputer').css("display","none");
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
//               this.streamid="";
                
          },
          
          /**
           * NEW THEME-Function for uploadmedia (dropdown menu)
           * (childmenu from 'EdTech tool')
           */
          edtechMenuList:function(eventName){
        	  eventName.preventDefault();
        	  $('.link-dropdwn').html("");  
        	  // $('.dropdwnmycomputer').html(""); 
        	  // $('.dropdwnmycomputer').css("display","none");
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
//        	  this.streamid="";
            
          },
          
          
          /**
           * NEW THEME-Function for uploadmedia (dropdown menu)
           * (childmenu from 'Amusement')
           */
          amusementMenuList:function(eventName){
        	  eventName.preventDefault();
	          $('.link-dropdwn').html(""); 
	          // $('.dropdwnmycomputer').html(""); 
	          // $('.dropdwnmycomputer').css("display","none");
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
//	            this.streamid="";
             
          },
           
           /**
            * NEW THEME-Function for uploadmedia (dropdown menu)
            * (childmenu from public)
            *
            */
          publicMenuList:function(eventName){
        	 eventName.preventDefault();
        	 $('.link-dropdwn').html(""); 
        	 // $('.dropdwnmycomputer').html("");
        	 // $('.dropdwnmycomputer').css("display","none");
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
//             this.streamid="";
             
            },
            /**
             * NEW THEME - hide visual drop down list
             */
            
          removeOptions:function(eventName){
             eventName.stopPropagation();
          },
                
          dropdownselect :function(eventName){
             eventName.preventDefault();
             this.streamid=$(eventName.target).val();
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
          selectViewByAll: function(eventName){
             eventName.preventDefault();
             $('#view-by-select').text($(eventName.target).text());
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
          
          /**
           * NEW THEME - select files view style
           */
          selectViewStyle: function(eventName){
             eventName.preventDefault();
             $('.browse-right a.activebtn').removeClass('activebtn');
             $(eventName.target).parents('a').addClass('activebtn');
          },
           
           
          /**
          * NEW THEME - view files by date 
          */
          selectViewByDate: function(eventName){
        	 eventName.preventDefault();
             $('#view-by-date-select').text($(eventName.target).text());
          }, 

          /**
          * upload file from computer
          */
          uploadFileFromComputer: function(eventName){
            eventName.preventDefault();
            var self = this;
            var status = true;
            var message ='';

            var streamId =  $('.doc-class-list-computer :selected').val();
            
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
            
            if(streamId){

              if(self.file){

                  this.bar = $('.bar');        
                  this.bar.width('');
                  this.bar.text("");                 
                  $('#progressbar').show();        //progress bar 
                  $('.progress-container').show();    
                  this.progress = setInterval(function() {
                      this.bar = $('.bar');                     
                      if (this.bar.width()>= 194) {
                          clearInterval(this.progress);
                      } 
                      else {
                          this.bar.width( this.bar.width()+8);
                      }
                      this.bar.text( this.bar.width()/2 + "%");                       
                  }, 800);

                  var data;
                  data = new FormData();
                  data.append('docDescription',message);
                  data.append('docAccess' ,docAccess);
                  data.append('docData', self.file);  
                  data.append('streamId', streamId); 


                  /* post profile page details */
                  $.ajax({
                    type: 'POST',
                    data: data,
                    url: '/uploadDocumentFromDisk',
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType : "json",
                    success: function(data){

                        // set progress bar as 100 %
                        self.bar = $('.bar');  
                        
                        self.bar.width(200);
                        self.bar.text("100%");
                        clearInterval(self.progress);

                        self.file = "";
                        $('.progress-container').hide();

                        if($('#grid').attr('name') == 'overPage'){
                            filesOverView = new FilesOverView({el: $('#grid')});
                            filesOverView.data.url = '/recentMedia';
                        }
                        if($('#grid').attr('name') == 'imageList'){

                            imageListView = new ImageListView({el: $('#grid')});
                            imageListView.data.url = '/allPicsForAuser';
                        }
                        if($('#grid').attr('name') == 'videoList'){
                          
                            videoListView = new VideoListView({el: $('#grid')});
                            videoListView.data.url = '/allVideosForAuser';
                        }
                        if($('#grid').attr('name') == 'documentList'){
                          
                            documentListView = new DocumentListView({el: $('#grid')});
                            documentListView.data.url = '/allDOCSFilesForAUser';
                        }

                        if($('#grid').attr('name') == 'pdfList'){
                          
                            pdfListView = new PdfListView({el: $('#grid')});
                            pdfListView.data.url = '/allPDFFilesForAUser';
                        }

                        if($('#grid').attr('name') == 'presentationList'){
                          
                            presentationListView = new PresentationListView({el: $('#grid')});
                            presentationListView.data.url = '/allPPTFilesForAUser';
                        }
                        if($('#grid').attr('name') == 'googleDocList'){
                          
                            googleDocListView = new GoogleDocListView({el: $('#grid')});
                            googleDocListView.data.url = '/getAllGoogleDocs';
                        }

                        self.hidePopUpBlock();

                    }
                  });


              }
            }

   
          },

          hidePopUpBlock: function(){
            $('#uploadmediachild_dr').find('li').find('ul').hide(200);
            $('#uploadmediachild_dr').hide(200);
          },
           
	});
	return BrowseMediaView
});