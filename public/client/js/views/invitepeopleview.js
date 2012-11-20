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
    	//split mail address 
    	var mailArray = mailIds.split(',');
         
        var validEmailsStatus = true ;
        var  validEmails = [];
        var emailregex =/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;

         // validate each mailId in an array 
        _.each(mailArray, function(mailId) {
        	mailId = $.trim(mailId);
        	if(mailId)
        	{
	        	 if(!mailId.match(emailregex))
	             {
	        		 validEmailsStatus = false ;
	        		 validEmails.push(mailId);
	             }
        	}
        	  
         });
        
    	if(validEmailsStatus == true)
    	{
    		$('#send_invite').css("display","block");
    		$.ajax({
	   			type : 'POST',
	   			url : BS.inviteUser,
	   			data : {
	   				data  : mailIds
	   			},
	   			dataType : "json",
	   			success : function(data) {
	   				if(data.status = "Success")
	   				{
	   					$('#send_invite').css("display","none");
	   					$('#display_message').fadeIn("medium").delay(2000).fadeOut('fast');
	   		    		$('.error-msg').html("Invitations has been sent");
	   		    		setTimeout(function() {
                            BS.AppRouter.navigate("streams", {trigger: true});
                        }, 2000);
	   		    	      
	   				}
	   				else
	   				{
	   					console.log("Error ");
	   				}
	   			}
   		    });
    	}
    	else
    	{
    		$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
    		$('.error-msg').html("Please enter a vallid email address");
    	}
    },
    
    /**
     * close the screen
     */
    closeScreen : function(eventName){
  	  eventName.preventDefault(); 
  	  BS.AppRouter.navigate('streams', {trigger: true});
    },

    
   
});
