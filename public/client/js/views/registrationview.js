BS.RegistrationView = Backbone.View.extend({

	events : {
		"click #save" : "save",
		"click #continue" : "toNextPage",
		"click .close-button" : "closeScreen"
	},

	initialize : function() {
		 
		console.log('Initializing Basic Registration View');
		this.source = $("#tpl-basic-profile").html();
		this.template = Handlebars.compile(this.source);
		// for edit user details
		BS.regBack = false;
		$("#registration-form").validate();

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
		var validate = $("#registration-form").valid();
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
    	   				if(data.status) {
    	   					
    	   					if(data.status == "Failure")
    	   					  $('#error').html("This User Email or Name is already taken");
    	   				   
    	   				} 
    	   				else 
    	   				{
    	   					//for edit user info
    	   					localStorage["regInfo"] ='';
    	   					 
    	   					BS.schoolBack = false;
    	   					BS.regBack = false;
    	   					BS.classBack = false;
    	   					
    	   					//set status for school back page
    						BS.resistrationPage = " ";
    						
    	   					// navigate to main stream page
    	   					BS.schoolFromPrev =  $('#school-name').val();
    	   					$(".star").hide();
    	   					BS.AppRouter.navigate("streams", {
    	   						trigger : true,
    	   						 
    	   					});
    	   					console.log(data.message);
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
        if($('#user_Id').val())
        {
        	var id = $('#user_Id').val();
        	this.iam = BS.iam;
   		    this.mailId = BS.email;
        	
        }
        else
        {
        	var id = 1;
        }
		basicProfile.set({
			id : id,
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
        var validate = $("#registration-form").valid();
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
					 
					if(data.status) {
						if(data.status == "Failure")
						    $('#error').html("This User Email or Name is already taken");
					} 
					else 
					{
						localStorage["regInfo"] =JSON.stringify(data); 
						BS.regBack = true;
						BS.editSchool = false;
						//set status for school back page
						BS.resistrationPage = "basic";
	   					 
						BS.schoolFromPrev =  $('#school-name').val();
						$(".star").hide();
						// navigate to main stream page
						BS.AppRouter.navigate("school", {trigger : true,});
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
   
	/**
	 * close the screen 
	 */
	closeScreen : function(eventName){
	  eventName.preventDefault(); 
	  $(".star").hide();
  	  BS.AppRouter.navigate('login', {trigger: true});
	}
});
