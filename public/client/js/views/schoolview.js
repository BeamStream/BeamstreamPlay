BS.SchoolView = Backbone.View.extend({

	events: {
	      "click #save": "saveSchool",
	      "click #continue": "continueToClass",
	      "click a.legend-add" : "addSchools",
	      "change select.graduated" : "showFields",
	      "change select.degreepgm" : "addOtherDegree",
	      
	      "keyup .school" : "populateSchools",
	      "focusin .school" : "populateSchools",
	      "click .close-button" : "closeScreen",
	      "click .back-button" :"backToPrevious"
	       
	    },
	
    initialize:function () {
    	
        console.log('Initializing School View');
        BS.schoolBack = false;
        //this.template= _.template($("#tpl-school-reg").html());
		this.source = $("#tpl-school-reg").html();
		this.template = Handlebars.compile(this.source);
    },

     
    
    /**
     * render school Info screen
     */
    render:function (eventName) {
    	/* check whether its a edit school or not */
    	var edit = "";
    	if(BS.editSchool)
    	{
    		edit = "yes";
        }
    	else
    	{
    		edit = "";
    	}
         
        $(this.el).html(this.template({"edit" : edit}));
        return this;
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
     /** TODO
     * save/post school info details.
     */
    saveSchool:function (eventName) {
    	  
    	eventName.preventDefault();  
    	 
    	/* validation on other fields */
    	var validate =$("#school-form").valid();
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
                    	if(data.status)
                    	{
                    		if(data.status == "Failure")
      	   					  $('#error').html(data.message);
                    	}
                    	else
                    	{
	                    	BS.schoolBack = false;
	          			    BS.regBack = false;
	          			    BS.classBack = false;
	          			    localStorage["regInfo"] ='';
	          			    localStorage["schoolInfo"] ='';
	          			    localStorage["classInfo"] ='';
	                    	BS.schoolFromPrev ='';
	                    	$(".star").hide();
	        				 // navigate to main stream page
	                    	BS.AppRouter.navigate("streams", {trigger: true});
                    	}
                    	 
        
                        
                    }
                 });
        	}
    	}
    	else
    	{
    		$('#error').html("Fields are not completely filled");
    	}
     
      },
      
      /** TODO
       *  function to navigate to Class Registration when click on 'Continue' button 
       */
      continueToClass:function (eventName) {
    	  
    	 eventName.preventDefault();  
    	 var validate =$("#school-form").valid();
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
	            	if(data.status)
                  	{
                  		if(data.status == "Failure")
    	   					  $('#error').html(data.message);
                  	}
                  	else
                  	{
	            	 
                  	  localStorage["schoolInfo"] =JSON.stringify(data); 
	            	  // for back button functionality
	            	  BS.schoolBack = true;
	            	  BS.editClass = false;
	            	  BS.schoolFromPrev = '';
	            	  $(".star").hide();
	            	  BS.AppRouter.navigate("class", {trigger: true});
	            	  
                  	}
                  	 
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
      *  add another school details 
      */
      addSchools:function (eventName) {

          eventName.preventDefault();
      	  current ++;  //current keeps track of how many schools we have
      	  
      	  var strToAdd = '<fieldset id="'+current+'" ><legend class="legend legend-add">Another school</legend><div class="school-registration"><div class="form-row"><div class="element"><label for="school-name-'+current+'" id="school-id-'+current+'" value="">School name </label><input type="text" id="school-name-'+current+'" name="school-name-'+current+'" class="required span3 school" placeholder="School Name"></div><div class="element"><label for="year">Year</label><select name="year-'+current+'" id="year-'+current+'" class="span2"><option value="Freshman">Freshman</option><option value="Sophomore">Sophomore</option><option value="Junior">Junior</option><option value="Senior">Senior</option><option value="Graduated(Master\'s)>Graduated(Master\'s)</option> <option value="Graduated(Phd)">Graduated(Phd)</option><option value="Other">Other</option></select></div><div class="element" ><label for="degree-program-'+current+'">Degree program</label><select name="degreeprogram-'+current+'" id="degreeprogram-'+current+'" class="degreepgm span2"><option value="Assosiates(AA)">Assosiates(AA)</option><option value="Bachelor\'s">Bachelor\'s</option><option value="Master\'s">Master\'s</option><option value="Doctorate(Phd)">Doctorate(Phd)</option><option value="Other">Other</option></select></div><div class="element" id="other-degrees-'+current+'"><label for="other-degree">Degree </label><input type="text" name="other-degree-'+current+'" id="other-degree-'+current+'" class="required small" placeholder="Degree"></div></div><div class="form-row"><div class="element"><label for="major-'+current+'">Major </label><input type="text" name="major-'+current+'" id="major-'+current+'" class="required span3" placeholder="Your Major"></div><div class="element"><label for="graduated" name="graduated-'+current+'">Graduated? </label><select name="graduated" id="graduated-'+current+'" class="required graduated span2" ><option> </option><option value="attending">Still Attending</option><option value="yes">Yes</option><option value="no">No</option></select></div><div class="element" id="cal-'+current+'"><label for="calendar-'+current+'">Calendar</label><input class="span2 datepicker cal" type="text" value="01/05/2011" id="calendar-'+current+'" name="calendar-'+current+'"/></div><div class="element" ><div class="element" id="degree-exp-'+current+'"><label for="degree-expected-'+current+'">Degree expected</label><select id="degree-expected-'+current+'"  name="degree-expected-'+current+'" class="span3" ><option value="Winter 2012">Winter 2012</option><option value="Summer 2013">Summer 2013</option><option value="Winter 2013">Winter 2013</option><option value="Summer 2014">Summer 2014</option><option value="Winter 2014">Winter 2014</option><option value="Summer 2015">Summer 2015</option><option value="Winter 2015">Winter 2015</option><option value="No Degree Expected">No Degree Expected</option></select></div></div> </div></div></fieldset>';

      	  $("a.legend-add").before(strToAdd);
          $('#degree-exp-'+current).hide();
          $('#cal-'+current).hide();
          $('#other-degrees-'+current).hide();
          
          $(".modal select:visible").selectBox();
          $('.datepicker').css('z-index','99999');
          $('.modal .datepicker:visible').datepicker();
          $(".modal").addClass('modal-pull-top');
      },
      
      
     /**
      * to display 'degree expected' or 'date' field
      */
      showFields:function (eventName) {
         
    	  var id = eventName.target.id;
    	  var dat='#'+id;
		  var currentid = $(dat).closest('fieldset').attr('id');
		  var value = $('#graduated-'+currentid).val();
		  if(value == "attending" || value == "no")
		  {
				$('#cal-'+currentid).hide();
				$('#degree-exp-'+currentid).show();
				$(".modal select:visible").selectBox();
		  }
		  else if(value == "yes")
		  {
				$('#degree-exp-'+currentid).hide();
				
				$('.datepicker').css('z-index','99999');
				$('#cal-'+currentid).show();
				$('.modal .datepicker:visible').datepicker();
		  }
		  else
		  {
				$('#degree-exp-'+currentid).hide();
				$('#cal-'+currentid).hide();
		  }
		  
    	     
      },
      
      /**
       * get school details from the form 
       * @return School details as  JSON string
       */
      
      getSchoolInfo:function (eventName) {
    	    
	    	  var schoolDetails = new Array();
	    	  var i;
	    	  var schoolId ='';
	    	  var count = current;
	    	  var schools = new BS.SchoolCollection();
	    	  console.log("current" + current);
	    	  console.log("BS.schoolNum" + BS.schoolNum);
	    	  if(BS.schoolNum)
	    	  {
	    		  if(BS.schoolNum <= current)
		    		  count = current;
		    	  else
		    		  count = BS.schoolNum-1;
	    	  }
	    	  
	    	  for(i=1; i <= count; i++)
	    	  {
	    	     var degreeexp,degdate,otherDegree;
	
		    	  /* display degree expected when selecting graduated as 'attending' or 'no' */
		    	  if($('#graduated-'+i).val()== "attending" || $('#graduated-'+i).val()== "no")
		    	  {
			    	  degreeexp = $('#degree-expected-'+i).val();
			    	  degdate = "";
		    	  }
		    	  /* display degree expected when selecting graduated as 'yes' */
		    	  else if($('#graduated-'+i).val() == "yes")
		    	  {
			    	  degreeexp = "";
			    	  degdate = $('#calendar-'+i).val();
			    	  
		    	  }
		    	  else
		    	  {
			    	  graduated = "";
			    	  degreeexp= "";
		    	  }
		    	  if($('#degreeprogram-'+i).val() == "Other")
		    	  {
		
		    		  	otherDegree = $('#other-degree-'+i).val();
		
		    	  }
		    	  else
		    	  {
		    		  otherDegree ="";
		    	  }
	
	    	     /* get Id of auto populated schools */
		    	  var sId = '';
		    	   
		    	  _.each(BS.allSchoolInfo, function(data) {
			    	  if(data.schoolName == $('#school-name-'+i).val())
			    	  {
			    		  sId = data.id.id;
			    		 
			    	  }
		
		    	  	});
 
		    	  if(sId)
		    	  {
		    	    assosiatedSchoolId = sId;
//		    	    $('#school-id-'+i).attr('value',assosiatedSchoolId);
		    	  }
		    	  else if($('#associatedId-'+i).attr('value'))
		    	  {
		    		  assosiatedSchoolId = $('#associatedId-'+i).attr('value');
		    	  }
		    	  else
		    	  {
		    		  assosiatedSchoolId = 1;
		    	  }
		    	  if($('#school-id-'+i).attr('value'))
		    	  {
		    		  
		    		  schoolId = $('#school-id-'+i).attr('value');
		    		 
		    	  }
		    	  else
		    	  {
		    		  schoolId = i;
		    		  
		    	  }
	
	
		    	  var school = new BS.School();
		    	  // school.set({id:i,schoolName: $('#school-name-'+i).val(),assosiatedSchoolId:assosiatedSchoolId,year:{name: $('#year-'+i).val()}, degreeExpected:{name: degreeexp}, major: $('#major-'+i).val(), degree:{name: $('#degreeprogram-'+i).val() }, graduated: $('#graduated-'+i).val(), graduationDate: degdate ,otherDegree: otherDegree});
		    	  school.set({id:schoolId,schoolName: $('#school-name-'+i).val(),assosiatedSchoolId:assosiatedSchoolId,year:{name: $('#year-'+i).val()}, degreeExpected:{name: degreeexp}, major: $('#major-'+i).val(), degree:{name: $('#degreeprogram-'+i).val() }, graduated: $('#graduated-'+i).val(), graduationDate: degdate ,otherDegree: otherDegree});
		
		
		    	  schools.add(school);
	    	  }
	    	  var schoolinfo = JSON.stringify(schools);
	    	  return schoolinfo;
    	  },
	      /**
	       * add text box field a enter degree when we choose 'Other' from  Degre Program  
	       */
	      addOtherDegree:function(eventName){
	    	  var id = eventName.target.id;
	    	  var currentid = $('#'+id).closest('fieldset').attr('id');
	    	  if($('#'+id).val()== "Other")
	    	  {
	    		  $('#other-degrees-'+currentid).show();
	    	  }
	    	  else
	    	  {
	    		  $('#other-degrees-'+currentid).hide();
	    	  }
	    	  
	    	  
	      },
	      /**
	       * back button function
	       */
	      backToPrevious :function(eventName){
	    	  eventName.preventDefault(); 
	    	  $(".star").hide();
              if(BS.resistrationPage == "basic")
              {
            	  var token = BS.token;
            	  var iam = BS.iam;
            	  var email = BS.email;
            	  var navUrl = 'basicRegistration/token/'+token+'/iam/'+iam+'/emailId/'+email;
            	  
            	  BS.AppRouter.navigate(navUrl, {trigger: true});
              }
              if(BS.resistrationPage == "media")
              {
            	  var t = "basicRegistration";
            	  BS.AppRouter.navigate(t, {trigger: true});
              }
	    	 
	      },
	      
	      closeScreen : function(eventName){
	    	  eventName.preventDefault(); 
	    	  $(".star_position").html('');
	    	  BS.AppRouter.navigate('streams', {trigger: true});
	      }
});
