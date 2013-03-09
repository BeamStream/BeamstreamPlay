/***
* BeamStream
*
* Author                : Aswathy P .R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone view for registration steps
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/
define(['view/formView' ,'../../lib/bootstrap-select','../../lib/bootstrap.min'], function(FormView, BootstrapSelect,Bootstrap){
	var RegistrationView;
	RegistrationView = FormView.extend({
		objName: 'RegistrationView',
                
        events : {
			'click #done_step1' : 'completeFirstStep',
			'click #done_step2' : 'comepleteSecondStep',
			'click #step2-reset' : 'resetStep2Form',
			'click .browse' : 'uploadProfilePic',
			'change #uploadProfilePic' :'changeProfile',
			'click #done_step3':'completeRegistration',
			'click .register-social':'connectMedia',
			'keyup #schoolName' : 'populateSchools',
		    'focusin #schoolName' : 'populateSchools',
			 
		},
		
		onAfterInit: function(){
			
			this.data.reset();
			this.profile = null;

		},
		
		onBeforeRender: function(){
			
			/* set default values to model values */
			this.data.models[0].set({'userId':$('#myUserId').val() ,'firstName':'' ,'lastName':'','schoolName':'' ,'major':'','gradeLevel':'' ,'degreeProgram':'' ,'graduate':'' ,'location':'' ,'aboutYourself' :'', 'cellNumber':''});

		},
		
        
		/**
		 * activate step 1 registration block
		 */
		disableStepOne: function(){
			
			$('#step_1').hide();
            $('#step1_block').removeClass('active-border');
            $('#step2_block').removeClass('box-active');
		},
		
		/**
		 * activate step 2 registration block
		 */
		enableStepTwo: function(){
			$('#step_1').hide(500);
            $('#step1_block').removeClass('active-border');
            $('#step2_block').removeClass('box-active');
            $('#step2_block').addClass('active-border');
            $('#step_2').show(500);
		},
		
		/**
		 * activate step 3 registration block
		 */
		enableStepThree: function(){
			$('#step_2').hide(500);
			$('#step2_block').removeClass('active-border');
			
			var upload_block = '<div id="step3_block" class="round-block upload-photo step-3-photo">'
			    +'<a class="browse" href="#"><img src="/beamstream-new/images/upload-photo.png" width="148" height="37" id="profile-photo"> <div class="upload-box"><div class="upload-plus">Upload</div></div></a>'
                +'<div id="profile-error" ></div>'
                +'</div>';
			$('#upload-step').html(upload_block);
			$('#step_3').show(500);

		},
		

		/**
		 * complete step1 registration process
		 */
        completeFirstStep: function(e){
        	
        	e.preventDefault();
            console.log("Complete first step ...");
            
            /* disable first step and enable step 2 block */
            this.enableStepTwo();
            
        },
                
        /**
		 * complete step2 registration process - user details form
		 */
		comepleteSecondStep: function(e){
			
			e.preventDefault();
			
			/* @TODO only select a school from existing list or add new school */
			if($('#schoolName').val()){
				if(!$('#associatedSchoolId').val()){
					alert('Please select existing School or add a new one');
					return;
				}
			}

			//set school details to modal 
			this.data.models[0].set({'schoolName' : $('#schoolName').val() , 'associatedSchoolId' :$('#associatedSchoolId').val()} );
			this.saveForm();
		},
		
		/**
		 * step 2 registration success
		 */
		success: function(model, data){
			
            /* enable step 3*/
			if(data != "Oops there were errors during registration")
				this.enableStepThree();
		},
		
		/**
		 * reset step 2 form values - clear all form values 
		 */
		resetStep2Form: function(e){
			
			e.preventDefault(); 
		    $('button#degreeProgram span:first').text('Degree Program?');
		    $('button#gradeLevel span:first').text('Grade Level?');
		    $('button#graduate span:first').text('Graduated?');
			$('#step2_block input').attr('value','');
			$('#step2_block textarea').attr('value','')
			$('.error').remove();
			
		},
		
		/**
		 * upload profile picture or profile video
		 */
		uploadProfilePic: function(e){
			e.preventDefault(); 
			$('#uploadProfilePic').click();
		},
		
		/**
		 * Change profile pic or profile video 
		 */
		changeProfile: function(e){
	    	 
	    	 var self = this;
	    	 var file = e.target.files[0]; 
	        
	         var reader = new FileReader();
	         
	         /* Only process image files. */
	         if (!file.type.match('image.*') && !file.type.match('video.*')) {
	        	 
	        	 console.log("Error: file type not allowed");
	        	 $('#profile-photo').attr("src","/beamstream-new/images/upload-photo.png");
			     $('#profile-error').html('File type not allowed !!');
			     self.profile = '';
	         }
	         else
	         {
	                    	 
	        	 /* capture the file informations */
	             reader.onload = (function(f){
	            	 
	            	 self.profile = file;
	            	 return function(e){
	            		 $('#profile-error').html('');
	        		     $('#profile-photo').attr("src",e.target.result);
	        		     self.name = f.name;
	        		
	        		 };
	            })(file);
	            
	            // read the image file as data URL
	            reader.readAsDataURL(file);   
	         }
		},
		
		/**
		 *  steps 3 registration - image/video upload
		 */
		completeRegistration: function(e){
			e.preventDefault();
			
			/* post the image / video data as mutiform data */
			if(this.profile)
			{
				$('.profile-loading').css("display","block");
				var data;
	        	data = new FormData();
	     	    data.append('profileData', this.profile);
	     	    
	     	    $.ajax({
		       	    type: 'POST',
		       	    data: data,
		       	    url: "/media",
		       	    cache: false,
		       	    contentType: false,
		       	    processData: false,
		       	    success: function(data){
		       	    	
		       	    	// @TODO redirect to class page on upload success from UI side 
		       	    	if(data.status == "Success"){
		       	    		$('.profile-loading').css("display","block");
		       	    		window.location = "/class";
		       	    	}
		       	    	else{
		       	    		alert(data.message);
		       	    	}
		       	    		
		       	    	
		       	    }
	     	    });
			}
			else
			{
				$('#profile-error').html('Please select your profile image/video');
			}

		},
		
		
		/**
		 * connect to social medias
		 */
		connectMedia: function(e){
			e.preventDefault();
			
            /* activate selected medias */
			if($(e.target).parents('li').hasClass('active')){
				$(e.target).parents('li').removeClass('active');
			}
			else{
				$(e.target).parents('li').addClass('active');
			}
			
		},
		
		/**
	     * auto populate school
	     */
	    populateSchools :function(eventName){
	    	var id = eventName.target.id;
	    	var text = $('#'+id).val();
	    	var self =this;
	    	this.status = false;
	        if(text)
	        {
	        	$('.loading').css("display","block");
	        	var newSchool = text;
	        	
				/* post the text that we type to get matched school */
				 $.ajax({
					type : 'POST',
					url : "/getAllSchoolsForAutopopulate",
					data : {
						data : text,
					},
					dataType : "json",
					success : function(datas) {
		
						var codes = '';
						 
						var allSchoolInfo = datas;
						var schoolNames = [];
						_.each(datas, function(data) {
							
							schoolNames.push({
								label: data.schoolName,
								value: data.schoolName,
								id : data.id.id
							});
							
				         });
	   	                	       
						//set auto populate schools
						$('#'+id).autocomplete({
						    source:schoolNames,
						    select: function(event, ui) { 
						    	var text = ui.item.value;
						    	
						    	/* set the school details  to modal */
						    	if(ui.item.value){
						    		console.log(ui.item.id);
						    		$('#associatedSchoolId').attr('value',ui.item.id);
//						    		self.data.models[0].set({'schoolName' : ui.item.value , 'associatedSchoolId' :ui.item.id} );
						    	}
						    }
						});
						$('.loading').css("display","none");
		 
					}
				});
	        }
			
	    }
		
	})
	return RegistrationView;
});
