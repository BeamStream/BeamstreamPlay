BS.AppRouter = Backbone.Router.extend({

    routes:{
    	
        "":"home",
        "login":"login",
        "emailVerification": "emailVerification",
        "school":"schoolReg",
        "class":"classReg",
        "profile":"profileReg",
        "streams":"maisStream",
        "basicRegistration/token/:token/iam/:iam/emailId/:email":"basicRegistration",
        "basicRegistration":"basicRegistrationViaJanRain",
        "classStream":"classStream",
        "projectStream" : "projectStream",
        "studyStream": "studyStream",
        "groupStream": "groupStream",
        "peerStream" : "peerStream",
        "friendStream" :"friendStream"

        
    },
    initialize :function() {
    	 
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
    	
    	 this.loginView = null;
    	 if (!this.loginView) {
             this.loginView = new BS.LoginView();
             this.loginView.render();
         }
         $('#school-popup').html(this.loginView.el);  
         $(".modal select:visible").selectBox();
         jQuery("#login-form").validationEngine();
        
    },
   
    /**
     * display School Info screen
     */
    schoolReg:function () {
       
    	 
//    	 if (!this.schoolView) {
             this.schoolView = new BS.SchoolView();
             this.schoolView.render();
//         }
 
         $('#school-popup').html(this.schoolView.el);  
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
    
//   	    if (!this.classView) {
            this.classView = new BS.ClassView();
            this.classView.render();
            
//        }
        $('#school-popup').html(this.classView.el);
        $(".modal select:visible").selectBox();
        $('.modal .datepicker').datepicker();
        jQuery("#class-form").validationEngine();
       
   },
    
   /**
    * display Profile Info screen
    */
   profileReg:function () {
	    
//   	   if (!this.profileView) {
            this.profileView = new BS.ProfileView();
            this.profileView.render();
//       }
       $('#school-popup').html(this.profileView.el);   
       $(".modal select:visible").selectBox();
       $('.modal .datepicker').datepicker();
       jQuery("#profile-form").validationEngine();
   },
   
   
   
   /**
    * display main stream page
    */
   maisStream:function () {
	 
	   $('#school-popup').children().detach(); 
	   $('#content').children().detach();
	   
	   $('.modal').css('display','none');
   	   if (!this.streamView) {
            this.streamView = new BS.StreamView();
            this.streamView.render();
            this.onstream = true; 
       }
   	   $('.modal-backdrop').hide();
       $('#content').html(this.streamView.el);
       $(".checkbox").dgStyle();
       
       $('.with-tooltips a, .with-tooltip').each(function() {
           var $this = $(this);
           var placement = $this.parent().hasClass('tooltips-bottom') ? 'bottom' : 'top';
           $(this).tooltip({placement: placement});
       });
       
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
				if(data.status == "Success") 
			    {
					 
					 this.registrationView = null;
				  	 if (!this.registrationView) {
				           this.registrationView = new BS.RegistrationView();
				           var mailInfo = {iam : iam , mail:email};
				           this.registrationView.render(mailInfo);
				          
				     }
				  	 
				     $('#school-popup').html(this.registrationView.el); 
				     $('#jan-iam').hide();
				     $(".checkbox").dgStyle();
				     jQuery("#registration-form").validationEngine();
			    }
				else
				{
					 alert("Token Expiredd");
				}
				  
			}
	     });
         
    },
  
    
    /**
     * basicRegistrationViaJanRain
     */
    basicRegistrationViaJanRain :function(event){
    	
        $('#school-popup').children().detach(); 
   	    this.mediaRegistrationView = null;
   	    if (!this.mediaRegistrationView) {
             this.mediaRegistrationView = new BS.MediaRegistrationView();
             this.mediaRegistrationView.render();
         }
   	 
        $('#school-popup').html(this.mediaRegistrationView.el);  
        $(".modal select:visible").selectBox();
        $(".checkbox").dgStyle();
        jQuery("#social-media-signup").validationEngine();
         
		 // display values
		var datas = BS.JsonFromSocialSite;
		  
		$("#user-name").val(datas.profile.preferredUsername);
	    $('#first-name').val(datas.profile.name.givenName);
		$('#last-name').val(datas.profile.name.familyName);
	    $('#location').val(datas.profile.address.formatted);
		  
    	
    },
  
    /**
    * for email verification
    */
    emailVerification: function() {
       $('#school-popup').children().detach(); 
 	   this.emailView = null;
 	   if (!this.emailView) {
           this.emailView = new BS.verifyEmailView();
           this.emailView.render();
       }
  	
       $('#school-popup').html(this.emailView.el);  
       $(".modal select:visible").selectBox();
       $(".checkbox").dgStyle();
       jQuery("#email-verify").validationEngine();
      
     },
 
 
	 /**
	  * display class stream screen
	  */
	 classStream:function () {
		  
//		 if (!this.ClassStreamView) {
	         this.ClassStreamView = new BS.ClassStreamView();
	         this.ClassStreamView.render();
//	     }
	     $('#school-popup').html(this.ClassStreamView.el);
	     $(".radio").dgStyle();
	     $(".modal select:visible").selectBox();
	     $('.modal .datepicker').datepicker();
	},
	
	/**
	 * display project stream screen
	 */
	projectStream:function () {
	
		if(!this.projectStreamView) {
	        this.projectStreamView = new BS.ProjectStreamView();
	        this.projectStreamView.render();
	    }
	    $('#school-popup').html(this.projectStreamView.el);
	    $(".radio").dgStyle();
	    $(".modal select:visible").selectBox();
	    $('.modal .datepicker').datepicker();
	},
	
	/**
	 * display study stream screen
	 */
	 studyStream :function () {
	
		 if (!this.studyStreamView) {
		    this.studyStreamView = new BS.StudyStreamView();
		    this.studyStreamView.render();
		 }
		$('#school-popup').html(this.studyStreamView.el);
		$(".radio").dgStyle();
		$(".modal select:visible").selectBox();
		$('.modal .datepicker').datepicker();
	
	
	},
	
	/**
	 * display group stream screen
	 */
	groupStream:function () {
		
		if (!this.groupStreamView) {
		    this.groupStreamView = new BS.GroupStreamView();
		    this.groupStreamView.render();
		}
		$('#school-popup').html(this.groupStreamView.el);
		$(".radio").dgStyle();
		$(".modal select:visible").selectBox();
		$('.modal .datepicker').datepicker();

	},
	
	/**
	 * display peer stream screen
	 */
	peerStream:function () {
		
		if (!this.peerStreamView) {
		    this.peerStreamView = new BS.PeerStreamView();
		    this.peerStreamView.render();
		}
		$('#school-popup').html(this.peerStreamView.el);
		$(".radio").dgStyle();
		$(".modal select:visible").selectBox();
		$('.modal .datepicker').datepicker();
	},
	
	/**
	 * display friend stream screen
	 */
	friendStream:function () {
		
	   if (!this.friendStreamView) {
	     this.friendStreamView = new BS.FriendStreamView();
	     this.friendStreamView.render();
	   }

	   $('#school-popup').html(this.friendStreamView.el);
	   $(".radio").dgStyle();
	   $(".modal select:visible").selectBox();
	   $('.modal .datepicker').datepicker();
    },

});

 


