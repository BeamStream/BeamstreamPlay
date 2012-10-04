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
   	 console.log(parentPage);
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
    		 console.log(myschool);
    		 console.log(website);
    		 
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
                        		$('#error').html(data.message);
                        	
                        }
                        else
                        {
//                        	 var parent = $('#parent-Id').attr("value");
//                        	 $('#'+parent).val(myschool);
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
                        	 }
                        	 
                           	  
                           	
                        }
                    }
                 });
        	 
    	}
    	else
    	{
    		$('#error').html("Fields are not completely filled");
    	}
    	
    }
    
});
