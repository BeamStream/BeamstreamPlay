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
        "classStream":"classStream"

        
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
         $(".modal select:visible").selectBox();
         $('.modal .datepicker').datepicker();
         /* hide some fields on page load */
         $('#degree-exp-'+current).hide();
     	 $('#cal-'+current).hide();
     	 
     	
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
 
 
 /**
  * display class stream screen
  */
 classStream:function () {
 
	    if (!this.ClassStreamView) {
         this.ClassStreamView = new BS.ClassStreamView();
         this.ClassStreamView.render();
         
     }
  
     $('#school-popup').html(this.ClassStreamView.el);
     
     $(".modal select:visible").selectBox();
     $('.modal .datepicker').datepicker();
     
    
},
 
  
});

 

