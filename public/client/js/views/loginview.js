window.LoginView = Backbone.View.extend({

	events: {
	      "click #login": "login",
	      
	 },
	
    initialize:function () {
    	
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

			var loginDetails = this.getLoginInfo();
		    
		    if(loginDetails != false)
		    {

		    	/* post data with school and class details */
				$.ajax({
					type : 'POST',
					url : "http://localhost:9000/users",
					data : {
						data : loginDetails
					},
					dataType : "json",
					success : function(data) {
						 
						if(data.status == "success") 
						{
							console.log(data.status + " : " + data.message);
							app.navigate("school", {
							trigger : true,
									replace : true
								});
						}
						else 
						{
							console.log(data.status + " : " + data.message);
							$('#error').html(data.message);
							
							/* clear email and password textbox and get highlighted */
							$('#email').val("");
							$('#password').val("");
							$('#email').focus();
//							$("#email").css({"border": "1px solid #DD4B39"});
//							$("#password").css({"border": "1px solid #DD4B39"});

						}
					},
					error : function(error){
						console.log("Error");
					}
				});
			}
		    else
		    {
				 alert("Fille required fileds.." );
				 console.log("validation: " + $.validationEngine.defaults.autoHidePrompt);
		    }
		
		    },
    /**
     * get login form details
     */
    getLoginInfo:function (eventName) {
    	
    	var loginModel = new Login();
    	var iam = $("#iam").val();
        var email = $("#email").val();
    	var status = $("input[name=signup]:checked").val();
        var pwd = $("#password").val();
        if(iam !="" && email !== "" && status != "" && pwd != "")
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
        	return false;
        }
    	
    	
    },
     
   
    
});
