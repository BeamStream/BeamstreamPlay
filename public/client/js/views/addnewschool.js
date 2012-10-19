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
     * close popup
     * */
    closeScreen :function(eventName){
    	 
	   	 eventName.preventDefault();
	   	 var parentPage = $('#new-school-popup').attr('name');
	   	 // close the popup and go to its parent page
	   	 $('#new-school-popup').children().detach(); 
	   	 
    },
    
    /**
     * add new school 
     */
    addNewSchool :function(eventName){
    	eventName.preventDefault(); 
    	var self = this;
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
                        if(data.status)
                        {
                        	if(data.status == "Failure")
                        	{
                        		$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
                        		$('.error-msg').html(data.message);
                        		
                        	}
                        }
                        else
                        {
                        	 $('#prev-school').attr("value","");
                        	 
                        	 // store new school details
                        	 localStorage["newSchoolId"] = data.id;
                        	 localStorage["newSchool"] =myschool;
                        	 
                        	 $('#new-school-popup').children().detach(); 
                        	 
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
    		$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
    		$('.error-msg').html("You must fill in all of the required fields.");
    	}
    	
    }
    
});
