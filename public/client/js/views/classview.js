BS.ClassView = Backbone.View.extend({

	events : {
		"click #save" : "saveClass",
		"click #continue" : "toProfile",
		"click a.addclass": "addClasses",
		"click .datepicker" :"setIndex",
		"click a.legend-addclass" : "addSchool",
		"click .back" :"backToPrevious",
		"click .close-button" : "closeScreen"

	},

	initialize : function() {
		
		sClasses = 1;
		console.log('Initializing Class View');
//		BS.saveStatus = false;
		this.schools = new BS.SchoolCollection();
		this.schools.bind("reset", this.renderSchools, this);
		 
		this.schools.fetch({success: function(e) {  
//			console.log(e);
		}});
 
		this.classes = new BS.Class();
		this.source = $("#tpl-class-reg").html();
		this.template = Handlebars.compile(this.source);
	 
	},

 
	/**
	 * save/post class info details.
	 */
	saveClass : function(eventName) {
		
		eventName.preventDefault();
 
			var validate = jQuery('#class-form').validationEngine('validate');
			 
			if(validate == true)
		    {
				$('#save').attr('data-dismiss','modal');
				var classDetails = this.getClassInfo();
				if(classDetails != false)
				{
					/* post data with school and class details */
					$.ajax({
						type : 'POST',
						url : BS.saveClass,
						data : {
							data : classDetails
						},
						dataType : "json",
						success : function(data) {
							if(data.status == "Success")
							{
								// navigate to main stream page
								BS.AppRouter.navigate("streams", {trigger: true});
							}
							else
							{
								$('#error').html(data.message);
							}
							
						}
					});
				}
				else
				{
					$('#error').html("Please fill all details for a class");
				}
				
		   }
			else
		    {    
				console.log("validation: " + $.validationEngine.defaults.autoHidePrompt);
				$('#error').html("You must enter atleast one class");
		    }
 
	},

	/**
	 * render class Info screen
	 */
	render : function(eventName) {
	    
		var sCount = {
				"sCount" : sClasses,
				"schools": this.schools,
				"times" : BS.times
		}
		 
		$(this.el).html(this.template(sCount));
		 
		return this;
	},
	
	
    /**
     * render school name drop down
     */
	renderSchools: function(e)
	{
		var select = '<select id="school-'+sClasses+'" class="large">';
		 _.each(e.models, function(model) {
		        var name = model.get('schoolName');
		        var id = model.get('assosiatedSchoolId')
		          
		        options+= '<option value ="'+id.id+'">'+name+'</option>';
		        select+= '<option value ="'+id.id+'">'+name+'</option>';
            
		      });
		 select+= '</select>';
		 
		 $('#school-list-'+sClasses).html(select);
		 $(".modal select:visible").selectBox();
		 
	},
	
	/**
	 * navigate to profile screen
	 */
	toProfile : function(eventName) {

		console.log("to profile");
		eventName.preventDefault();
 
			var validate = jQuery('#class-form').validationEngine('validate');
			if(validate == true)
		    {
				var classDetails = this.getClassInfo();
		       
				/* post data with school and class details */
				$.ajax({
					type : 'POST',
					url : BS.saveClass,
					data : {
						data : classDetails
					},
					dataType : "json",
					success : function(data) {
						if(data.status == "Success")
						{
							// navigate to main stream page
							BS.AppRouter.navigate("profile", {trigger: true});
						}
						else
						{
							$('#error').html(data.message);
						}
					}
				});
		   }
			else
		    { 
				console.log("validation: " + $.validationEngine.defaults.autoHidePrompt);
				$('#error').html("You must enter atleast one class");
		    }
 
	},

	/**
	 * Add 3 classes for schools
	 */
	addClasses : function(eventName) {
		
		eventName.preventDefault();
 
		var id = eventName.target.id;
		var dat='#'+id;
		$(dat).hide();
  	    
		var parentId =  $(dat).parents('fieldset').attr('id')
		var parent = '#'+parentId;
		
		var sCount = {
				"sCount" : sClasses,
				"times" : BS.times
		}
		
		var source = $("#classes").html();
		var template = Handlebars.compile(source);
		$(parent).append(template(sCount));
		$(".modal select:visible").selectBox();
	    $('.modal .datepicker').datepicker();
 
	},
	
	/**
	 * Add classes for another school
	 */
	addSchool : function(eventName) {
		
		 
		sClasses++;
		eventName.preventDefault();
		
		
		var selectAnother = '<select id="school-'+sClasses+'" class="large">'+options+'</select>'; 
		 
    	$('a.legend-addclass').hide();
    	
    	var sCount = {
				"sCount" : sClasses,
		}
    	 
    	var source = $("#add-school").html();
		var template = Handlebars.compile(source);
		$('#class-form').append(template(sCount));
		
		$('#school-list-'+sClasses).html(selectAnother);
        $('#another-school').hide();
        $(".modal select:visible").selectBox();
	},
	

	/**
	 * get class details from the form
	 * 
	 * @return Class details as JSON string
	 */

	getClassInfo : function() {
        var classId = 0;
        BS.invalidItem ='';
        var validClass = true;
		var classes = new BS.ClassCollection();
		for (var i=1; i<=sClasses; i++) 
		{
			for(var j=1; j<=3; j++)
			{
				var classModel = new BS.Class();
				
				if($('#class-code-' + i + '-' + j).val() !="" && $('#class-name-' + i + '-' + j).val() !="" && $('#date-started-' + i + '-' + j).val() != "")
				{
					classId++;
					classModel.set({
						
						schoolId :  $('#school-' + i).val(),
						id : classId ,
						classCode : $('#class-code-' + i + '-' + j).val(),
						classTime : $('#class-time-' + i + '-' + j).val(),
						className : $('#class-name-' + i + '-' + j).val(),
						startingDate : $('#date-started-' + i + '-' + j).val(),
						classType : $('#semester-' + i + '-' + j).val()
					});
					classes.add(classModel);
				}
				else if($('#class-code-' + i + '-' + j).val() !="" && $('#class-name-' + i + '-' + j).val() !="")
				{  
					validClass = false;
					BS.invalidItem = "date-started-" + i + "-" + j ;
				}
				else
				{
					console.log("Not selected any fileds");
				}
			}
		}
		if(validClass == true)
		{
			var classDetails = JSON.stringify(classes);
			return classDetails;
		}
		else
		{
			return false;
		}
		
	},
	
	setIndex:function(){
		 
		$('.datepicker').css('z-index','9999');
	},
	
	 /**
     * back button function
     */
    backToPrevious :function(eventName){
      eventName.preventDefault();
      BS.AppRouter.navigate("school", {trigger: true});
    },
    
    /**
     * close class screen
     */
    closeScreen :function(eventName){
  	  eventName.preventDefault();  
      BS.AppRouter.navigate("streams", {trigger: true});
    }
	
	
	

});
