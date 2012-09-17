BS.NewSchoolView = Backbone.View.extend({

	events: {
		"change select.graduated" : "showFields",
		"change select.degreepgm" : "addOtherDegree",
		"click #close-screen" : "closeScreen",
		"click #save": "saveNewSchool",
		"keyup .school" : "populateSchools",
	    "focusin .school" : "populateSchools",
	 },
	
    initialize:function () {
    	
        console.log('Initializing New School View');
		this.source = $("#one-new-school").html();
		this.template = Handlebars.compile(this.source);
    },

     
    
    /**
     * render school Info screen
     */
    render:function (eventName) {
    	$(this.el).html(this.template);
        return this;
//        $('#new-school-view').html(this.template);
        
    },

    
    /**
     * to display 'degree expected' or 'date' field
     */
     showFields:function (eventName) {
       
   	      var id = eventName.target.id;
   	      var dat='#'+id;
		  var value = $('#graduated').val();
		  if(value == "attending" || value == "no")
		  {
				$('#cal').hide();
				$('#degree-exp').show();
				$(".modal select:visible").selectBox();
		  }
		  else if(value == "yes")
		  {
				$('#degree-exp').hide();
				
				$('.datepicker').css('z-index','99999');
				$('#cal').show();
				$('.modal .datepicker:visible').datepicker();
		  }
		  else
		  {
				$('#degree-exp').hide();
				$('#cal').hide();
		  }
		  
   	     
     },
	      
     /**
      * add text box field a enter degree when we choose 'Other' from  Degre Program  
      */
     addOtherDegree:function(eventName){
   	  var id = eventName.target.id;
   	  if($('#'+id).val()== "Other")
   	  {
   		  $('#other-degrees').show();
   	  }
   	  else
   	  {
   		  $('#other-degrees').hide();
   	  }
   	  
   	  
     },
     closeScreen :function(eventName){
    	 eventName.preventDefault(); 
    	 $('#new-school-view').children().detach(); 
    	 var classStream = new BS.ClassStreamView();
    	 classStream.getSchools();
     },
     /**
      * save new school info
      */
     saveNewSchool :function(eventName){
    	 eventName.preventDefault(); 
    	 /* validation on other fields */
     	var validate = jQuery('#new-school-form').validationEngine('validate');
     	if(validate == true)
     	{   
     		/* put validation on "Graduated?" filed */
         	var gStatus = true;
         	$('select.graduated').each(function(index,item) {
         		  
         		 var Id='#'+item.id;
         	     if($(Id).val() == "")
         	     {
         	       gStatus = false;
         	        
         	     }
         	}); 
         	if(gStatus == false)
         	{
         		$('#error').html("Please select your Graduation");
         		
         	}
         	else
         	{
             	var  schoolDetails = this.getSchoolInfo();
             	$.ajax({
                     type: 'POST',
                     url:BS.saveSchool,
                     data:{data:schoolDetails},
                     dataType:"json",
                     success:function(data){
                    	 $(".star").hide();
         				 // navigate to main stream page
                    	 $('#new-school-view').children().detach();;
//                    	 
                    	_.each(data, function(info) {
//                    	   $('#for-new-school').show();
//                    	   $('#new-school').val(info.schoolName);
//                      	   $('#new-school-id').val(info.assosiatedSchoolId.id);
                      	   var classStream = new BS.ClassStreamView();
                      	   classStream.getSchools();

       		    	     });
                         
                     }
                  });
         	}
     	}
     	else
     	{
     		$('#error').html("Fields are not completely filled");
     	}
     	
     },
     /**
      * get new school details from the form 
      * @return School details as  JSON string
      */
     
     getSchoolInfo:function (eventName) {
   	    
	    	  var schoolDetails = new Array();
	    	  var i;
	    	  var schoolId ='';
	    	  var count = current;
	    	  var schools = new BS.SchoolCollection();
	    	
	    	  
	    	     var degreeexp,degdate,otherDegree;
	
		    	  /* display degree expected when selecting graduated as 'attending' or 'no' */
		    	  if($('#graduated').val()== "attending" || $('#graduated').val()== "no")
		    	  {
			    	  degreeexp = $('#degree-expected').val();
			    	  degdate = "";
		    	  }
		    	  /* display degree expected when selecting graduated as 'yes' */
		    	  else if($('#graduated').val() == "yes")
		    	  {
			    	  degreeexp = "";
			    	  degdate = $('#calendar').val();
			    	  
		    	  }
		    	  else
		    	  {
			    	  graduated = "";
			    	  degreeexp= "";
		    	  }
		    	  if($('#degreeprogram').val() == "Other")
		    	  {
		
		    		  	otherDegree = $('#other-degree').val();
		
		    	  }
		    	  else
		    	  {
		    		  otherDegree ="";
		    	  }
	
	
		    	  var school = new BS.School();
		    	  // school.set({id:i,schoolName: $('#school-name-'+i).val(),assosiatedSchoolId:assosiatedSchoolId,year:{name: $('#year-'+i).val()}, degreeExpected:{name: degreeexp}, major: $('#major-'+i).val(), degree:{name: $('#degreeprogram-'+i).val() }, graduated: $('#graduated-'+i).val(), graduationDate: degdate ,otherDegree: otherDegree});
		    	  school.set({id:1,schoolName: $('#school-name').val(),assosiatedSchoolId:1,year:{name: $('#year').val()}, degreeExpected:{name: degreeexp}, major: $('#major').val(), degree:{name: $('#degreeprogram').val() }, graduated: $('#graduated').val(), graduationDate: degdate ,otherDegree: otherDegree});
		
		    	  schools.add(school);
	    	  
	    	  var schoolinfo = JSON.stringify(schools);
	    	  return schoolinfo;
   	  },
   	/**
       * auto populate school
       */
      
      populateSchools :function(eventName){
      	eventName.preventDefault();  
     	    var id = eventName.target.id;
     	    var dat='#'+id;
     	    var currentid = $(dat).closest('fieldset').attr('id');
     	    BS.selectedSchool = $(dat).val(); 
     	    BS.allSchools = []; 
      	
      	/* get all schools of a user */
  		 $.ajax({
  			type : 'GET',
  			url : BS.autoPopulateSchools,
  			 
  			dataType : "json",
  			success : function(datas) {
  				 
  				BS.allSchoolInfo = datas;
  				_.each(datas, function(data) {
  					 BS.allSchools.push(data.schoolName);
  		        });
  				 
  				//set auto populate functionality for class code
  				$(dat).autocomplete({
  				    source: BS.allSchools
  			 });
  			 
  			}
  		});
      	
      },
});
