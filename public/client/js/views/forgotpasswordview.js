BS.ForgotPasswordView = Backbone.View.extend({

	
	events: {
	      "click #recover-pwd": "postEmailId",
	       
	 },
	
    initialize:function () {
  
        console.log('Initializing Forgot Password  View');
        this.template= _.template($("#tpl-forgot-password").html());
        
    },

    render:function (eventName) {
    	
        $(this.el).html(this.template());
        return this;
    },
    /**
     * post email address to recover password
     */
    postEmailId : function(eventName){
    	
    	 eventName.preventDefault();
     	 var emailregex =/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;

    	 var email = $('#email').val();
    	 
    	 if(email.match(emailregex))
         {
	    	 /* post email address for recover password */
			 $.ajax({
			    	type : 'POST',
			    	url : BS.forgotPassword,
			    	data : {
			    		email : email
			    	},
			    	dataType : "json",
			    	success : function(data) {
			    						 
				    		if(data.status == "Success") 
				    		{
				    			 alert("Password has been sent to your emailId");
				    			 
				    			// navigate to main login page after a tome period
				    			 setTimeout(function() {
				    				 BS.AppRouter.navigate("login", {trigger: true});
				    			 }, 500);
				    			 
				    		}
				    		else 
				    		{
				    			 alert("No User Found with this emailId");
				    							
				    		}
				    		$('#error').html(" ");
			    	 } 
			    });
         }
    	 else
    	 {
    		 $('#error').html("Invalid email address");
    	 }
    	
    	
    }
  
  
});
