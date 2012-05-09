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
    
    /* save school info. */ 
    saveschool:function () {
    	
    	var schoolnames = new Array();
    	var  years = new Array();
    	var  degrees = new Array();
    	var majors = new Array();
    	var degreepgms = new Array();
    	var i;
    	
    	var schools = new SchoolCollection();
    	
    	var queryString = $('#school-form').serialize();
    	var fieldValuePairs = $('#school-form').serializeArray();
    	$.each(fieldValuePairs, function(index, fieldValuePair) {
    		
    	    if(fieldValuePair.name == "school-name")
    	    {
    	    	schoolnames.push(fieldValuePair.value)
    	    }
    	    if(fieldValuePair.name == "year")
    	    {
    	    	years.push(fieldValuePair.value)
    	    }
    	    if(fieldValuePair.name == "degree-expected")
    	    {
    	    	degrees.push(fieldValuePair.value)
    	    }
    	    if(fieldValuePair.name == "major")
    	    {
    	    	majors.push(fieldValuePair.value)
    	    }
    	    if(fieldValuePair.name == "degreeprogram")
    	    {
    	    	degreepgms.push(fieldValuePair.value)
    	    }
    	    
    	});
    	 var schoolcount = schoolnames.length;
    	 
    	 for(i=0; i < schoolcount; i++)
    	 {
    		 var schoolname =  schoolnames.shift();
             var major = majors.shift();
             var year = years.shift();
             var expedteddegree = degrees.shift();
             var degreeprogram =  degreepgms.shift();
             var school = new School();
             school.set({schoolname: schoolname, major: major, year: year, expedteddegree: expedteddegree, degreeprogram: degreeprogram});
             schools.add(school);
    		 
    	 }
    	 var collectiondata = JSON.stringify(schools);

	    	
	    	$.ajax({
                type: 'POST',
                url:"http://localhost/client/api.php",
                data:collectiondata,
                dataType:"json",
                success:function(data){
                	
	                var template = _.template( $("#tpl-success").html(), data );
	                $('#success').html(template);
	                
                }
        });
    	 
      },
      
   
      continuetoclass:function (eventName) {
    	  eventName.preventDefault();        
    	  app.navigate("class", {trigger: true });
      },
 

});