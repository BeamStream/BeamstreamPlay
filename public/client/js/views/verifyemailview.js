window.verifyEmailView = Backbone.View.extend({

	events: {
		 "click #no-schoolmail" : "addSchoolEmail",
		 "click #register" : "registration"
	      
	 },
	
    initialize:function () {
    	
        console.log('Verify your email');
        this.template= _.template($("#tpl-verify-email").html());
        
    },

    render:function (eventName) {
    	
        $(this.el).html(this.template());
        return this;
    },
    /**
     * add school mail 
     */
    addSchoolEmail:function (eventName) {
    	
    	var  checked = $('#schoolmail').attr('checked');
    	if(checked == "checked")
    	{
    		$('#school-email').show();
    	}
    	else
    	{
    		$('#school-email').hide();
    	}
         
    },
     
   
    /**
     * verify email 
     */
    registration:function (eventName) {
    	
    	eventName.preventDefault();
    	var validate = jQuery('#email-verify').validationEngine('validate');
    	if(validate == true)
	    {
	    	var mailDetails = this.getdata();
	    	 
	    	/* post email verification details */
			$.ajax({
				type : 'POST',
	//			url : "http://localhost:9000/getEmailforNewUser",
				url : "http://localhost/BeamstreamPlay/public/client/api.php",
				data : {
					data : mailDetails
				},
				dataType : "json",
				success : function(data) {
					if(data.status == "success") 
	   			    {
						 
							var source = $("#tpl-verify-popup").html();
							var template = Handlebars.compile(source);
							$("#register-step-school").html(template);
	   			     }
					 else
					 {
						 alert("Token Expired");
					 }
					  
				}
		     });
	    }
    	else
    	{
    		console.log("validation: " + $.validationEngine.defaults.autoHidePrompt);
    	}
		 
         
    },
    
    
    /**
     * get form data 
     */
    getdata:function(){
    	
    	var iam = $("#iam").val();
    	var wEmail =$('#email').val();
    	var emailModel = new EmailVerification();
    	emailModel.set({
			
    		iam :  iam,
    		email : wEmail,
    	 
			 
		});
    	var mailDetails = JSON.stringify(emailModel);
    	return mailDetails;
    	
    }
    
});
