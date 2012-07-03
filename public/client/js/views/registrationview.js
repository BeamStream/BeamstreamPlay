BS.RegistrationView = Backbone.View.extend({

	events : {
		"click #save" : "save",
		"click #continue" : "toNextPage",
	},

	initialize : function() {
		 
		console.log('Initializing Basic Registration View');
		this.source = $("#tpl-basic-profile").html();
		this.template = Handlebars.compile(this.source);

	},

	render : function(eventName) {
	   
		 
		//get mail informations
		 this.iam = eventName.iam;
		 this.mailId = eventName.mail;
		 
		 $(this.el).html(this.template);
		 return this;
		
	},

	/**
	 * Post /save basic registration details
	 */

	save : function(eventName) {
		eventName.preventDefault();
		var validate = jQuery('#registration-form').validationEngine('validate');
        
        if(validate == true){
    	    var regDetails = this.getFormData();
    	  
            	/* post basic profile registration details */
       			$.ajax({
    	   			type : 'POST',
    	   			url : BS.registerNewUser,
    	   			data : {
    	   				data : regDetails
    	   			},
    	   			dataType : "json",
    	   			success : function(data) {
    	   				if (data.status == "Success") {
    	   					// navigate to main stream page
    	   					BS.AppRouter.navigate("streams", {
    	   						trigger : true,
    	   						replace : true
    	   					});
    	   					console.log(data.message);
    	   				} else {
    	   					$('#error').html("This User Email or Name is already taken");
    	   				}
    	
    	   			}
       		    });
           
    	   
        }
        else
        {
        	console.log("Fields are not completely filled");
        	$('#error').html("Fields are not completely filled");
        }
       
		
	},

	/**
	 * get all form data
	 */
	getFormData : function() {
      
		var basicProfile = new BS.BasicProfile();
		var useCurrentLocation;
		if ($('#useCurrentLocation').attr('checked') == "checked") {
			useCurrentLocation = true;
		} else {
			useCurrentLocation = false;
		}
        
		basicProfile.set({
			iam : this.iam,
			email : this.mailId,
			schoolName : $('#school-name').val(),
			userName : $('#user-name').val(),
			password : $('#password').val(),
			firstName : $('#first-name').val(),
			lastName : $('#last-name').val(),
			location : $('#location').val(),
			useCurrentLocation : useCurrentLocation,

		});
		var regDetails = JSON.stringify(basicProfile);

		return regDetails;

	},

	/**
	 * continue to next page
	 */

	toNextPage : function(eventName) {

		eventName.preventDefault();
        var validate = jQuery('#registration-form').validationEngine('validate');
        
        if(validate == true){
        
			var regDetails = this.getFormData();
	
			/* post basic profile registration details */
			$.ajax({
				type : 'POST',
				url : BS.registerNewUser,
				data : {
					data : regDetails
				},
				dataType : "json",
				success : function(data) {
					if (data.status == "Success") {
						
						BS.schoolFromPrev =  $('#school-name').val();
						 
						// navigate to main stream page
						BS.AppRouter.navigate("school", {
							trigger : true,
							replace : true
						});
						 
					} else {
						console.log(data.message);
					}
	
				}
			});
        }
        else
        {
        	console.log("Fields are not completly filled");
        	$('#error').html("Fields are not completly filled");
        }
	},

});
