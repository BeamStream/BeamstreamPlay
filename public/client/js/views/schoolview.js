BS.SchoolView = Backbone.View.extend({

	events: {
	      "click #save": "saveSchool",
	      "click #continue": "continueToClass",
	      "click a.legend-add": "addSchools",
	      "change select.graduated": "showFields"
	    },
	
    initialize:function () {
    	
        console.log('Initializing School View');
        this.template= _.template($("#tpl-school-reg").html());
    },

    /**
     * render school Info screen
     */
    render:function (eventName) {
         
        $(this.el).html(this.template());
        return this;
    },
    
    /** TODO
     * save/post school info details.
     */
    saveSchool:function (eventName) {
    	eventName.preventDefault();  
    	var  schoolDetails = this.getSchoolInfo();
    	$.ajax({
            type: 'POST',
            url:"http://localhost:9000/detailed_reg",
//            url : "http://localhost/client2/api.php",
            data:{data:schoolDetails},
            dataType:"json",
            success:function(data){

				 // navigate to main stream page
            	BS.AppRouter.navigate("streams", {trigger: true, replace: true});

                
            }
         });
      },
      
      
      /** TODO
       *  function to navigate to Class Registration when click on 'Continue' button 
       */
      continueToClass:function (eventName) {
    	  
    	  eventName.preventDefault();   
    	  var  schoolDetails = this.getSchoolInfo();
      	  
    	  $.ajax({
              type: 'POST',
              url:"http://localhost:9000/detailed_reg",
//              url : "http://localhost/client2/api.php",
              data:{data:schoolDetails},
              dataType:"json",
              success:function(data){
            	  
            	  BS.AppRouter.navigate("class", {trigger: true, replace: true});
            	  
              }
           });
      },
      
      
     /**
      *  add another school details 
      */
      addSchools:function (eventName) {

          eventName.preventDefault();
      	  current ++;  //current keeps track of how many schools we have
      	  
      	  var strToAdd = '<fieldset id="'+current+'" ><legend class="legend legend-add">Another school</legend><div class="school-registration"><div class="form-row"><div class="element"><label for="school-name-'+current+'">School name</label><input type="text" id="school-name-'+current+'" name="school-name-'+current+'" class="span3"></div><div class="element"><label for="year">Year</label><select name="year-'+current+'" id="year-'+current+'" class="span2"><option value="Freshman">Freshman</option><option value="Sophomore">Sophomore</option><option value="Junior">Junior</option><option value="Senior">Senior</option><option value="Graduated(Master\'s)>Graduated(Master\'s)</option> <option value="Graduated(Phd)">Graduated(Phd)</option><option value="Other">Other</option></select></div><div class="element"><label for="degree-program-'+current+'">Degree program</label><select name="degreeprogram-'+current+'" id="degreeprogram-'+current+'" class="span2"><option value="Assosiates(AA)">Assosiates(AA)</option><option value="Bachelor\'s">Bachelor\'s</option><option value="Master\'s">Master\'s</option><option value="Doctorate(Phd)">Doctorate(Phd)</option><option value="Other">Other</option></select></div></div><div class="form-row"><div class="element"><label for="major-'+current+'">Major</label><input type="text" name="major-'+current+'" id="major-'+current+'" class="span3" placeholder="Your Major"></div><div class="element"><label for="graduated" name="graduated-'+current+'">Graduated?</label><select name="graduated" id="graduated-'+current+'" class="graduated span2" ><option> </option><option value="attending">Still Attending</option><option value="yes">Yes</option><option value="no">No</option></select></div><div class="element" id="cal-'+current+'"><label for="calendar-'+current+'">Calendar</label><input class="span2 datepicker cal" type="text" value="01/05/2011" id="calendar-'+current+'" name="calendar-'+current+'"/></div><div class="element" ><div class="element" id="degree-exp-'+current+'"><label for="degree-expected-'+current+'">Degree expected</label><select id="degree-expected-'+current+'"  name="degree-expected-'+current+'" class="span3" ><option value="Winter 2012">Winter 2012</option><option value="Summer 2013">Summer 2013</option><option value="Winter 2013">Winter 2013</option><option value="Summer 2014">Summer 2014</option><option value="Winter 2014">Winter 2014</option><option value="Summer 2015">Summer 2015</option><option value="Winter 2015">Winter 2015</option><option value="No Degree Expected">No Degree Expected</option></select></div></div> </div></div></fieldset>';

      	  $("a.legend-add").before(strToAdd);
          $('#degree-exp-'+current).hide();
          $('#cal-'+current).hide();
          
          $(".modal select:visible").selectBox();
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
	      	
	      	var schools = new BS.SchoolCollection();
	      	for(i=1; i <= current; i++)
	      	{
		      	var degreeexp,degdate;
		      		
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
		   		var school = new BS.School();
		      		
		   		school.set({id:i,schoolName: $('#school-name-'+i).val(),year:{name: $('#year-'+i).val()}, degreeExpected:{name: degreeexp}, major: $('#major-'+i).val(), degree:{name: $('#degreeprogram-'+i).val()}, graduated: $('#graduated-'+i).val(), graduationDate: degdate });
		
		        schools.add(school);
	         }
	         var schoolinfo = JSON.stringify(schools);
	         return schoolinfo;
	      },

});
