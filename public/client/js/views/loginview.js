BS.LoginView = Backbone.View.extend({

	events: {
	      "click #login": "login",
	      
	 },
	
    initialize:function () {
    	jQuery("#login-form").validationEngine();
        console.log('Initializing Login View');
        this.template= _.template($("#tpl-login").html());
        
    },

    render:function (eventName) {
    	
        $(this.el).html(this.template());
        return this;
    },
    
    
    /**
     * login -verification
     */
    login:function (eventName) {
    	
    	    eventName.preventDefault();
 
    	    var validate = jQuery('#login-form').validationEngine('validate');
 
			var loginDetails = this.getLoginInfo();
			
			  if(loginDetails != false)
			  {
			    if(loginDetails == 1)
			    {
						console.log("Only use emails that are assosiated with schools and organizations");
						$('#error').html("Only use emails that are assosiated with schools and organizations");
				} 
			    else
			    {
			    	 pwdStatus = $("input[name=signup]:checked").val();
					    if(pwdStatus == 0)
					    {
					    	BS.AppRouter.navigate("emailVerification", {
								    trigger : true,
									replace : true
							    });
					    }
					    else if(pwdStatus == 1)
					    { 
					    	 
					    	if($('#password').val() == "")
					    	{
					    		$('#error').html("Password is required");
					    		$('#password').focus();
					    	}
					    	else
					    	{
					    		/* post data with school and class details */
						          $.ajax({
						    			 type : 'POST',
//						    			  url : "http://localhost/client2/api.php",
//						    			 url : "http://localhost:9000/users",
						    			 url : "http://beamstream-v3.herokuapp.com/users",
						    			 data : {
						    						data : loginDetails
						    			  },
						    			 dataType : "json",
						    			 success : function(data) {
						    						 
							    			 if(data.status == "success") 
							    			 {
							    					 console.log(data.status + " : " + data.message);
							    					 BS.AppRouter.navigate("streams", {trigger: true, replace: true});
							    			 }
							    			 else 
							    			 {
							    					 console.log(data.status + " : " + data.message);
							    					 $('#error').html(data.message);
							    							
							    					 /* clear email and password text box and get highlighted */
							    					 $('#email').val("");
							    					 $('#password').val("");
							    					 $('#email').focus();
							    							
							    			 }
						    		      },
						    			  error : function(error){
						    						console.log("Error");
						    			  }
						    		 });
					    	}
					    	  
					     	
					     }
			    }
			   
		     }
			 else
		     {
				  
		        console.log("fileds are not completely filled");
		        $('#error').html("fileds are not completely filled");
		     }

	},
    /**
     * get login form details
     */
    getLoginInfo:function (eventName) {
    	
    	var loginModel = new BS.Login();
    	var iam = $("#iam").val();
        var email = $("#email").val();
    	var status = $("input[name=signup]:checked").val();
    	var emailregex =/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
    	
        var pwd = $("#password").val();
      
        if(iam !="" && email !== "" && status != "" )
        {
        	
        	  if(email.match(emailregex))
              {
        		  loginModel.set({
          			
              		iam :  $("#iam").val(),
              		email : $("#email").val(),
              		pwdStatus : $("input[name=signup]:checked").val(),
              		password : $("#password").val(),
          			 
          		});
              	var loginDetails = JSON.stringify(loginModel);
              	return loginDetails;              	
              }
              else
              {
              	return 1;
              }
        	
        }
        else
        {
        	return false;
        }
    	
    },
     
   
    
});
