

define(['view/formView'], function(FormView){
	var RecoverPassword;
	RecoverPassword = FormView.extend({
		objName: 'RecoverPassword',
		
		events:{
			'click #recover' : "postEmailId",
			'click .register-cancel' : "cancel"
		},

		onAfterInit: function(){	
            this.data.reset();
        },
        
        postEmailId : function(eventName){        	
        	eventName.preventDefault();  
        	this.data.url ="/forgotPassword";
            this.saveForm();
        },
        
        success: function(model, data){
        	alert(4545);
        	var self = this;
        	if(data.status == "Success") 
    		{
    			 $('#forgot-pwd-loader').css("display","none");
    			 alert("Password has been sent to your emailId");    			 
    			 window.location = "/login";
    		}
    		else 
    		{
    			$('#forgot-pwd-loader').css("display","none");
    			alert("No User Found with this emailId");
    							
    		}
        },
        
        cancel : function(){	
        	
        	 window.location = "/login";
        }
 
	})
	return RecoverPassword;
});
