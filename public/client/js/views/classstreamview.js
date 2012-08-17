BS.ClassStreamView = Backbone.View.extend({

	events : {
       "keyup #class-code" : "getValuesForCode",
       "click .datepicker" :"setIndex",
       "focus #class-code" : "populateClasses",
       "click #createClass" : "createClass",
       "click #joinClass" :"joinClass",
       "click #add-tags" : "addTags",
       "click .close-button" : "closeScreen",
       "keyup #class_name" :"getValuesForName",
       "focusin #class_name":"populateClassNames",
	},

	initialize : function() {
		console.log('Initializing Class Stream View');
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
		
		/* post the text that we type to get matched classes */
		 $.ajax({
			type : 'POST',
			url : BS.autoPopulateClass,
			data : {
				data : text
			},
			dataType : "json",
			success : function(datas) {
				var codes = '';
				BS.classInfo = datas;
				_.each(datas, function(data) {
					BS.classCodes.push(data.classCode);
		        });
				$('.ac_results').css('width', '160px');
				
				//set auto populate functionality for class code
				 $("#class-code").autocomplete({
					    source: BS.classCodes,
					    select: function(event, ui) {
					    	
					    	var text = ui.item.value; 
					    	self.displayFiledsForCode(text);
					    	
					    }
				 });
			 
			}
		});
 
	},
	/**
	 * display other values on mouse select - class code auto complete
	 */
	getValuesForCode :function(){
		 
		var text = $('#class-code').val(); 
		this.displayFiledsForCode(text);
		 
	},
	/**
	 * display other field values- classCode auto complete
	 */
	displayFiledsForCode : function(value)
	{ 
		
		var classStatus = false; 
		 var classTime ,className,date ,classType,schoolId,classId;
        var datas = JSON.stringify(BS.classInfo);
         
        /* get details of selected class */
		 _.each(BS.classInfo, function(data) {
		 	 if(data.classCode == value)
		     {
				 classStatus = true;
				 classTime = data.classTime;
				 className = data.className;
				 date = data.startingDate;
				 classType = data.classType;
				 schoolId = data.schoolId.id;
				 classId = data.id.id;
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
			 $('#div-school-type a span.selectBox-label').html(classType);
			 $('#div-time a span.selectBox-label').html(classTime);

			 /* Post scholId to get its school name*/
			 $.ajax({
					type : 'POST',
					url : BS.schoolNamebyId,

					data : {
						schoolId : schoolId
					},
					success : function(data) {
						 var sSelect = '<select id="schools" class="small selectBox"><option value ="'+schoolId+'" >'+data+'</option>';
						 $('#sShool').html(sSelect);
						 $(".modal select:visible").selectBox();

					}
			 });
			 
			/*  disable/enable buttons*/
			$('#createClass').hide(); 
			$('#joinClass').show();

		 }
		 else
		 {
			 this.classId =1;
			 $('#class-name').val("");
			 $('#date-started').val("");
			 $('#div-school-type a span.selectBox-label').html("");
			 $('#div-time a span.selectBox-label').html("");
			 $('#div-school a span.selectBox-label').html("");
			 $(".modal select:visible").selectBox();
			 
			/* get all schoolIds under a class */
			 $.ajax({
					type : 'GET',
					url : BS.allSchoolForAUser,
					dataType : "json",
					success : function(datas) {
						
						 var sSelect = '<select id="schools" class="small selectBox">';
						_.each(datas, function(data) {
							sSelect+= '<option value ="'+data.assosiatedSchoolId.id+'" > '+data.schoolName+'</option>';
				        });
						sSelect+= '</select>';
						$('#sShool').html(sSelect);
						$(".modal select:visible").selectBox();
					}
			 });
			
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
		var newClassInfo = this.getNewClass();
		
		/* post new class details */
		$.ajax({
			type : 'POST',
			url : BS.newClass,
			data : {
				data : newClassInfo
			},
			dataType : "json",
			success : function(data) {
				 
				 console.log("success");
				 // get all streams with newly created one
				 var mainView = new BS.StreamView();
				 mainView.getStreams();

				 BS.AppRouter.navigate("streams", {trigger: true});
			}
		});
		
	},
	
	/**
	 * get  new class details  from form  
	 */
	getNewClass :function(){
		 
		var classCode = $('#class-code').val();
		var classTime = $('#class-time').val();
		var className = $('#class-name').val();
		var date = $('#date-started').val();
		var type = $('#semester').val();
		var school = $('#schools').val();
		
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
		var newClassInfo = this.getNewClass();
		
		/* post new class details */
		$.ajax({
			type : 'POST',
			url : BS.joinClass,
			data : {
				data : newClassInfo
			},
			dataType : "json",
			success : function(data) {
				 
				 console.log("success");
				 BS.AppRouter.navigate("streams", {trigger: true});
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
		
		/* post the text that we type to get matched classes */
		 $.ajax({
			type : 'POST',
			url : BS.autoPopulateClass,
			data : {
				data : text
			},
			dataType : "json",
			success : function(datas) {
				var codes = '';
				BS.classNameInfo = datas;
				_.each(datas, function(data) {
					BS.classNames.push(data.className);
		        });
				
				$('.ac_results').css('width', '160px');
				
 
				//set auto populate functionality for class code
				 $("#class_name").autocomplete({
					    source: BS.classNames,
					    select: function(event, ui) {
					    	
					    	var text = ui.item.value; 
					    	self.displayFieldsForName(text);
					    	
					    }
				 });
			 
			}
		});
		 
    	
    },
    /**
     *  display other field values - className auto populate
     */
    displayFieldsForName : function(value){
    	
    	var classStatus = false; 
		var classTime ,className,date ,classType,schoolId,classId;
        var datas = JSON.stringify(BS.classInfo);
         
        /* get details of selected class */
		 _.each(BS.classNameInfo, function(data) {
		 	 if(data.className == value)
		     {
		 		  
				 classStatus = true;
				 classTime = data.classTime;
				 classCode = data.classCode;
				 date = data.startingDate;
				 classType = data.classType;
				 schoolId = data.schoolId.id;
				 classId = data.id.id;
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
			 $('#div-school-type a span.selectBox-label').html(classType);
			 $('#div-time a span.selectBox-label').html(classTime);

			 /* Post scholId to get its school name*/
			 $.ajax({
					type : 'POST',
					url : BS.schoolNamebyId,

					data : {
						schoolId : schoolId
					},
					success : function(data) {
						 var sSelect = '<select id="schools" class="small selectBox"><option value ="'+schoolId+'" >'+data+'</option>';
						 $('#sShool').html(sSelect);
						 $(".modal select:visible").selectBox();

					}
			 });
			 
			/*  disable/enable buttons*/
			$('#createClass').hide(); 
			$('#joinClass').show();

		 }
		 else
		 {
			 this.classId =1;
			 $('#class-code').val("");
			 $('#date-started').val("");
			 $('#div-school-type a span.selectBox-label').html("");
			 $('#div-time a span.selectBox-label').html("");
			 $('#div-school a span.selectBox-label').html("");
			 $(".modal select:visible").selectBox();
			 
			/* get all schoolIds under a class */
			 $.ajax({
					type : 'GET',
					url : BS.allSchoolForAUser,
					dataType : "json",
					success : function(datas) {
						
						 var sSelect = '<select id="schools" class="small selectBox">';
						_.each(datas, function(data) {
							sSelect+= '<option value ="'+data.assosiatedSchoolId.id+'" > '+data.schoolName+'</option>';
				        });
						sSelect+= '</select>';
						$('#sShool').html(sSelect);
						$(".modal select:visible").selectBox();
					}
			 });
			
			 $('#createClass').show(); 
			 $('#joinClass').hide();
		 }
    },
    /**
     * display other values on mouse select - className auto complete
     */
    getValuesForName :function(){
    	var text = $('#class_name').val(); 
		this.displayFieldsForName(text);
		
    }
		
});
