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

        
    },
    initialize :function() {
    	 
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
         $('#main-popups').html(this.loginView.el);  
         $(".modal select:visible").selectBox();
         jQuery("#login-form").validationEngine();
        
    },
   
    /**
     * display School Info screen
     */
    schoolReg:function () {
     
    	   
    	 if (!this.schoolView) {
             this.schoolView = new BS.SchoolView();
             this.schoolView.render();
             
         }
 
         $('#school-popup').html(this.schoolView.el);  
         
         /* hide some fields on page load */
         $('#degree-exp-'+current).hide();
     	 $('#cal-'+current).hide();
     	 
     	 $(".modal select:visible").selectBox();
         $('.modal .datepicker').datepicker();
    },

    
    /**
     * display Class Info screen
     */
    classReg:function () {
    
   	    if (!this.classView) {
            this.classView = new BS.ClassView();
            this.classView.render();
            
        }
     
        $('#school-popup').html(this.classView.el);
        
        $(".modal select:visible").selectBox();
        $('.modal .datepicker').datepicker();
        jQuery("#class-form").validationEngine();
       
   },
    
   /**
    * display Profile Info screen
    */
   profileReg:function () {
    	 
   	  if (!this.profileView) {
            this.profileView = new BS.ProfileView();
            this.profileView.render();
            
      }
      $('#school-popup').html(this.profileView.el);   
      $(".modal select:visible").selectBox();
      $('.modal .datepicker').datepicker();
      jQuery("#profile-form").validationEngine();
   },
   
   
   
   /**
    * display main stream page
    */
   maisStream:function () {
	   $('.modal').css('display','none');
   	  if (!this.streamView) {
            this.streamView = new BS.StreamView();
            this.streamView.render();
            this.onstream = true; 
      }
   	  $('.modal-backdrop').hide();
   	  
//   	  $('#container').append('<div class="" id="school-popup"></div>');
      $('#content').html(this.streamView.el);
      
   },
   
   /**
    * registration after email verification
    */
   basicRegistration: function(token,iam,email) {
	    
	    
	   // verify the token
	   $.ajax({
			type : 'POST',
 
//			url : "http://localhost/client2/api.php",
			url :"http://localhost:9000/verifyToken",

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
				     $(".checkbox").dgStyle();
				     jQuery("#registration-form").validationEngine();
			    }
				else
				{
					 alert("Token Expired");
				}
				  
			}
	     });
         
  },
  
  
  /**
   * for email verification
   */
  emailVerification: function() {
 	 this.emailView = null;
 	 if (!this.emailView) {
          this.emailView = new BS.verifyEmailView();
          this.emailView.render();
      }
 	 
      $('#main-popups').html(this.emailView.el);  
      $(".modal select:visible").selectBox();
      jQuery("#email-verify").validationEngine();
      
 },
 
  
});

 

