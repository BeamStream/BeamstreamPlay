 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/August/2012
	 * Description           : Backbone view for adding a new school
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */

	BS.AddNewSchool = Backbone.View.extend({
	
		events: {
			
			"click #popup-close" : "closeScreen",
			"click #addSchool" : "addNewSchool"
		},
		
	    initialize:function () {
	    	
	        console.log('Initializing New School View');
			this.source = $("#add-new-school-tpl").html();
			this.template = Handlebars.compile(this.source);
	    },
	
	    /**
	     * render school Info screen
	     */
	    render:function (parentId) {
	    	
	    	this.parentId = parentId;
	    	$(this.el).html(this.template);
	        return this;
	    },
	    
	    /**
	     * close add new school popup
	     */
	    closeScreen :function(eventName){
	    	 
		   	 eventName.preventDefault();
		   	 var parentPage = $('#new-school-popup').attr('name');
		   	 
		   	 // close the popup and go to its parent page
		   	 $('#new-school-popup').children().detach(); 
		   	 
	    },
	    
	    /**
	     * post new school info to add new school 
	     */
	    addNewSchool :function(eventName){
	    	
	    	eventName.preventDefault(); 
	    	var self = this;
	    	
	    	/* validate form */
	    	var validate = $('#add-new-school-form').valid();
	    	if(validate == true)
	    	{   
	    		 var myschool = $('#my-school').val();
	    		 var website = $('#website').val();
	             $.ajax({
	                    type: 'POST',
	                    url:BS.addSchool,
	                    data: {
	                    	schoolName : myschool,
	                    	schoolWebsite :website
	                    },
	                    dataType:"json",
	                    success:function(data){
	                        
	                    	// if the school is already exist in beamstream
	                    	if(data == "School Already Exists")
	                    	{
	                    		 
	                    		$('#show_message').fadeIn("medium").delay(2000).fadeOut('slow');
	                    		$('.error-msg').html("School Already Exists");
	                    		
	                    	}
	                        else
	                        {
	                        	 $('#prev-school').attr("value","");
	                        	 
	                        	 // store new school details to localstorage
	                        	 localStorage["newSchoolId"] = data.id;
	                        	 localStorage["newSchool"] =myschool;
	                        	 
	                        	 $('#new-school-popup').children().detach(); 
	                        	 
	                        	 /* keep the new school info */ 
	                        	 $('#'+self.parentId).val(myschool);
	                        	 var nextIId = $('#'+self.parentId).next('input').attr('id');
	                        	 if(nextIId)
	                        	 {
	                        		 $('#'+self.parentId).next('input').attr('value',localStorage["newSchoolId"]);
	                        		 $('#'+self.parentId).next('input').next('input').attr('value',localStorage["newSchoolId"]);
	                        	 }
	                        }
	                    }
	                 });
	    	}
	    	else
	    	{
	    		/* display form validation error message */
	    		$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
	    		$('.error-msg').html("You must fill in all of the required fields.");
	    	}
	    	
	    }
	    
	});
