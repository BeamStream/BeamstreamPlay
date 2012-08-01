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
        
        /** for authentication  */
        BS.user.fetch({ success:function(e) {
    		if(e.get('firstName') != null) { 
				e.set('loggedin', true);
			}
			else { 
				e.set('loggedin', false);				
			}
			  
			this.navView = new BS.NavView({ model: BS.user });
			$('.nav-collapse').html(this.navView.render().el);

    	}},this);
		 
    	
    	 
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
    	 $('#school-popup').children().detach(); 
    	 
    	 BS.loginView = new BS.LoginView();
    	 BS.loginView.render();
    	 BS.idLogin = "login";
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
		      
			   BS.streamView = new BS.StreamView({ model: BS.user });
			   BS.streamView.render();
			   self.onstream = true; 
	   	   
			   //get main menu
			   this.navView = new BS.NavView({ model: BS.user });
			   $('.nav-collapse').html(this.navView.render().el);
	 
			     /* get profile images for user */
		          $.ajax({
		    			type : 'POST',
		    			url : BS.profileImage,
		    			dataType : "json",
		    			data : {
			    				 userId :  e.attributes.id.id
			    			},
		    			success : function(data) {
		    				
		    	        	BS.profileImageUrl = data;
		    	        	$('#main-photo').attr("src",BS.profileImageUrl);
		    	        	$('#right-photo').attr("src",BS.profileImageUrl);
		    	        	$('#msg-photo').attr("src",BS.profileImageUrl);
		    			}
		    	   });
		          
		          
		          
	   	   $('.modal-backdrop').hide();
	       $('#content').html(BS.streamView.el);
	       
      	
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

//						BS.registrationView = null;
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
//				BS.mediaRegistrationView = null;
				 
				if (!BS.mediaRegistrationView) {
					BS.mediaRegistrationView = new BS.MediaRegistrationView();
					BS.mediaRegistrationView.render();
				}

				$('#school-popup').html(BS.mediaRegistrationView.el);
				$('#school-record').hide();
				$(".modal select:visible").selectBox();
				$(".checkbox").dgStyle();
				jQuery("#social-media-signup").validationEngine();

				// display values
				var datas = BS.JsonFromSocialSite;

//				$("#user-name").val(datas.profile.preferredUsername);
				$('#first-name').val(datas.profile.name.givenName);
				$('#last-name').val(datas.profile.name.familyName);
				$('#location').val(datas.profile.address.formatted);

			},

			/**
			 * for email verification
			 */
			emailVerification : function() {
				$('#school-popup').children().detach();
//				BS.emailView = null;
				if (!BS.emailView) {
					BS.emailView = new BS.verifyEmailView();
					BS.emailView.render();
					BS.idLogin = "register";
				}

				$('#school-popup').html(BS.emailView.el);
				$(".modal select:visible").selectBox();
				$(".checkbox").dgStyle();
				$('.forgot-pass').hide();
				jQuery("#email-verify").validationEngine();

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

//				 BS.user.fetch({ success:function(e) {
//				   
//					   //get main menu
//					   this.navView = new BS.NavView({ model: BS.user });
//					   $('.nav-collapse').html(this.navView.render().el);
//			       
//				 }});
				 
				BS.filesMediaView = new BS.FilesMediaView({
					model : BS.user
				});
				BS.filesMediaView.render();

				$('#content').html(BS.filesMediaView.el);
				$('.file-type').hide();
				$(".checkbox").dgStyle();
				
				
				

			}
		});
