 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/November/2012
	 * Description           : Backbone view for class view management
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.ClassView = Backbone.View.extend({
	
		events : {
			"click #save" : "saveClass",
			"click #continue" : "toProfile",
			"click a.addclass": "addClasses",
			"click a.legend-addclass" : "addSchool",
			"click .back" :"backToPrevious",
			"click .close-button" : "closeScreen",
			"keyup .class_code" :"populateClasses",
			"focus .class_code" : "populateClasses",
			"keyup .class_name" :"populateClassNames",
		    "focusin .class_name":"populateClassNames",
		    "change .all-schools" : "clearAllClasses"
	
		},
	
		initialize : function() {
			
			sClasses = 1;
			console.log('Initializing Class View');
			this.schools = new BS.SchoolCollection();
			this.schools.bind("reset", this.renderSchools, this);
			 
			this.schools.fetch({success: function(e) {  
	//			console.log(e);
			}});
			BS.classBack = false;
			this.classes = new BS.Class();
			this.source = $("#tpl-class-reg").html();
			this.template = Handlebars.compile(this.source);
			 
		},
		
		/**
		 * render class Info screen
		 */
		render : function(eventName) {
		    
			/* check whether its a edit class or not */
	    	var edit = "";
	    	if(localStorage["editClass"] == "true")
	    	{
	    		edit = "yes";
	        }
	    	else
	    	{
	    		edit = "";
	    	}
	    	
			var sCount = {
					"sCount" : sClasses,
					"schools": this.schools,
					"times" : BS.times,
					"edit" : edit
			}
			 
			$(this.el).html(this.template(sCount));
			return this;
		},
		
	 
		/**
		 * save/post class info details.
		 */
		saveClass : function(eventName) {
			
			eventName.preventDefault();
	
			$('#save-class-loader').css("display","block");
	
				var validate = $("#class-form").valid(); 
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
								if(data)
								{
									$('#save-class-loader').css("display","none");
									$('.studentno-popup-class').fadeOut("medium"); 
									BS.schoolBack = false;
									BS.regBack = false;
									BS.classBack = false;
									localStorage["regInfo"] ='';
							        localStorage["schoolInfo"] ='';
							        localStorage["classInfo"] ='';
							        localStorage["resistrationPage"] ='';
							        localStorage["editClass"] = "true";
							        localStorage["editProfile"] = "true";
							        
									// navigate to main stream page
									BS.AppRouter.navigate("streams", {trigger: true});
								}
								else
								{
									$('#save-class-loader').css("display","none");
									$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
				            		$('.error-msg').html("Invalid");
								}
								
							}
						});
					}
					else
					{
						$('#save-class-loader').css("display","none");
						$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
	            		$('.error-msg').html("Please fill all details for a class");
					}
					
			   }
				else
			    {    
					$('#save-class-loader').css("display","none");
					$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
	        		$('.error-msg').html("You must enter atleast one class");
			    }
	 
		},
	
	    /**
	     * render school name drop down
	     */
		renderSchools: function(e)
		{
			var select = '<select id="school-'+sClasses+'" class="large all-schools">';
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
			$('#class-continue-loader').css("display","block");
			eventName.preventDefault();
	        var self = this;
			var validate = $("#class-form").valid(); 
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
							if(data)
							{
								$('#class-continue-loader').css("display","none");
								$('.studentno-popup-class').fadeOut("medium"); 
								self.fetchSchools();
								localStorage["editProfile"] = "false";
								BS.classBack = true;
								localStorage["classInfo"] =JSON.stringify(data);
								
								// navigate to main stream page
								BS.AppRouter.navigate("profile", {trigger: true});
							}
							else
							{
								$('#save-class-loader').css("display","none");
								$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
				        		$('.error-msg').html("Invalid");
							}
						}
					});
			   }
				else
			    { 
					$('#save-class-loader').css("display","none");
					$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
	        		$('.error-msg').html("You must enter atleast one class");
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
	  	    
			var parentId =  $(dat).parents('fieldset').attr('id');
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
			
			this.schools.fetch({success: function(e) {  
			}});
			var selectAnother = '<select id="school-'+sClasses+'" class="large all-schools">'+options+'</select>'; 
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
					var cId;
					var sId =[];
					var classModel = new BS.Class();
						 
					if($('#class-code-' + i + '-' + j).val() !="" && $('#class-name-' + i + '-' + j).val() !="" && $('#date-started-' + i + '-' + j).val() != "")
					{
						classId++;
						if($('#h-class-name-'+ i + '-' + j).val())
						{
							cId = $('#h-class-name-'+ i + '-' + j).val();
						}
						else
						{
							cId = classId;
						}
						if($('#stream-id-'+ i + '-' + j).val())
						{
							sId.push({"id" : $('#stream-id-'+ i + '-' + j).val()});
						}
						else
						{
							sId.push({"id" : classId});
						}
						 
						classModel.set({
							
							schoolId :  $('#school-' + i).val(),
							id :  cId,
							classCode : $('#class-code-' + i + '-' + j).val(),
							classTime : $('#class-time-' + i + '-' + j).val(),
							className : $('#class-name-' + i + '-' + j).val(),
							startingDate : $('#date-started-' + i + '-' + j).val(),
							classType : $('#semester-' + i + '-' + j).val(),
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
		
		 /**
	     * back button function
	     */
	    backToPrevious :function(eventName){
	    	
	      eventName.preventDefault();
	      localStorage["schoolFromPrev"] = '';
	      BS.AppRouter.navigate("school", {trigger: true});
	      
	    },
	    
		
		/**
		 * populate  List of class codes - matching a class code
		 */
		populateClasses :function(eventName){
			
			var id = eventName.target.id;
			var self = this;
			BS.classCodes = []; 
			BS.selectedCode = $('#'+id).val(); 
			  
			var text = $('#'+id).val(); 
			var identity = id.replace(/[^\d.,]+/,'');
			var rowId = identity.replace(/([-]\d+)$/,'');
			var selectedSchoolId = $('#school-' + rowId).val() ;
			self.displayFiledsForCode(text,identity);
			
			/* post the text that we type to get matched classes */
			 $.ajax({
				type : 'POST',
				url : BS.autoPopulateClassesbyCode,
				data : {
					data : text,
					assosiatedSchoolId : selectedSchoolId
				},
				dataType : "json",
				success : function(datas) {
					var codes = '';
					BS.classInfo = datas;
					BS.classCodes = []; 
					_.each(datas, function(data) {
						BS.classCodes.push({
							label:data.classToReturn.classCode ,
							value:data.classToReturn.classCode ,
							id :data.classToReturn.id.id 
					    });
	
						 
			        });
					
					//set auto populate functionality for class code
					$('#'+id).autocomplete({
						    source: BS.classCodes,
						    select: function(event, ui) {
						    	
						    	var id = ui.item.id; 
						    	self.displayFiledsForCode(id,identity);
						    	
						    }
					 });
				}
			});
		},
	    
		/**
		 * display other field values- classCode auto complete
		 */
		displayFiledsForCode : function(value,identity)
		{ 
			 
			var classStatus = false; 
			var classTime ,className,date ,classType,schoolId,classId;
	        var datas = JSON.stringify(BS.classInfo);
	         
	        /* get details of selected class */
			 _.each(BS.classInfo, function(data) {
			 	 if(data.classToReturn.id.id == value)
			     {
					 classStatus = true;
					 classTime = data.classToReturn.classTime;
					 className = data.classToReturn.className;
					 date = data.classToReturn.startingDate;
					 classType = data.classToReturn.classType;
					 schoolId = data.classToReturn.schoolId.id;
					 classId = data.classToReturn.id.id;
					 streamId = data.classToReturn.streams[0].id;
			     }
				 
	        });
			 /* populate other class fields*/
			 if(classStatus == true)
			 {
				 this.classId = classId;
				 
				 $('#h-class-name-'+identity).val(classId);
				 $('#stream-id-'+identity).val(streamId);
				 $('#class-name-'+identity).val(className);
				 $('#class-time-'+identity).val(classTime);
				 $('#date-started-'+identity).val(date);
				 $('#semester-'+identity+' option:selected').attr('selected', false);
				 $('#semester-'+identity+' option[value="'+classType+'"]').attr('selected', 'selected');
				 $('#div-time-'+identity+' a span.selectBox-label').html(classTime);
							 
				 if(classType == "quarter")
				 {
					 $('#div-school-type-'+identity+' a span.selectBox-label').html("Quarter");
				 }
				 else
				 {
					 $('#div-school-type-'+identity+' a span.selectBox-label').html("Semester");
				 }
			 }
			 else
			 {
					 this.classId =1;
					 $('#student-number-'+identity).fadeOut("medium"); 
				 
			 }
			
		},
		 
	    /**
	     * auto populate class names - matching a class name
	     */
	    populateClassNames :function(eventName){
	    	
	    	var id = eventName.target.id;
	    	var self =this;
	    	BS.classNames = []; 
			BS.selectedName = $('#'+id).val(); 
			var text = $('#'+id).val(); 
			var identity = id.replace(/[^\d.,]+/,'');
			var rowId = identity.replace(/([-]\d+)$/,'');
			var selectedSchoolId = $('#school-' + rowId).val() ;
			self.displayFieldsForName(text,identity);
			
			/* post the text that we type to get matched classes */
			 $.ajax({
				type : 'POST',
				url : BS.autoPopulateClassesbyName,
				data : {
					data : text,
					assosiatedSchoolId : selectedSchoolId
				},
				dataType : "json",
				success : function(datas) {
					var codes = '';
					BS.classNames =[];
					BS.classNameInfo = datas;
					_.each(datas, function(data) {
	                    
						BS.classNames.push({
							status : "classPage",
							label:data.classToReturn.className + " - Students:" +data.usersMap.Student + " Educators:"+data.usersMap.Educator + " Professionals:"+data.usersMap.Professional,
							value:data.classToReturn.className ,
							id :data.classToReturn.id.id ,
							data:data.usersMap.Student,
							students : data.usersMap.Student,
							educators : data.usersMap.Educators,
						});
	
			        });
	 
					//set auto populate functionality for class code
					$('#'+id).autocomplete({
						    source: BS.classNames,
						    select: function(event, ui) {
						    	
						    	var id = ui.item.id
						    	self.displayFieldsForName(id,identity);
						    	
						    }
					 });
				}
			});
	    	
	    },
	    
	    /**
	     *  display other field values - className auto populate
	     */
	    displayFieldsForName : function(value,identity){
	    	 
	    	var classStatus = false; 
			var classTime ,className,date ,classType,schoolId,classId;
	        var datas = JSON.stringify(BS.classInfo);
	         
	        /* get details of selected class */
			 _.each(BS.classNameInfo, function(data) {
			 	 if(data.classToReturn.id.id == value)
			     {
			 		  
					 classStatus = true;
					 classTime = data.classToReturn.classTime;
					 classCode = data.classToReturn.classCode;
					 date = data.classToReturn.startingDate;
					 classType = data.classType;
					 schoolId = data.classToReturn.schoolId.id;
					 classId = data.classToReturn.id.id;
					 streamId = data.classToReturn.streams[0].id;
			     }
				 
	        });
			 /* populate other class fields*/
			 if(classStatus == true)
			 {    
				 this.classId = classId;
				 
				 $('#h-class-name-'+identity).val(classId);
				 $('#stream-id-'+identity).val(streamId);
				 $('#class-code-'+identity).val(classCode);
				 $('#date-started-'+identity).val(date);
				 $('#class-time-'+identity).val(classTime);
				 $('#semester-'+identity+' option:selected').attr('selected', false);
				 $('#semester-'+identity+' option[value="'+classType+'"]').attr('selected', 'selected');
				 if(classType == "quarter")
				 {
					 $('#div-school-type-'+identity+' a span.selectBox-label').html("Quarter");
				 }
				 else
				 {
					 $('#div-school-type-'+identity+' a span.selectBox-label').html("Semester");
				 }
				 $('#div-time-'+identity+' a span.selectBox-label').html(classTime);
			 }
			 else
			 {
				  
			     this.classId =1;
			     $('#student-number-'+identity).fadeOut("medium"); 
 
			 }
	    },
	    
	    /**
	     * close the screen
	     */
	    closeScreen : function(eventName){
	    	
	  	  eventName.preventDefault(); 
	  	  $(".star").hide();
	  	  BS.AppRouter.navigate('streams', {trigger: true});
	  	  
	    },
	    
	    /**
	     * clear all classe fields when we select another school
	     */
	    clearAllClasses : function(eventName){
	    	
	    	var Id = eventName.target.id;
	    	var identity = Id.replace(/[^\d.,]+/,'');
	    	for(var i = 1;i <= 3 ; i++)
	    	{
	    		 $('#class-name-'+identity+'-'+i).val("");
			     $('#class-code-'+identity+'-'+i).val("");
			     $('#ps-'+identity).fadeOut("medium"); 
				 $('#date-started-'+identity+'-'+i).val($.datepicker.formatDate('mm/dd/yy', new Date()));
				 $('#semester-'+identity+'-'+i+' option:selected').attr('selected', false);
				 $('#semester-'+identity+'-'+i+' option[value="semester"]').attr('selected', 'selected');
				 $('#div-school-type-'+identity+'-'+i+' a span.selectBox-label').html("Semester");
	    	}
	    },
	    
	    /**
	     *  fetch all schools 
	     */
	    fetchSchools : function(){
	    	
	    	localStorage["schoolList"] = '';
	    	 $.ajax({
	 			url : BS.schoolJson,
	 			dataType : "json",
	 			success : function(datas) {
	 				 
	 				var select = '';
	 				 _.each(datas, function(data) {
	 				        select+= '<option value ="'+data.assosiatedSchoolId.id+'">'+data.schoolName+'</option>';
	 				      });
	 				localStorage["schoolList"] =select;
	 			}
	 		});
	    }
	  
	});
