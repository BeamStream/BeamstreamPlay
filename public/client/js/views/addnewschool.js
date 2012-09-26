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
    render:function (eventName) {
    	$(this.el).html(this.template);
        return this;
        
        
    },
    /**
     * close popup
     * */
    closeScreen :function(eventName){
    	 
   	 eventName.preventDefault(); 
   	 $('#new-school-popup').children().detach(); 
   	 var schoolView = new BS.SchoolView();
    },
    /**
     * add new school 
     */
    addNewSchool :function(eventName){
    	eventName.preventDefault(); 
    	 
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
                        	 $('#new-school-popup').children().detach(); 
                           	 var schoolView = new BS.SchoolView();
                           	
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
