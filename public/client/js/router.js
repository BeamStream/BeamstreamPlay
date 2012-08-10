BS.AppRouter = Backbone.Router.extend({

    routes:{
    	
        "":"home",
        "login":"login",
        "recoverAccount" : "recoverAccount",
        "emailVerification": "emailVerification",
        "school":"schoolReg",
        "class":"classReg",
        "profile":"profileReg",
        "streams":"mainStream",
        "basicRegistration/token/:token/iam/:iam/emailId/:email":"basicRegistration",
        "basicRegistration":"basicRegistrationViaJanRain",
        "classStream":"classStream",
        "projectStream" : "projectStream",
        "studyStream": "studyStream",
        "groupStream": "groupStream",
        "peerStream" : "peerStream",
        "friendStream" :"friendStream",
        "filesMedia" : "filesMedia"
        
    },
    initialize :function() {
    	
    	
    	var self = this;
    	BS.idLogin = '';
        BS.user = new BS.SingleUser();
        
        /** for authentication  TODO */
//        BS.user.fetch({ success:function(e) {
//    		if(e.get('firstName') != null) { 
//				e.set('loggedin', true);
//			}
//			else { 
//				e.set('loggedin', false);				
//			}
//			  
//			this.navView = new BS.NavView({ model: BS.user });
//			$('.nav-collapse').html(this.navView.render().el);
//
//    	}},this);
		 
    	/* calculate time from 12:00AM to 11:45PM */
    	var timeValues = new Array;
  		var hours, minutes, ampm;
  		for(var i = 0; i <= 1425; i += 15){
  		        hours = Math.floor(i / 60);
  		        minutes = i % 60;
  		        if (minutes < 10){
  		            minutes = '0' + minutes; // adding leading zero
  		        }
  		        ampm = hours % 24 < 12 ? 'AM' : 'PM';
  		        hours = hours % 12;
  		        if (hours === 0){
  		            hours = 12;
  		        }
  		        var time = hours+':'+minutes+''+ampm ;
  		        timeValues.push({"time" : time});
  		 }
  		BS.times = jQuery.parseJSON(JSON.stringify(timeValues));
   
    },
 
    home: function() {
    	console.log('Here');
    	
    },

    /**
     * display login form
     */
    
    login: function() {
    	 localStorage["idLogin"]= '';
    	 
    	 $('#school-popup').children().detach(); 
    	 var self =this;
    	 BS.loginView = new BS.LoginView();
    	 BS.loginView.render();
     
    	 localStorage["idLogin"] = "login";
         $('#school-popup').html(BS.loginView.el);  
         $(".modal select:visible").selectBox();
         jQuery("#login-form").validationEngine();
         $(".checkbox").dgStyle();
         $(".signin_check").dgStyle();
         
         //get cookies
         var username= $.cookie('userName');
         var password = $.cookie('password');
         
         if(username != null && username != "" && password !=null && password != "") 
         {
        	 $('#email').val(username);
        	 $('#password').val(password);
         }
         
         /* display janRain component */
		 setTimeout(function() {
		    self.displayJanRain();
		 }, 1000);
     	
    },
   
    /**
     * recover password/Account
     */
    recoverAccount: function() {
    	 $('#school-popup').children().detach(); 
    	  
    	 BS.forgotPasswordView = new BS.ForgotPasswordView();
    	 BS.forgotPasswordView.render();
     
         $('#school-popup').html(BS.forgotPasswordView.el);  
         $(".modal select:visible").selectBox();
         jQuery("#login-form").validationEngine();
         $(".checkbox").dgStyle();
         $(".signin_check").dgStyle();
    },
    /**
     * display School Info screen
     */
    schoolReg:function () {
       
//        if(!BS.schoolView)
//        {
    		BS.schoolView = new BS.SchoolView();
        	BS.schoolView.render();
//        }
 
         $('#school-popup').html(BS.schoolView.el);  
         if(BS.schoolFromPrev)
         $('#school-name-1').val(BS.schoolFromPrev);
         $(".modal select:visible").selectBox();
         $('.modal .datepicker').datepicker();
         /* hide some fields on page load */
         $('#degree-exp-'+current).hide();
     	 $('#cal-'+current).hide();
     	 $('#other-degrees-'+current).hide();
     	 jQuery("#school-form").validationEngine();
     	
    },

    
    /**
     * display Class Info screen
     */
    classReg:function () {
    
    	BS.classView = new BS.ClassView();
    	BS.classView.render();
        $('#school-popup').html(BS.classView.el);
        $(".modal select:visible").selectBox();
        $('.modal .datepicker').datepicker();
        jQuery("#class-form").validationEngine();
       
   },
    
   /**
    * display Profile Info screen
    */
   profileReg:function () {
	    
       BS.profileView = new BS.ProfileView();
       BS.profileView.render();
       $('#school-popup').html(BS.profileView.el);  
       $('.progress-container').hide();
       $(".modal select:visible").selectBox();
       $('.modal .datepicker').datepicker();
       jQuery("#profile-form").validationEngine();
       
       //Render Janrain Invite popup
       (function() {
	    if (typeof window.janrain !== 'object') window.janrain = {};
	    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
	    if (typeof window.janrain.settings.share !== 'object') window.janrain.settings.share = {};
	    if (typeof window.janrain.settings.packages !== 'object') janrain.settings.packages = [];
	    janrain.settings.packages.push('share');
	
	    /* _______________ can edit below this line _______________ */
	
	    janrain.settings.share.message = "Testing social sharing!";
	    janrain.settings.share.title = "Social Profile";
	    janrain.settings.share.url = "www.yahoo.com";
	    janrain.settings.share.description = "Share with my network";
	
	    /* _______________ can edit above this line _______________ */
	
	    function isReady() { janrain.ready = true; };
	    if (document.addEventListener) {
	        document.addEventListener("DOMContentLoaded", isReady, false);
	    } else {
	    	
	        window.attachEvent('onload', isReady);
	    }
	
	    var e = document.createElement('script');
	    e.type = 'text/javascript';
	    e.id = 'janrainWidgets';
	
	    if (document.location.protocol === 'https:') {
	      e.src = 'https://rpxnow.com/js/lib/beamstream/widget.js';
	    } else {
	      e.src = 'http://widget-cdn.rpxnow.com/js/lib/beamstream/widget.js';
	    }
	
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(e, s);
	   
	})();
       
   },
  
   
   /**
    * display main stream page
    */
   mainStream:function () {
	   
	   BS.mainImageUrl = $('#right-photo').attr('src');
	    
	   $('#middle-content').children().detach();
	   $('nav li.active').removeClass('active');
	   $('nav li a#streamsGroups').parents('li').addClass('active');
	   var self = this;
	  
 
		   $('#school-popup').children().detach(); 
		   $('#content').children().detach();
		   
		   $('.modal').css('display','none');
		   BS.user.fetch({ success:function(e) {
			   
			   //store logged user details
		       BS.loggedUserInfo  = e;
		       localStorage["loggedUserInfo"] = e.attributes.id.id;
		       
			   BS.streamView = new BS.StreamView({ model: BS.user });
			   BS.streamView.render();
			   
			   self.onstream = true; 
	   	   
			   //get main menu
			   this.navView = new BS.NavView({ model: BS.user });
			    
			   $('.nav-collapse').html(this.navView.render().el);
			   $('nav li.active').removeClass('active');
			   $('#streamsGroups').addClass('active');
			     /* get profile images for user */
		          $.ajax({
		    			type : 'POST',
		    			url : BS.profileImage,
		    			dataType : "json",
		    			data : {
			    				 userId :  e.attributes.id.id
			    			},
		    			success : function(data) {
		    				
		    				 // default profile image
		    				 if(data.status)
		    				 {
		    					 BS.profileImageUrl = "images/placeholders/face2.png";
				    	        	 
		    				 }
		    				 else
		    				 {
		    					 BS.profileImageUrl = data;
		    				 }
		    				 $('#main-photo').attr("src",BS.profileImageUrl);
			    	         $('#right-photo').attr("src",BS.profileImageUrl);
			    	         $('#msg-photo').attr("src",BS.profileImageUrl);
		    	        	
		    			}
		    	   });
		          
		          
		          
	   	   $('.modal-backdrop').hide();
	       $('#content').html(BS.streamView.el);
	       
	       $('.page-loader').hide();
      	
	       $(".checkbox").dgStyle();
	        
	       $('.with-tooltips a, .with-tooltip').each(function() {
	           var $this = $(this);
	           var placement = $this.parent().hasClass('tooltips-bottom') ? 'bottom' : 'top';
	           $(this).tooltip({placement: placement});
	       });
	       
	       
		 }});
		   
		   
		   
		  
		 
 
       
   },
   
  
    /**
    * registration after email verification
    */
    basicRegistration: function(token,iam,email) {
	     
	   // verify the token
	   $.ajax({
			type : 'POST',
			url : BS.verifyToken,
			data : {
				token : token
                 },
			dataType : "json",
			success : function(data) {
					if (data.status == "Success") {

						if (!BS.registrationView) {
							BS.registrationView = new BS.RegistrationView();
							var mailInfo = {
									iam : iam,
									mail : email
							};
							BS.registrationView.render(mailInfo);
						}

						$('#school-popup').html(BS.registrationView.el);
						$('#jan-iam').hide();
						$(".checkbox").dgStyle();
						jQuery("#registration-form").validationEngine();
				     } else {
						alert("Token Expiredd");
					  }

				}
			});

			},

			/**
			 * basicRegistrationViaJanRain
			 */
			basicRegistrationViaJanRain : function(event) {

				$('#school-popup').children().detach();
				
				if (!BS.mediaRegistrationView) {
					BS.mediaRegistrationView = new BS.MediaRegistrationView();
					BS.mediaRegistrationView.render();
				}
                
				$('#school-popup').html(BS.mediaRegistrationView.el);
				$('#school-record').hide();
				$(".modal select:visible").selectBox();
				$(".checkbox").dgStyle();
				jQuery("#social-media-signup").validationEngine();
 
				var datas = BS.JsonFromSocialSite;
 
				if(localStorage["first-name"])
					$('#first-name').val(localStorage["first-name"]);
				if(localStorage["last-name"] != "")
				    $('#last-name').val(localStorage["last-name"]);
				if(localStorage["location"])
					$('#location').val(localStorage["location"]);
 
			},

			/**
			 * for email verification
			 */
			emailVerification : function() {
				localStorage["idLogin"]= '';
				$('#school-popup').children().detach();
				var self = this;
				if (!BS.emailView) {
					BS.emailView = new BS.verifyEmailView();
					BS.emailView.render();
					
				}
				
				localStorage["idLogin"] = "register";
				$('#school-popup').html(BS.emailView.el);
				$('#load-janRain').css("display","block");
				$(".modal select:visible").selectBox();
				$(".checkbox").dgStyle();
				$('.forgot-pass').hide();
				jQuery("#email-verify").validationEngine();
				 
				$('.janrainContent').remove();
				/* disaplay janRain component */
			    setTimeout(function() {
			    	self.displayJanRain();
				 }, 1000);
				
				
			},

			/**
			 * display class stream screen
			 */
			classStream : function() {
				$('#school-popup').children().detach();
				BS.classStreamView = new BS.ClassStreamView();
				BS.classStreamView.render();
				$('#school-popup').html(BS.classStreamView.el);

				/* get all schoolIds under a class */
				$
						.ajax({
							type : 'GET',
							url : BS.allSchoolForAUser,
							dataType : "json",
							success : function(datas) {

								var sSelect = '<select id="schools" class="small selectBox">';
								_.each(datas, function(data) {
									sSelect += '<option value ="' + data.assosiatedSchoolId.id
											+ '" > ' + data.schoolName
											+ '</option>';
								});
								sSelect += '</select>';
								$('#sShool').html(sSelect);
								$(".modal select:visible").selectBox();
							}
						});

				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();
			},

			/**
			 * display project stream screen
			 */
			projectStream : function() {

				if (!BS.projectStreamView) {
					BS.projectStreamView = new BS.ProjectStreamView();
					BS.projectStreamView.render();
				}
				$('#school-popup').html(BS.projectStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();
			},

			/**
			 * display study stream screen
			 */
			studyStream : function() {

				if (!BS.studyStreamView) {
					BS.studyStreamView = new BS.StudyStreamView();
					BS.studyStreamView.render();
				}
				$('#school-popup').html(BS.studyStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();

			},

			/**
			 * display group stream screen
			 */
			groupStream : function() {

				if (!BS.groupStreamView) {
					BS.groupStreamView = new BS.GroupStreamView();
					BS.groupStreamView.render();
				}
				$('#school-popup').html(BS.groupStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();

			},

			/**
			 * display peer stream screen
			 */
			peerStream : function() {

				if (!BS.peerStreamView) {
					BS.peerStreamView = new BS.PeerStreamView();
					BS.peerStreamView.render();
				}
				$('#school-popup').html(BS.peerStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();
			},

			/**
			 * display friend stream screen
			 */
			friendStream : function() {

				if (!BS.friendStreamView) {
					BS.friendStreamView = new BS.FriendStreamView();
					BS.friendStreamView.render();
				}

				$('#school-popup').html(BS.friendStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();
			},

			/**
			 * display Files & Media page
			 */
			// TODO
			filesMedia : function() {

				$('#content').children().detach();
				$('#school-popup').children().detach();
				var self = this;
				 
				// $('#right-photo').attr("src",BS.profileImageUrl);

				 BS.user.fetch({ success:function(e) {
				   
					   //get main menu
					   this.navView = new BS.NavView({ model: BS.user });
					   this.navView.showProfilePic();
					   $('.nav-collapse').html(this.navView.render().el);
					   $('nav li.active').removeClass('active');
					   $('#file-media').addClass('active');
					   
					   $('#right-photo').attr("src",BS.profileImageUrl);
			       
				 }});
				 
				BS.filesMediaView = new BS.FilesMediaView({
					model : BS.user
				});
                                
                                
				BS.filesMediaView.render();

				$('#content').html(BS.filesMediaView.el);
				$('.file-type').hide();
				$(".checkbox").dgStyle();
                                
                                 // instantiate the shuffle plugin
                                $('#grid').shuffle({
                                    itemWidth : 200,
                                    marginTop : 10,
                                    marginRight: 20,
                                    key : 'all',
                                    speed : 800,
                                    easing : 'ease-out'
                                });
                                
                                 // Set up button clicks
                                $('.filter-options li').on('click', function() {

                                    var $this = $(this),
                                        $grid = $('#grid');

                                    // Hide current label, show current label in title
                                    $('.filter-options .active').removeClass('active');
                                    $this.addClass('active');

                                    // Filter elements
                                    $grid.shuffle($this.attr('data-key'));
                                });
            

			},

                    
			displayJanRain : function(){
				
				 var janRainCount = $('.janrainContent').length;
				 if(janRainCount == 0)
				 {
					/*  For JanRain component*/
					(function() {
						
					    if (typeof window.janrain !== 'object') window.janrain = {};
					    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
					    
					    janrain.settings.tokenUrl =  BS.userPage ;
					    janrain.settings.tokenAction = 'event'; 
					    
					    /* ----Editted by Aswathy---- */
					    janrain.settings.actionText = "";
					    janrain.settings.fontColor = "#4599d2";
					    janrain.settings.providers = ["facebook","twitter","linkedin","google"];
					    janrain.settings.width ="160";
					    /* ----End---- */
					    
					    function isReady() {  janrain.ready = true; };
					    if (document.addEventListener) { 
					    	 
					      document.addEventListener("DOMContentLoaded", isReady, false);
					    } else {  
					      window.attachEvent('onload', isReady);
					    }
	
					    var e = document.createElement('script');
					    e.type = 'text/javascript';
					    e.id = 'janrainAuthWidget';
				        
					    if (document.location.protocol === 'https:') {
					      e.src = 'https://rpxnow.com/js/lib/beamstream/engage.js';
					    } else {
					      e.src = 'http://widget-cdn.rpxnow.com/js/lib/beamstream/engage.js';
					    }
					     
					    var s = document.getElementsByTagName('script')[0];
					    s.parentNode.insertBefore(e, s);
					})();
				 }
				 $('#load-janRain').css("display","none");
				
			}
		});
