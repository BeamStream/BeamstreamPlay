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

define(['view/formView','../../lib/bootstrap-select','../../lib/bootstrap-datepicker','model/userSchool'],
	function(FormView ,BootstrapSelect,Datepicker ,userSchool){
	
	var classView;
	classView = FormView.extend({
		objName: 'classView',
		
		events:{
			'keyup #className' :'populateClassNames',
		    'focusin #className':'populateClassNames',
		    'click #create-stream' : 'createOrJoinStream',
		    'click .access-menu li' : 'activateClassAccess',
		    'change #schoolId' : 'clearAllClasses',
//		    'click .date-arrow' : 'showCalendar'
		    
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
       		        $('#classTime').append('<option>'+time+'</option>');
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
	   					var classNames = [];
	   					_.each(datas, function(data) {
	   						
	   						classNames.push({
	   							label: data.classToReturn.className,
	   							value: data.classToReturn.className,
	   							id : data.classToReturn.id.id,
	   							info: data.usersMap.Student +" Students," + data.usersMap.Educator + " Educators,"+ data.usersMap.Professional + " Professionals ",

	   						});
	   						
	   			         });
	   					
	   	                 if(classNames.length == 0)
	   	                	 return;
	   	                 
	   	                 //set auto populate schools
	   	                 $('#className').autocomplete({
	   					    source:classNames,
	   					    select: function(event, ui) { 
	   					    	var text = ui.item.value;
	   					    	
	   					    	/* set the school details  to modal */
	   					    	var id = ui.item.id
//					    		self.data.models[0].set({'id' : ui.item.id});

	   					    	self.displayFieldsForName(id,ui.item.data);
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
        	console.log(data);
        },
        
        /**
         * clear all classes when we select 
         */
        clearAllClasses: function(){
//        	$('#className').val("");
        },
        
        /**
         * create or join streams
         */
        createOrJoinStream: function(e){
        	e.preventDefault();
        	this.saveForm();
        },
        
        
        /**
		 * class form success
		 */
		success: function(model, data){
//			window.location = "/class";
//			alert(data.message);
		},
        /**
         * set active class to selected class access 
         */
        activateClassAccess: function(e){
        	e.preventDefault();
        	alert(45);
        },
        
        
 
	
	})
	return classView;
});