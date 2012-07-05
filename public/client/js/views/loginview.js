BS.LoginView = Backbone.View.extend({

	events: {
	      "click #login": "login",
	      "click #register" :"registration"
	      
	      
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
			if(validate == true)
			{
				var loginDetails = this.getLoginInfo();
				if(loginDetails == 1)
			    {
						console.log("Only use emails that are assosiated with schools and organizations");
						$('#error').html("Only use emails that are assosiated with schools and organizations");
				} 
			    else
			    {
					    /* post data with school and class details */
						 $.ajax({
						    	type : 'POST',
						    	url : BS.login,
						    	data : {
						    		data : loginDetails
						    	},
						    	dataType : "json",
						    	success : function(data) {
						    						 
							    		if(data.status == "success") 
							    		{
							    			 console.log(data.status + " : " + data.message);
							    			 BS.singleUser.set('loggedin', true);
							    			
							    			 BS.AppRouter.navigate("streams", {trigger: true, replace: true});
							    		}
							    		else 
							    		{
							    			 console.log(data.status + " : " + data.message);
							    			 BS.singleUser.set('loggedin', false);
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
        var email = $("#email").val();
    	var emailregex =/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
    	
    	
    	var remember;
		if ($('#remember').attr('checked') == "checked") {
			remember = true;
		} else {
			remember = false;
		}
        var pwd = $("#password").val();
        	
        	  if(email.match(emailregex))
              {
        		  loginModel.set({
              		email : $("#email").val(),
              		password : $("#password").val(),
              		rememberMe : remember
          		});
              	var loginDetails = JSON.stringify(loginModel);
              	return loginDetails;              	
              }
              else
              {
              	return 1;
              }
        	
    },
    /**
     * move to regisration page
     */
    registration :function(eventName){
    	 eventName.preventDefault();
    	 BS.AppRouter.navigate("emailVerification", {trigger: true, replace: true});
    }
});
