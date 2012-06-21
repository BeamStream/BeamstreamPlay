BS.ClassStreamView = Backbone.View.extend({

	events : {
       "keyup #class-code" : "populateClasses",
       "click .datepicker" :"setIndex",
       "focusin #class-code" : "populateClasses",
       "click #createClass" : "createClass"
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
	 * populate  List of classes matching a class code
	 * 
	 */
	populateClasses :function(){
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
				$("#class-code").autocomplete(BS.classCodes);
			 
			}
		});
		 
		 var classStatus = false; 
		 var classTime ,className,date ,classType,schoolId;
         var datas = JSON.stringify(BS.classInfo);
          
         /* get details of selected class */
		 _.each(BS.classInfo, function(data) {
		 	 if(data.classCode == BS.selectedCode)
		     {
				 classStatus = true;
				 classTime = data.classTime;
				 className = data.className;
				 date = data.startingDate;
				 classType = data.classType;
				 schoolId = data.schoolId.id;
		     }
			 
         });
		 /* populate other class fields*/
		 if(classStatus == true)
		 {
			 $('#class-name').val(className);
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
							sSelect+= '<option value ="'+data.id.id+'" > '+data.schoolName+'</option>';
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
//				// append newly created stream to stream list
//				var selected = $('#select-streams li.active a').attr('id');
//				if(selected == 'all-streams' || selected == 'classStreams-list')
//				{
//					var li ='<li><span class="flag-piece"></span><a id="'+data.id.id'+" href="#">'+data.streamName+'<i class="icon"></i></a><span class="popout_arrow"><span></span></span></li>';
//					$('#streams-list').append(li);
//				}
				BS.AppRouter.navigate("streams", {trigger: true, replace: true});
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
		var classTag = $('#class-tag').val();
		
		var classes = new BS.ClassCollection();
		var classModel = new BS.Class();
		classModel.set({
			
			schoolId :  school, // need Id value
			id : 1 ,     
			classCode : classCode,
			classTime : classTime,
			className : className,
			startingDate : date,
			classType : type,
			classTag : classTag
		});
		classes.add(classModel);
		var newClassInfo = JSON.stringify(classes);
		console.log(newClassInfo);
		return newClassInfo;
		
	}
	 
});