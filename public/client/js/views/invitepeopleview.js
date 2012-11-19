BS.InvitePeopleView = Backbone.View.extend({

	events: {
		"click #close-school" : "closeScreen",
		"click #invite" : "inviteFriends"
           
	    },
	
    initialize:function () {
    	
        console.log('Initializing Invite View');
        
		this.source = $("#tpl-invite-people").html();
		this.template = Handlebars.compile(this.source);
		$("#invite-form").validate();
    },

     
    
    /**
     * render invite view
     */
    render:function (eventName) {
    
        $(this.el).html(this.template);
        return this;
    },
    /**
     * invite friends using emailId
     */
    inviteFriends :function (eventName){
    	eventName.preventDefault(); 
    	var validate =  $("#invite-form").valid();
    	var mailIds = $('#friends_emailId').val();
//    	if(validate == true)
//    	{
    		$.ajax({
	   			type : 'POST',
	   			url : BS.inviteUser,
	   			data : {
	   				data  : mailIds
	   			},
	   			dataType : "json",
	   			success : function(data) {
	   				
	   			}
   		    });
//    	}
//    	else
//    	{
//    		$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
//    		$('.error-msg').html("Please enter a vallid email address");
//    	}
    },
    
    /**
     * close the screen
     */
    closeScreen : function(eventName){
  	  eventName.preventDefault(); 
  	  BS.AppRouter.navigate('streams', {trigger: true});
    },

    
   
});
