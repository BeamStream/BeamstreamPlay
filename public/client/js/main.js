var AppRouter = Backbone.Router.extend({

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
    

    home: function() {
    	console.log('Here');
    	
    },

    /**
     * display login form
     */
    
    login: function() {
    	 this.loginView = null;
    	 if (!this.loginView) {
             this.loginView = new LoginView();
             this.loginView.render();
         }
    	 
         $('#register-step-school').html(this.loginView.el);  
         
    },
   
    /**
     * display School Info screen
     */
    schoolReg:function () {
    	
    	 if (!this.schoolView) {
             this.schoolView = new SchoolView();
             this.schoolView.render();
             
         }
         $('#register-step-school').html(this.schoolView.el);  
         
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
            this.classView = new ClassView();
            this.classView.render();
            
        }
   	    
        $('#register-step-school').html( this.classView.el);
        $(".modal select:visible").selectBox();
        $('.modal .datepicker').datepicker();
       
   },
    
   /**
    * display Profile Info screen
    */
   profileReg:function () {
    	 
   	  if (!this.profileView) {
            this.profileView = new ProfileView();
            this.profileView.render();
            
      }
      $('#register-step-school').html(this.profileView.el);   
      $(".modal select:visible").selectBox();
      $('.modal .datepicker').datepicker();
   },
   
   
   
   /**
    * display main stream page
    */
   maisStream:function () {
    	 
   	  if (!this.streamView) {
            this.streamView = new StreamView();
            this.streamView.render();
            
      }
      $('body').html(this.streamView.el);
      
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
				           this.registrationView = new RegistrationView();
				           var mailInfo = {iam : iam , mail:email};
				           this.registrationView.render(mailInfo);
				     }
				  	 
				     $('#register-step-school').html(this.registrationView.el);  
				     $(".checkbox").dgStyle();
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
          this.emailView = new verifyEmailView();
          this.emailView.render();
      }
 	 
      $('#register-step-school').html(this.emailView.el);  
      $(".modal select:visible").selectBox();
      
 },
 
  
});


app = new AppRouter();
Backbone.history.start();

