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
    	 
	    	 	$(".school-registration").each(function(key,value) {
	    	 		
	    	 		
	    	 		if($(this).is(':visible') == true)
	    	    	{
			    	 		if($(this).children("input[name='school-name']").length){
			    	 			var school = $(this).children("input[name='school-name']").val();
//			    	 			alert("Schol" + school);
			    	 		}
			    	 		
			    	 		if($(this).children("select[name='year']").val() > 0){
				 				var year = $(this).children("select[name='year']").val();
//				 				  alert('year' + year);
				 			}
			    	 		
			    	 		if($(this).children("select[name='degree-expected']").val()){
			    	 			var degree = $(this).children("select[name='degree-expected']").val();
//			    	 			  alert('degree' + degree);
			    	 		}
			    	 		
			    	 		if($(this).children("input[name='major']").length){
			    	 			var major = $(this).children("input[name='major']").val();
//			    	 			 alert('major' + major);
			    	 		}
			    	 		
			    			if($(this).children("select[name='degreeprogram']").val()){
			    	 			var degreep = $(this).children("select[name='degreeprogram']").val();
//			    	 			  alert('degreep' + degreep);
			    			}
			 
			    	 	  console.log(school+'-'+year);
			    	 	  
			    			var school = new School(); 
			    			school.set({schoolname: school, major: major, year: year, exoedtedDegree: degree, degreeProgram: degreep});
			    		 	schools.add(school);
			    		 	schools.create();
			    		 
	    	    	}
	    	 		
	    	 	});
	    	 	

	    		
      },
      
   
      continuetoclass:function (eventName) {
    	  eventName.preventDefault();        
    	  app.navigate("class", {trigger: true });
      },
 

});