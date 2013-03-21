/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/February/2013
* Description           : View for class page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView',
        '../../lib/bootstrap-select',
        '../../lib/bootstrap-datepicker',
        '../../lib/bootstrap-modal',
        'model/userSchool'
        ],function(FormView ,BootstrapSelect,Datepicker , BootstrapModal, userSchool){
	
	var classView;
	classView = FormView.extend({
		objName: 'classView',
		
		events:{
			'keyup #className' :'populateClassNames',
		    'focusin #className':'populateClassNames',
		    'click #create-stream' : 'createOrJoinStream',
		    'click .access-menu li' : 'activateClassAccess',
		    'change #schoolId' : 'clearAllClasses',
		    'keyup #classCode' :'populateClassCodes',
		    'click #addMoreClass' : 'addMoreClasses',
		    'click #startBeam' : 'startBeamstream'
		    
		},

		onAfterInit: function(){	
			this.data.reset();
			
			/*fetch userSchool model  to get all schools of a user*/
			this.users = new userSchool();
			this.users.fetch();
			
	        
        },
        onAfterRender: function(){
        	
        	/* calculate time from 12:00AM to 11:45PM */
         	var timeValues = new Array;
       		var hours, minutes, ampm;
       		for(var i = 0; i <= 1425; i += 15){
       		        hours = Math.floor(i / 60);
       		        minutes = i % 60;
       		        if (minutes < 10){
       		            minutes = '0' + minutes; // adding leading zero
       		        }
       		        ampm = hours % 24 < 12 ? 'AM' : 'PM';
       		        hours = hours % 12;
       		        if (hours === 0){
       		            hours = 12;
       		        }
       		        var time = hours+':'+minutes+''+ampm ;
       		        
       		        //add time values ti ClassTime field
       		        $('#classTime').append('<option value="'+time+'">'+time+'</option>');
       		 }
       		
       		//get school names and its ids and added to school dropdown list 
       		_.each(this.users.attributes, function(school) {
       			$('#schoolId').append('<option value="'+school.assosiatedSchoolId.id+'">'+school.schoolName+'</option>');
       		});
       		
       		// set select box style
       		$('.selectpicker-info').selectpicker({
        		style: 'register-select invite-selecter'
        	});
       		
       		// set date picker style
       		$('.datepicker').datepicker();
        },
        
        
        /**
         * auto populate class names - matching a class name
         */
        populateClassNames :function(eventName){
        	
        	var self = this ;
    		var text = $('#className').val(); 
    		var selectedSchoolId = $('#schoolId').val() ;
    		self.data.models[0].removeAttr('id');
    		$('#create-stream').text("Create Stream");
    		
    		/* call auto populate  only when class name is there */ 
    		if(text != '' && selectedSchoolId !=''){
    			
    			/* post the text that we type to get matched school */
	   			 $.ajax({
	   				type : 'POST',
	   				url : "/autoPopulateClassesbyName",
	   				data : {
	   					data : text,
	   					schoolId:selectedSchoolId
	   				},
	   				dataType : "json",
	   				success : function(datas) {
	   	
	   					var codes = '';
	   					 
	   					var allClassInfo = datas;
	   					self.classNames = [];
	   					_.each(datas, function(data) {
	   						
	   						self.classNames.push({
	   							label: data.classToReturn.className,
	   							value: data.classToReturn.className,
	   							id : data.classToReturn.id.id,
	   							info: data.usersMap.Student +" Students," + data.usersMap.Educator + " Educators,"+ data.usersMap.Professional + " Professionals ",
	   							data:data

	   						});
	   						
	   			         });
	   					
	   	                 if(self.classNames.length == 0)
	   	                	 return;
	   	                 
	   	                 //set auto populate schools
	   	                 $('#className').autocomplete({
	   					    source:self.classNames,
	   					    select: function(event, ui) { 
	   					    	var text = ui.item.value;
	   					    	var id = ui.item.id
	   					    	
	   					    	$('#create-stream').text("Join Stream");
	   					    	
	   					    	/* set the school details  to modal */
					    		self.data.models[0].set({'id' : ui.item.id , 'className' :ui.item.value ,'classTime' :ui.item.data.classToReturn.classTime ,'startingDate' :ui.item.data.classToReturn.startingDate,'classType':ui.item.data.classToReturn.classType ,'classCode': ui.item.data.classToReturn.classCode });
	   					    	self.displayFieldsForName(id,ui.item.data);
	   					    }
	   	                 });
	   				}
	   			 });
    		}
    		
        },
        
        
        /**
		 * populate  List of class codes - matching a class code
		 */
        populateClassCodes :function(eventName){
			
			var id = eventName.target.id;
			var self = this;
			  
			var text = $('#classCode').val(); 
			var identity = id.replace(/[^\d.,]+/,'');
			var selectedSchoolId = $('#schoolId').val() ;
			self.data.models[0].removeAttr('id');
			$('#create-stream').text("Create Stream");
			
			/* post the text that we type to get matched classes */
			if(text != '' && selectedSchoolId !=''){
			
				 $.ajax({
					type : 'POST',
					url : '/autoPopulateClassesbyCode',
					data : {
						data : text,
						assosiatedSchoolId : selectedSchoolId
					},
					dataType : "json",
					success : function(datas) {
						var codes = '';
						var allClassInfo = datas;
						self.classCodes = []; 
						_.each(datas, function(data) {
							self.classCodes.push({
								label:data.classToReturn.classCode ,
								value:data.classToReturn.classCode ,
								id :data.classToReturn.id.id ,
								data:data
						    });
		
							 
				        });
						
						 if(self.classCodes.length == 0)
	   	                	 return;
						
						//set auto populate functionality for class code
						$('#classCode').autocomplete({
							    source: self.classCodes,
							    select: function(event, ui) {
							    	
							    	var id = ui.item.id; 
							    	$('#create-stream').text("Joins Stream");
							    	/* set the  details  to modal */
						    		self.data.models[0].set({'id' : ui.item.id , 'className' :ui.item.value ,'classTime' :ui.item.data.classToReturn.classTime ,'startingDate' :ui.item.data.classToReturn.startingDate,'classType':ui.item.data.classToReturn.classType ,'classCode': ui.item.data.classToReturn.classCode });
		   					    	
							    	self.displayFiledsForCode(id,ui.item.data);
							    	
							    }
						 });
					}
				});
			}
		},
        /**
         * display all other fields of selected class 
         */
        displayFieldsForName: function(id,data){
        	$('#classCode').val(data.classToReturn.classCode);
        	$('#startingDate').val(data.classToReturn.startingDate);
        	$('#classType').val(data.classToReturn.classTime);
        	$('#classTime span.filter-option').text(data.classToReturn.classTime);
        	
        	if(data.classToReturn.classType == "quarter")
        	{
        		$('#classType span.filter-option').text("Quarter");
        	}
        	else
        	{
				 $('#classType span.filter-option').text("Semester");
        	}
        },
        
        /**
         * display all other fields of selected class  code
         */
        displayFiledsForCode: function(id,data){
        	$('#className').val(data.classToReturn.className);
        	$('#startingDate').val(data.classToReturn.startingDate);
        	$('#classType').val(data.classToReturn.classTime);
        	$('#classTime span.filter-option').text(data.classToReturn.classTime);
        	
        	if(data.classToReturn.classType == "quarter")
        	{
        		$('#classType span.filter-option').text("Quarter");
        	}
        	else
        	{
				 $('#classType span.filter-option').text("Semester");
        	}
        },
        
        /**
         * clear all class details when we select a school 
         */
        clearAllClasses: function(){
        	this.classNames = [];
        	$('#className').val("");
        	$('#classCode').val("");
        	$('#classTime span.filter-option').text("Class Time");
//        	$('#startingDate').val("Date");
        	$('#classType span.filter-option').text("Semester");
        },
        
        /**
         * create or join streams
         */
        createOrJoinStream: function(e){
        	e.preventDefault();
        	this.saveForm();
        },
        
        
        /**
		 * class form success and redirect to stream page
		 */
		success: function(model, data){
			if(data.status == "Success"){
				
				window.location = "/stream";
   	    	}
   	    	else{
   	    		alert(data.message);
   	    	}
			
		},
		
		serverError : function(model, data) {
			console.log(data.response);
		},
		
        /**
         * set active class to selected class access 
         */
        activateClassAccess: function(e){
        	e.preventDefault();
        },
        
        /**
         * stay on class page to add more classes 
         */
        addMoreClasses: function(e){
        	e.preventDefault();
        	$("#selectNextStep").modal('hide');
        },
       
        /**
         * go to stream page 
         */
        startBeamstream: function(e){
        	e.preventDefault();
        	window.location = "/stream";
        }
	})
	return classView;
});