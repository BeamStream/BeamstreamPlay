BS.ClassStreamView = Backbone.View.extend({

	events : {
       "keyup #class-code" : "populateClasses",
       "click .datepicker" :"setIndex",
       "focusin  #class-code" : "populateClasses",
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
	 * populate  List of classes matching that code
	 * 
	 */
	populateClasses :function(){
		BS.classCodes = []; 
		BS.selectedCode = $('#class-code').val(); 
		var text = $('#class-code').val();
		 $.ajax({
			type : 'POST',
//			url : "http://localhost/Beam2/BeamstreamPlay/public/client/api.php",
			url : "http://localhost:9000/autoPopulateClasses",
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
				 schoolId = data.schoolId.schoolId;
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
 
			 /* Post scholId to get the school name*/
			 $.ajax({
					type : 'POST',
//					url : "http://localhost/client2/api.php",
					url : "http://localhost:9000/getSchoolNamebyId",
					data : {
						schoolId : schoolId
					},
					success : function(data) {
						 var sSelect = '<select id="schools" class="small selectBox"><option value ="'+schoolId+'" >'+data+'</option>';
						 $('#sShool').html(sSelect);
						 $(".modal select:visible").selectBox();

					}
			 });
			 
			/*  disable/enable Buttons*/
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
//					url : "http://localhost/client/api.php",
					url : "http://localhost:9000/getAllSchoolForAUser",
					dataType : "json",
					success : function(datas) {
						
						 var sSelect = '<select id="schools" class="small selectBox">';
						_.each(datas, function(data) {
							sSelect+= '<option value ="'+data.schoolName+'" > '+data.schoolName+'</option>';
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
	
	 
 
	 
});
