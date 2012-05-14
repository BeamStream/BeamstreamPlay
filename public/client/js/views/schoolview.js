window.SchoolView = Backbone.View.extend({

	events: {
	      "click #save": "saveschool",
	      "click #continue": "continuetoclass",
	      
	    },
	
    initialize:function () {
    	
        console.log('Initializing School View');
        this.template= _.template($("#tpl-school-reg").html());

    },

    render:function (eventName) {

        $(this.el).html(this.template());
        return this;
    },
    
    // save school info.
    saveschool:function () {
    	

    	    var schools = new SchoolCollection();
    	  
    	 	$(".school-registration > .form-row > .element").each(function() {
    	 		
    	 		
    	 		if($(this).children("input[name='school-name']").length){
    	 			var school = $(this).children("input[name='school-name']").val();
//    	 			alert(house);
    	 		}
    	 		
    	 		if($(this).children("select[name='year']").val() > 0)
    	 			var year = $(this).children("select[name='year']").val();

    	 		
    	 		
    	 		if($(this).children("select[name='degree-expected']").val() > 0)
    	 			var degree = $(this).children("select[name='degree-expected']").val();
    	 		
    	 		
    	 		if($(this).children("input[name='major']").length){
    	 			var major = $(this).children("input[name='major']").val();
    	 		}
    	 		
    			if($(this).children("select[name='degree-program']").val() > 0)
    	 			var degreep = $(this).children("select[name='degree-program']").val();
 
    	 	  
    			var text_data = new School({ schoolname: school }); 
    		 	schools.add(text_data);
        	 
    	 });
	 
    	schools.create();
    	
      },
      
      
      
      
      continuetoclass:function (eventName) {
    	  eventName.preventDefault();        
    	  app.navigate("class", {trigger: true });
      },
 

});