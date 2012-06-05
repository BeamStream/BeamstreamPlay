window.RegistrationView = Backbone.View.extend({

	events:{
		"click #save" : "save",
	},
	 
	
    initialize:function () {
    	
        console.log('Initializing Basic Registration View');
        this.template= _.template($("#tpl-basic-profile").html());
        
    },

    render:function (eventName) {
    	alert(eventName);
    	 
//		 var emailId = {
//					"emailId" :eventName 
//			}
    	var sCount = {
				"sCount" : "dfdd",
				"schools": "fgdfg" 
		}
        $(this.el).html(this.template(sCount));
        return this;
    },
    
    
    /**
     * Post /save basic registration details
     */
    
    save:function (eventName) {
    	var profDetails = this.getFormData();
    	
    	/* post basic profile registration details */
		$.ajax({
			type : 'POST',
			url : "http://localhost/client2/api.php",
			data : {
				data : profDetails
			},
			dataType : "json",
			success : function(data) {
				 
				  
			}
	     });
         
    },
     
    getFormData:function(){
    	
    	var  basicProfile =new BasicProfile();
    	basicProfile.set({
			
    		schoolName : $('#school-name').val(),
    		userName : $('#user-name').val(),
    		firstName: $('#first-name').val(),
    		lastName: $('#last-name').val(),
    		zipCode: $('#zip-code').val(),
			 
		});
    	var profDetails = JSON.stringify(basicProfile);
    	console.log(profDetails);
    	return profDetails;
    	
    }
   
    
});