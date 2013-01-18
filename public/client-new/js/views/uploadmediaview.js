/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/***
	 * BeamStream
	 *
	 * Author                : cuckooanna .P.R (cuckooanna@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/November/2012
	 * Description           : Backbone view for stream Questions page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.UploadmediaView = Backbone.View.extend({
	
		events : {
                                 
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
            "click #links_dr":"linksMenuList",
            "click #links_uploadbutton":"linkupload",  
            "click #googledocs_mycomp":"showFileForm",
            "click #gdoc_uploadbutton" : "uploadFile",
                  

            "click #audio_dr":"audioMenuList",               
 //         "click #vialink_dr":"audioVialink",
            "click #audio_uploadbutton":"audioUpload",
               
            "click #presvialink_dr":"presentationVialink",
            "click #press_uploadbutton":"presentationUpload",
            "click .docfrmcomputer_uploadbutton": "saveMyFile",
            'click #docfrmcomputer_closePopup': "hidePopUpBlock", 
            'change #doc-from-computer' :'displayImage',  
                 
            "click #uploadmediachild_dr li" :"removeOptions",
            'change .dropdownselect' :'dropdownselect',
//            'change .gdoc-url' :'gdocurlonchange'
                  
                 
			 
		},
	
            initialize : function() {
                console.log('Initializinguploadmediaview');
                this.source = $("#tpl-uploadedmediaview").html();
                this.template = Handlebars.compile(this.source);
//              alert( BS.AppRouter.routes[Backbone.history.fragment] );
                this.streamid="";
                },
            render : function(eventName) {		    
                $(this.el).html(this.template);
                return this;
		},
                
                /**
                * 
                * NEW THEME-Function for uploadmedia (dropdown menu)
                *  (slide down menu)
                * 
                */
            uploadMediadwn :function(eventName){         
                eventName.preventDefault();
                console.log("new view");
                if(!$('#uploadmediachild_dr').is(":visible") )       
                $("#uploadmediachild_dr").slideDown();         
                },
                
                preventDefault : function(eventName){
                	eventName.preventDefault();
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
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from video)
                */
           classdocMenuList:function(eventName){
                eventName.preventDefault();    
                $('.link-dropdwn').html("");  
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                * (childmenu from googledocs)
                */
            classdocFileForm:function(eventName){
                eventName.preventDefault();
                console.log($(eventName.target).next().attr('class'))
                $(".childone_two_dr").find('ul').hide(200);
                $(".childone_three_dr").find('ul').hide(200);
                $(".classdocchild_dr").animate({width: 'toggle'},130);
//              $(eventName.target).next().animate({width: 'toggle'},130);
                var source = $("#tpl-mycomputerdropdown").html();
                var template = Handlebars.compile(source);				    
                $(eventName.target).next().append(template()); 
            
                
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
                    optioncontent+= '<option value="'+option._1.id.id+'">'+option._1.streamName+'</option>';
                    i++;
                    });                     
                    console.log(optioncontent);
                    $('.doc-class-list-computer').html(optioncontent); 
                    }										  
                    });         
                },
                
                                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from youtube)
                */
            vialinkMenu:function(eventName){
                eventName.preventDefault(); 
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
                $(".childone_one_dr").find('ul').hide(200);
                $(".childone_three_dr").find('ul').hide(200);
//              $("#vialinkchild_dr").animate({width: 'toggle'},130);
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
                * (childmenu from googledocs)
                */
            googleDocs:function(eventName){
                eventName.preventDefault();
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
                $(".childone_one_dr").find('ul').hide(200);
                $(".childone_two_dr").find('ul').hide(200);
//                $("#googledocschild_dr").animate({width: 'toggle'},130);
                $(eventName.target).next().animate({width: 'toggle'},130); 
                },
                
                       /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from papers and docs)
                */
            assignmentMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html(""); 
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                 
                 
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
                $('.link-dropdwn').html("");   
                var source = $("#tpl-lindropdown").html();
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
                });
                },
                
                                                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from homework)
                */
            homeMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html("");  
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                 
                },
                
                                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from Notes)
                */
            notesMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html("");
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                 
                },
                
                                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from projects)
                */
            projectsMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html(""); 
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                  
                },
                
                                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from lecture)
                */
            lectureMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html(""); 
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                  
                },
                
                                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from reference)
                */
            referenceMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html(""); 
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                  
                },
                
                                  /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from tutorial)
                */
            tutorialMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html("");
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                 
                },
                
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from 'EdTech tool')
                */
            edtechMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html("");  
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                 
                },
                
                /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from 'Amusement')
                */
            amusementMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html(""); 
                $('.dropdwnmycomputer').html(""); 
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                  
                },
                
                             /*
                * NEW THEME-Function for uploadmedia (dropdown menu)
                * (childmenu from public)
                *
                */
            publicMenuList:function(eventName){
                eventName.preventDefault();
                $('.link-dropdwn').html(""); 
                $('.dropdwnmycomputer').html("");
                $('.dropdwnmycomputer').css("display","none");
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
                 this.streamid="";
                 
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
                * (upload button to upload audio)
                */
            audioUpload:function(eventName){
                eventName.preventDefault();
                $("#dropdownnew").find('ul').hide(200); 
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
                
                
                /*
                * NEW THEME-Save docs from My computer
                */
            saveMyFile: function(eventName){
                eventName.preventDefault();
                var self = this;
                var status = true;
                var message ='';
                var streamId = this.streamid;
//                console.log($(eventName.target).parent().parent().attr('id'));
                
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
                BS.bar = $('.bar');        //To set progress bar null
                BS.bar.width('');
                BS.bar.text("");                 
                $('#progressbar').show();        //progress bar 
                $('.progress-container').show();    
                BS.progress = setInterval(function() {
                    BS.bar = $('.bar');                     
                    if (BS.bar.width()== 200) {
                        clearInterval(BS.progress);
    //                  $('.progress').removeClass('active');
                        } 
                    else {
                        BS.bar.width( BS.bar.width()+8);
                        }
                    BS.bar.text( BS.bar.width()/2 + "%");                       
                    }, 800);
                var data;
                data = new FormData();
                data.append('streamId', streamId);
                data.append('docAccess',docAccess);
                data.append('docData', this.image);  
                data.append('docDescription',message);
                document.getElementById('loader-message').innerHTML="<img src='images/loading.gif'>";                       
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
                            BS.bar = $('.bar');        //progress bar
                            BS.bar.width(400);
                            BS.bar.text("100%");
                            clearInterval(BS.progress);                       
                            bootbox.alert("Uploaded Successfully.");                      
                            switch (BS.AppRouter.routes[Backbone.history.fragment])
                                {
                                case "filesMedia":
                                    $("#dooclinkchild_dr").hide(200);
    //                               BS.filesMediaView = new BS.FilesMediaView();
                                    $('.files-list').html("");                                
                                    BS.filesMediaView.pictres();	
                                    BS.filesMediaView.videos();   
                                    BS.filesMediaView.spreadsheet();                                
                                    BS.filesMediaView.docsList();
                                    BS.filesMediaView.docFromComputer();
    //                              BS.filesMediaView.audio();
                                    BS.filesMediaView.presentation();
                                    BS.filesMediaView.pdffiles();  

                                break;
                                case "googleDocs":
                                    BS.googledocsview.docsList(); 
                                break;
                                case "docsFromComputer":
                                    BS.doclistview.docsList();                                    
                                break;
                                case "imageList":
                                     BS.imagelistview.pictres();
                                break;
                                case "videoList":
                                   BS.videolistview.videolisting();
                                break;
                                case "audioList":
                                    BS.audiolistview.audio();  
                                break;
                                case "pdflistview":
                                     BS.pdflistview.pdflisting();  
                                break;
                                case "presentationList":
                                   BS.presentationview.presentation();     
                                break;
                                default:
                                    console.log("no value");
                                break;
                                }
                                $("#dooclinkchild_dr").hide(200);
                            }                        
                        else
                            {
                                 bootbox.alert("Failed.Please try again");
                            }
                            BS.bar = $('.bar');        //progress bar
                            BS.bar.width('');
                            BS.bar.text("");  
                            $('#progressbar').hide();
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
                    console.log(documentData);
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
                            bootbox.alert("Failed.Please try again");
                        else
                            {
                             bootbox.alert("Doc Uploaded Successfully.");                                
                        switch (BS.AppRouter.routes[Backbone.history.fragment])
                            {
                            case "filesMedia":
                                $("#dooclinkchild_dr").hide(200);
                                $('.files-list').html("");                                
                                BS.filesMediaView.pictres();	
                                BS.filesMediaView.videos();   
                                BS.filesMediaView.spreadsheet();                                
                                BS.filesMediaView.docsList();
                                BS.filesMediaView.docFromComputer();
//                              BS.filesMediaView.audio();
                                BS.filesMediaView.presentation();
                                BS.filesMediaView.pdffiles();  
                                break;
                            case "googleDocs":
                                 BS.googledocsview.docsList(); 
                                break;                           
                            default:
                               console.log("no value");
                                break;
                            }
                            }
                        }           
                    });
                    }
                $("#dropdownnew").find('ul').hide(250); 
                },

                hidePopUpBlock: function(){
                $("#dooclinkchild_dr").find('ul').hide(100);
                $("#docsmenu_dr").find('ul').hide(200);
                $("#childtwo_dr").find('ul').hide(200);
                $("#uploadmediachild_dr").find('ul').hide(200);
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
                }
                    
//            gdocurlonchange :function(eventName){
//                eventName.preventDefault();
//
//                        console.log("url");
//                        var streamurl=$(eventName.target).val();
//                        console.log(streamurl);
////                   
//                    }
        
                
});
