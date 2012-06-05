window.RegistrationView = Backbone.View.extend({

	events:{
		"click #save" : "save",
		"click #continue" : "toNextPage",
	},
	 
	
    initialize:function () {
    	
        console.log('Initializing Basic Registration View');
        this.source = $("#tpl-basic-profile").html();
		this.template = Handlebars.compile(this.source);
        
    },

    render:function (eventName) {
    	
    	// get mail informations
    	this.iam = eventName.iam;
    	this.mailId = eventName.mail;
    	
    	var mailInfo = {
				"mailId" : eventName.mail
		}
        $(this.el).html(this.template(mailInfo));
        return this;
    },
    
    
    /**
     * Post /save basic registration details
     */
    
    save:function (eventName) {
    	eventName.preventDefault();
//    	var validate = jQuery('#registration-form').validationEngine('validate');
    	var regDetails = this.getFormData();
    	
    	/* post basic profile registration details */
		$.ajax({
			type : 'POST',
			url : "http://localhost:9000/registerNewUser",
			data : {
				data : regDetails
			},
			dataType : "json",
			success : function(data) {
				  
				  
			}
	     });
    },
    
    /**
     * get all form data
     */
    getFormData:function(){
    	
    	var  basicProfile =new BasicProfile();
    	var location;
    	if($('#loaction').attr('checked') == "checked")
    	{
    		location = true;
    	}
    	else
    	{
    		location = false;
    	}
    	 
    	basicProfile.set({
    		iam: this.iam,
    		schoolName: $('#school-name').val(),
    		userName: $('#user-name').val(),
    		password: $('#password').val(),
    		firstName: $('#first-name').val(),
    		lastName: $('#last-name').val(),
    		zipCode: $('#zip-code').val(),
    		location:location,
			 
		});
    	var regDetails = JSON.stringify(basicProfile);
    	 
    	return regDetails;
    	
    },
    
    
    /**
     * continue to next page
     */
    
    toNextPage:function (eventName) {
    	 
    	eventName.preventDefault();
//    	var validate = jQuery('#registration-form').validationEngine('validate');
    	var regDetails = this.getFormData();
    	
    	/* post basic profile registration details */
		$.ajax({
			type : 'POST',
			url : "http://localhost:9000/registerNewUser",
			data : {
				data : regDetails
			},
			dataType : "json",
			success : function(data) {
				  
				  
			}
	     });
    },
   
    
});