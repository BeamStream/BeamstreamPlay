
BS.ClassStreamView = Backbone.View.extend({

	events : {
       "keyup #class-code" : "populateClasses",
       "click .datepicker" :"setIndex",
       "focus #class-code" : "populateClasses",
       "click #createClass" : "createClass",
       "click #joinClass" :"joinClass",
       "click #add-tags" : "addTags",
       "click #close-stream" : "closeScreen",
       "keyup .class_name" :"populateClassNames",
       "focusin .class_name":"populateClassNames",
       "change select#schools" : "showNewSchoolField"
	},

	initialize : function() {
		console.log('Initializing Class Stream View');
		BS.newClassCode = false;
		BS.newClassName = false;
		this.source = $("#tpl-class-stream").html();
		this.template = Handlebars.compile(this.source);
		
	},
	 

	/**
	 * render class Info screen
	 */
	render : function(eventName) {
		 
		var sCount = {
				"times" : BS.times
		}
		$(this.el).html(this.template(sCount));
 		return this;
	},
	
	/**
	 * populate  List of class codes - matching a class code
	 * 
	 */
	populateClasses :function(eventName){
		var self = this;
		BS.classCodes = []; 
		BS.selectedCode = $('#class-code').val(); 
		 
		var text = $('#class-code').val();
		var selectedSchoolId = $('#schools').val();
		self.displayFiledsForCode(text);
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
//						BS.classCodes.push(data.classCode);
						BS.classCodes.push({
							label:data.classToReturn.classCode ,
							value:data.classToReturn.classCode ,
							id :data.classToReturn.id.id 
					    });
			        });
					$('.ac_results').css('width', '160px');
					
					//set auto populate functionality for class code
					 $("#class-code").autocomplete({
						    source: BS.classCodes,
						    select: function(event, ui) {
						    	
//						    	var text = ui.item.value; 
//						    	self.displayFiledsForCode(text);
						    	var id = ui.item.id; 
						    	self.displayFiledsForCode(id);
						    	
						    }
					 });
				
			}
		});
 
	},
	/**
	 * display other values on mouse select - class code auto complete
	 */
//	getValuesForCode :function(){
//		var self = this;
//		BS.classCodes = []; 
//		var text = $('#class-code').val(); 
//		var selectedSchoolId = $('#schools').val();
//		self.displayFiledsForCode(text);
//		/* post the text that we type to get matched classes */
//		 $.ajax({
//			type : 'POST',
//			url : BS.autoPopulateClassesbyCode,
//			data : {
//				data : text,
//				assosiatedSchoolId : selectedSchoolId
//			},
//			dataType : "json",
//			success : function(datas) {
//				var codes = '';
//				BS.classInfo = datas;
//				BS.classCodes = []; 
//					_.each(datas, function(data) {
//						BS.classCodes.push(data.classCode);
//			        });
//					$('.ac_results').css('width', '160px');
//					
//					//set auto populate functionality for class code
//					 $("#class-code").autocomplete({
//						    source: BS.classCodes,
//						    select: function(event, ui) {
//						    	
//						    	var text = ui.item.value; 
//						    	self.displayFiledsForCode(text);
//						    	
//						    }
//					 });
//				
//			 
//			}
//		});
//	},
	/**
	 * display other field values- classCode auto complete
	 */
	displayFiledsForCode : function(value)
	{ 
		
		var classStatus = false; 
		var classTime ,className,date ,classType,schoolId,classId, streamId;
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
			 $('#class_name').val(className);
			 
			 $('#date-started').val(date);
			 $('#semester option:selected').attr('selected', false);
			 $('#semester option[value="'+classType+'"]').attr('selected', 'selected');
			 if(classType == "quarter")
			 {
				 $('#div-school-type a span.selectBox-label').html("Quarter");
			 }
			 else
			 {
				 $('#div-school-type a span.selectBox-label').html("Semester");
			 }
			
			 $('#div-time a span.selectBox-label').html(classTime);

			 /* Post scholId to get its school name*/
			 $.ajax({
					type : 'POST',
					url : BS.schoolNamebyId,

					data : {
						schoolId : schoolId
					},
					success : function(data) {
						 $('#schools option[value="'+schoolId+'"]').attr('selected', 'selected');
						 $('div#sShool a span.selectBox-label').html(data);
						 $(".modal select:visible").selectBox();

					}
			 });
			 
			 
			 
//			 /* Post streamId to get no of users attending class*/
//			 $.ajax({
//					type : 'POST',
//					url : BS.noOfUsersAttendingAClass,
//
//					data : {
//						streamId : streamId
//					},
//					success : function(data) {
//						  
//						 var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">'+data.Student+' Attending</div><span><img src="images/down-arrow-green.1.png"></span>';
//			        	 $('#student-number').fadeIn("medium"); 
//			        	 $('#student-number').html(ul);
////						 var ul = '<div class="student"><h3>Stud:</h3><h4>'+data.Student+'</h4></div>'
////				 		         +'<div class="educator"><h3>Educ:</h3><h4>'+data.Educator+'</h4></div>';
////  	 
////			        	 $('#ps').fadeIn("medium"); 
////			        	 $('#ps').html(ul);
//
//					}
//			 });

			 
			/*  disable/enable buttons*/
			$('#createClass').hide(); 
			$('#joinClass').show();

		 }
		 else
		 {

			 $('#student-number').fadeOut("medium");
//			 $('#ps').fadeOut("medium");
			 this.classId =1;

			 $(".modal select:visible").selectBox();

			 $('#createClass').show(); 
			 $('#joinClass').hide();
		 }
		
	},
	/**
	 * set date picker display
	 */
	setIndex:function(){
		$('.datepicker').css('z-index','9999');
	},
	
	/**
	 * Post new class details..
	 */
	
	createClass :function(eventName) {
		eventName.preventDefault();
		$('#create-class-loader').css("display","block");
		var newClassInfo = this.getNewClass();
		
		
		/* post data with school and class details */
		$.ajax({
			type : 'POST',
			url : BS.saveClass,
			data : {
				data : newClassInfo
			},
			dataType : "json",
			success : function(data) {
				if(data)
				{
					 $('#create-class-loader').css("display","none");
					 $('#student-number').fadeOut("medium");
//					 $('#ps').fadeOut("medium");
					 console.log("success");
					 // get all streams with newly created one
					 var mainView = new BS.StreamView();
					 mainView.getStreams();
					 $(".star").hide();
					 BS.AppRouter.navigate("streams", {trigger: true});
				}
				else
				{
					$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
            		$('.error-msg').html("Invalid");
				}
				
			}
		});
	},
	
	/**
	 * get  new class details  from form  
	 */
	getNewClass :function(){
		 
		var classCode = $('#class-code').val();
		var classTime = $('#class-time').val();
		var className = $('#class_name').val();
		var date = $('#date-started').val();
		var type = $('#semester').val();
		var school;
 
	    school = $('#schools').val();
  
		
		// get all tags seperated by commas
		var classTag =[];
		for(var i=1 ;i<=tagCount; i++)
		{
			classTag.push($('#tag'+i+'').val());

		}
		var classTags= classTag.join(', ');
		var classes = new BS.ClassCollection();
		var classModel = new BS.Class();
		classModel.set({
			
			schoolId :  school, // need Id value
			id : this.classId ,     
			classCode : classCode,
			classTime : classTime,
			className : className,
			startingDate : date,
			classType : type,
			classTag : classTags
		});
		classes.add(classModel);
		var newClassInfo = JSON.stringify(classes);
		return newClassInfo;
		
	},
	/**
	 * join a class for auto populate case
	 */
	joinClass :function(eventName){
		eventName.preventDefault();
		$('#join-class-loader').css("display","block");
		var newClassInfo = this.getNewClass();
		
		
		/* post data with school and class details */
		$.ajax({
			type : 'POST',
			url : BS.saveClass,
			data : {
				data : newClassInfo
			},
			dataType : "json",
			success : function(data) {
				if(data)
				{
					  $('#join-class-loader').css("display","none");
					  $('#student-number').fadeOut("medium");
//					  $('#ps').fadeOut("medium");
					  BS.AppRouter.navigate("streams", {trigger: true});
				}
				else
				{
					console("Error");
					$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
            		$('.error-msg').html("Invalid");
				}
				
			}
		});
		
	},
	
	/**
	 * add more tags
	 */
	addTags :function(eventName){
		eventName.preventDefault();
		tagCount ++;
		 
		var tag = '<div class="element"><label for="tag '+tagCount+'" class="plus-sign">Add Class Tag '+tagCount+'</label><input type="text" id="tag'+tagCount+'" placeholder="Tag '+tagCount+'" class="large tag-position"><i class="icon-middle-tag tag-place"></i></div>';
		$('#class-tags').append(tag);
	},
	
	/**
     * close class stream screen
     */
    closeScreen :function(eventName){
  	  eventName.preventDefault(); 
  	  
      BS.AppRouter.navigate("streams", {trigger: true});
    },
    /**
     * auto populate class names - matching a class name
     */
    populateClassNames :function(){
    	var self =this;
    	BS.classNames = []; 
		BS.selectedName = $('#class_name').val(); 
		var text = $('#class_name').val();
		var selectedSchoolId = $('#schools').val();
		self.displayFieldsForName(text);
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
				BS.classNames = [];
				BS.classNameInfo = datas;
					_.each(datas, function(data) {
//						BS.classNames.push(data.className);
						BS.classNames.push({
							status : "classPage",
							label:data.classToReturn.className + " - Students:" +data.usersMap.Student + " Educators:"+data.usersMap.Educator+ " Professionals:"+data.usersMap.Professional,
//							label:data.classToReturn.className,

							value:data.classToReturn.className ,
							id :data.classToReturn.id.id ,
							data:data.usersMap.Student,
							students : data.usersMap.Student,
							educators : data.usersMap.Educators,
						});
			        });
					
					$('.ac_results').css('width', '160px');
					
	 
					//set auto populate functionality for class code
					 $(".class_name").autocomplete({
						  minLength: 1,
						    source: BS.classNames,
						    select: function(event, ui) {
//						    	var text = ui.item.value; 
//						    	self.displayFieldsForName(text);
						    	
						    	var id = ui.item.id; 
						    	self.displayFieldsForName(id);
						    	
						    }
					 });
				
			}
			
		});
    	
    },
    
    /**
     * display other values on mouse select - className auto complete
     */
//    getValuesForName :function(eventName){
//    	var id = eventName.target.id;
//    	var text = $('#class_name').val(); 
//    	var self =this;
//    	BS.classNames = []; 
//    	var selectedSchoolId = $('#schools').val();
//    	self.displayFieldsForName(text);
//    	/* post the text that we type to get matched classes */
//		 $.ajax({
//			type : 'POST',
//			url : BS.autoPopulateClassesbyName,
//			data : {
//				data : text,
//				assosiatedSchoolId : selectedSchoolId
//			},
//			dataType : "json",
//			success : function(datas) {
//				var codes = '';
//				BS.classNames = [];
//				BS.classNameInfo = datas;
//					_.each(datas, function(data) {
//						BS.classNames.push(data.className);
//			        });
//					
//					$('.ac_results').css('width', '160px');
//					
//					 
//					//set auto populate functionality for class code
//					 $('#'+id).autocomplete({
//						    source: BS.classNames,
//						    select: function(event, ui) {
//						    	
//						    	var text = ui.item.value; 
//						    	self.displayFieldsForName(text);
//						    	
//						    }
//					 });
//				
//			 
//			}
//		});
//		
//    },
    /**
     *  display other field values - className auto populate
     */
    displayFieldsForName : function(value){
    	 
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
			 $('#class-code').val(classCode);
			 $('#date-started').val(date);
			 $('#semester option:selected').attr('selected', false);
			 $('#semester option[value="'+classType+'"]').attr('selected', 'selected');
			 if(classType == "quarter")
			 {
				 $('#div-school-type a span.selectBox-label').html("Quarter");
			 }
			 else
			 {
				 $('#div-school-type a span.selectBox-label').html("Semester");
			 }
			 $('#div-time a span.selectBox-label').html(classTime);

			 /* Post scholId to get its school name*/
			 $.ajax({
					type : 'POST',
					url : BS.schoolNamebyId,

					data : {
						schoolId : schoolId
					},
					success : function(data) {
						 $('#schools option[value="'+schoolId+'"]').attr('selected', 'selected');
						 $('div#sShool a span.selectBox-label').html(data);
						 $(".modal select:visible").selectBox();

					}
			 });
			 
			 
//			 /* Post streamId to get no of users attending class*/
//			 $.ajax({
//					type : 'POST',
//					url : BS.noOfUsersAttendingAClass,
//
//					data : {
//						streamId : streamId
//					},
//					success : function(data) {
//						  
//						 var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">'+data.Student+' Attending</div><span><img src="images/down-arrow-green.1.png"></span>';
//						 $('#student-number').fadeIn("medium");
//			        	 $('#student-number').html(ul);
//						
////						 var ul = '<div class="student"><h3>Stud:</h3><h4>'+data.Student+'</h4></div>'
////		 		                  +'<div class="educator"><h3>Educ:</h3><h4>'+data.Educator+'</h4></div>';
////
////			        	 $('#ps').fadeIn("medium"); 
////			        	 $('#ps').html(ul);
//
//					}
//			 });
			/*  disable/enable buttons*/
			$('#createClass').hide(); 
			$('#joinClass').show();

		 }
		 else
		 {
              
			 this.classId =1;
			 $('#student-number').fadeOut("medium");
//			 $('#ps').fadeOut("medium");
			 $('#class-code').val("");
			 $('#date-started').val($.datepicker.formatDate('mm/dd/yy', new Date()));
//			 $('#semester-'+identity+' option:selected').attr('selected', false);
//			 $('#semester-'+identity+' option[value="semester"]').attr('selected', 'selected');
//			 $('#div-school-type-'+identity+' a span.selectBox-label').html("Semester");
			 $('#createClass').show(); 
			 $('#joinClass').hide();
		 }
    },
   
    /**
     * show New school field 
     */
    showNewSchoolField : function(){
    	 
    	
    	if($('#schools').val() == "add-school")
    	{
    		  
    		 BS.newSchoolView = new BS.NewSchoolView();
    		 BS.newSchoolView.render();
             $('#new-school-view').html(BS.newSchoolView.el);
             $(".modal select:visible").selectBox();
     		 $('.modal .datepicker').datepicker();
     		
     		 $('#degree-exp').hide();
             $('#cal').hide();
             $('#other-degrees').hide();
    		
    	}
    	
    	$('#class-name').val("");
    	$('#student-number').fadeOut("medium");
		$('#class-code').val("");
		$('#date-started').val($.datepicker.formatDate('mm/dd/yy', new Date()));
 
    },
    /**
     * get schools details
     */
    getSchools :  function(){
    	/* get all schoolIds under a class */
		 $.ajax({
				type : 'GET',
				url : BS.schoolJson,
				dataType : "json",
				success : function(datas) {
					
					var sSelect = '<select id="schools" class="small selectBox">';
					_.each(datas, function(data) {
						sSelect+= '<option value ="'+data.assosiatedSchoolId.id+'" > '+data.schoolName+'</option>';
			        });
						sSelect+= '</select>';
//					sSelect += '<option value ="add-school" > Add School</option></select>';
					$('#sShool').html(sSelect);
					$(".modal select:visible").selectBox();
				}
		 });
    }
		
});