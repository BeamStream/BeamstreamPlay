window.ClassView = Backbone.View.extend({

	events : {
		"click #save" : "saveClass",
		"click #continue" : "toProfile",
		"click a.addclass": "addClasses",
		"click a.legend-addclass" : "addSchool",
		
		
		
//		"click #add-class" : "addClasses",
//		"change #school" : "addAnotherSchool",
	},

	initialize : function() {
		
		/* get local stored School details  and save school names to an array*/
		var localStorageKey = "registration";
		var data = localStorage.getItem(localStorageKey);
		this.schools = jQuery.parseJSON(data);

		
		this.classes = new Class();
		console.log('Initializing Class View');
//		this.template = _.template($("#tpl-class-reg").html());
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
		    
			/* post data with school and class details */
			$.ajax({
				type : 'POST',
				url : "http://localhost/client/api.php",
				data : {
					data : classDetails
				},
				dataType : "json",
				success : function(data) {
					var source = $("#tpl-success").html();
					var template = Handlebars.compile(source);
					$("#success").html(template(data));
				}
			});
	   }
		else
	    {    
			console.log($.validationEngine.defaults.autoHidePrompt);
	    }
		

	},

	/**
	 * render class Info screen
	 */
	render : function(eventName) {
		
		var sCount = {
				"sCount" : sClasses,
				"schools": this.schools 
		}
		$(this.el).html(this.template(sCount));
		return this;
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
				url : "http://localhost/client/api.php",
				data : {
					data : classDetails
				},
				dataType : "json",
				success : function(data) {
					app.navigate("profile", {
						trigger : true,
						replace : true
					});
				}
			});
	   }
		else
	    { 
	      	 
	    }
	},

	/**
	 * Add 3 classes for schools
	 */
	addClasses : function(eventName) {
		
		eventName.preventDefault();
		var id = eventName.target.id;
  	    var dat='#'+id;
		var parentId =  $(dat).parents('fieldset').attr('id')
		var parent = '#'+parentId;
		var sCount = {
				"sCount" : sClasses
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
    	$('a.legend-addclass').hide();
    	var sCount = {
				"sCount" : sClasses,
				"schools": this.schools
		}
    	var source = $("#add-school").html();
		var template = Handlebars.compile(source);
		$('#class-form').append(template(sCount));
        $('#another-school').hide();
        $(".modal select:visible").selectBox();
	},
	

	/**
	 * get class details from the form
	 * 
	 * @return Class details as JSON string
	 */

	getClassInfo : function() {

		var i,j;
		var classes = new ClassCollection();
		
		for (i = 1; i <= sClasses; i++) 
		{
			for(j=1 ; j<=3 ; j++)
			{
				var classModel = new Class();
				classModel.set({
					id : j,
					schoolId :  $('#school-' + i).val(),
					classCode : $('#class-code-' + i + '-' + j).val(),
					classTime : $('#class-time-' + i + '-' + j).val(),
					className : $('#class-name-' + i + '-' + j).val(),
					startDate : $('#date-started-' + i + '-' + j).val(),
					classType : $('#semester-' + i + '-' + j).val()
				});
				classes.add(classModel);
			}
			 
		}

		var classDetails = JSON.stringify(classes);

		return classDetails;
	},

});