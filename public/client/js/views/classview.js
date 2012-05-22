window.ClassView = Backbone.View.extend({

	events : {
		"click #save" : "saveClass",
		"click #continue" : "toProfile",
		"click a.addclass": "addClasses",
		"click a.legend-addclass" : "addSchool",

	},

	initialize : function() {
		
		console.log('Initializing Class View');
		
		/* get local stored School details  and save school names to an array*/
		var localStorageKey = "registration";
		var data = localStorage.getItem(localStorageKey);
		this.schools = jQuery.parseJSON(data);

		this.classes = new Class();
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
				url : "http://localhost:9000/class",
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
			console.log("validation: " + $.validationEngine.defaults.autoHidePrompt);
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
				url : "http://localhost:9000/class",
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
		$('a.addclass').hide();
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

		var classes = new ClassCollection();
		for (var i=1; i<=sClasses; i++) 
		{
			for(var j=1; j<=3; j++)
			{
				var classModel = new Class();
				classModel.set({
					
					schoolId :  $('#school-' + i).val(),
					id : j,
					classCode : $('#class-code-' + i + '-' + j).val(),
					classTime : $('#class-time-' + i + '-' + j).val(),
					className : $('#class-name-' + i + '-' + j).val(),
					startingDate : $('#date-started-' + i + '-' + j).val(),
					classType : $('#semester-' + i + '-' + j).val()
				});
				classes.add(classModel);
			}
		}
		
		var classDetails = JSON.stringify(classes);
		return classDetails;
	},

});