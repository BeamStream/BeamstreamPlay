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
define(['view/formView' ,
        '../../lib/bootstrap.min',
        '../../lib/bootstrap-select',
        '../../lib/bootstrap-modal',
        '../../lib/jquery.meio.mask',
        '../../lib/bootstrap-datepicker',
        'text!templates/registration.tpl',
        ], function(FormView, Bootstrap,BootstrapSelect,BootstrapModal,MaskedInput, Datepicker ,RegistrationTpl){
	var RegistrationView;
	RegistrationView = FormView.extend({
		objName: 'RegistrationView',
                
        events : {
       	
        	'click #skip_step1' : 'completeFirstStep',
			'click #done_step1' : 'completeFirstStep',
			'click #done_step2' : 'comepleteSecondStep',
			'click #step2-reset' : 'resetStep2Form',
			'click .browse' : 'continuestep3',
			'change #uploadProfilePic' :'changeProfile',
			'click #skip_step3':'completeRegistration',
			'click #addPhoto' : 'uploadProfilePic',
			'click #continue' : 'noprofilepic',
			'click .register-social':'connectMedia',
			'keyup #schoolName' : 'populateSchools',
		    'focusin #schoolName' : 'populateSchools',
		    'change #degreeProgram': 'addOtherDegree',
		    'change #graduate': 'showGraduateType'
			 
		},
		
		onAfterInit: function(){
			
			this.data.reset();
			this.profile = null;
			console.log("test");
		},
		
		/**
         * @TODO JanRain Sign up 
         */
		displayPage: function(callback){
			
			// get user informations from Social site ( janRain sign up case ) 
			var userInfo = jQuery.parseJSON($('#registration').attr('data-value'));
			var compiledTemplate = Handlebars.compile(RegistrationTpl);
            
			
			if(userInfo == null){  // signup via email
				
				this.$(".content").html( compiledTemplate(this.data));
			} 
			else{                  //signup  via janRain
				if (userInfo.stat == "ok") {
					
					var firstName = '', lastName ='', location ='', email='';
					firstName = userInfo.profile.name.givenName;
					lastName = userInfo.profile.name.familyName;
					
					this.data.models[0].set({'firstName':firstName , 'lastName': lastName}); 
					 
					if (userInfo.profile.providerName == "Twitter"){
						 
						var formattedName = userInfo.profile.name.formatted;
						var parts = formattedName.split(' ');
						if(parts.length > 1 ) {
							firstName = formattedName.substr(0,formattedName.indexOf(' '));
							lastName = formattedName.substr(formattedName.indexOf(' ')+1);
						}
						if(parts.length == 1) {
							firstName = userInfo.profile.name.formatted;
							lastName ='';
						}
						 
						if(userInfo.profile.address === undefined){
							console.log("no location");
						}
						else{
							location = userInfo.profile.address.formatted;
						}
					}
					else if(userInfo.profile.providerName == "Facebook"){

						if(userInfo.profile.address === undefined){
							console.log("no location");
						}
						else{
							location = userInfo.profile.address.formatted;
						}
						email = userInfo.profile.email;
					}
					else if (userInfo.profile.providerName == "LinkedIn") {
						
						console.log("signup via LinkedIn");
					}
					else if (userInfo.profile.providerName == "Google") {
						
						console.log("signup via Google");
						email = userInfo.profile.email;
					}
					else{
						console.log("Not from registraed social site");
					}
						 
					userInfo = { "status" : "true" , "firstName" : firstName,"lastName": lastName,"location": location, "email": email  };
					
					this.data.models[0].set({'firstName':firstName , 'lastName': lastName , 'location': location ,'mailId': email});
					this.$(".content").html( compiledTemplate(userInfo));
				}
			}
		},
		
		onAfterRender: function(){
			
			/* set style for select boxes */
			$('.selectpicker-info').selectpicker({
			    style: 'register-select'
			});
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
            $("#cellNumber").setMask('(999) 999-9999');
        },
                
        /**
		 * complete step2 registration process - user details form
		 */
		comepleteSecondStep: function(e){
			
			e.preventDefault();				
			this.data.url="/registration";
			
			/* @TODO only select a school from existing list or add new school */
			if($('#schoolName').val()){
				if(!$('#associatedSchoolId').val()){
					alert('Please select existing School or add a new one');
					return;
				}
			}
			
			//set validation for other degree field
			if(!$('#otherDegree').is(':hidden') && !$('#otherDegree').val()){
				this.data.models[0].set({'otherDegree':''});
			}
			
			//set validation for other graduationDate field
			if(!$('#graduationDate').is(':hidden') && !$('#graduationDate').val()){
				this.data.models[0].set({'graduationDate':''});
			}
			
			//set validation for degreeExpected field
			if(!$('#degreeExpected-set').is(':hidden') && !$('#degreeExpected').val()){
				this.data.models[0].set({'degreeExpected':''});
			}
			//set school details to modal 
			this.data.models[0].set({'userId':$('#myUserId').val(),'schoolName' : $('#schoolName').val() , 'associatedSchoolId' :$('#associatedSchoolId').val()});
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
			$('#step2_block textarea').attr('value','');
			$('.error').remove();
			
		},
		
		/**
		 * upload profile picture or profile video
		 */
		uploadProfilePic: function(e){
			e.preventDefault();				
		    $("#selectUploadPhoto").modal('hide');
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
		
		
		
		continuestep3 : function(e){
			
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
			else{
				
				$('#addPhoto').click();
			}
			
		},
		/**
		 *  steps 3 registration - image/video upload
		 */
		completeRegistration: function(e){
			e.preventDefault();
			$("#selectUploadPhoto").modal('show');
		},
		
		noprofilepic: function(e){		
			e.preventDefault();
			$("#selectUploadPhoto").modal('hide');
			window.location = "/class";		
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
			
	    },
	    
	    /**
	     * add text box field a enter degree when we choose 'Other' from  Degre Program  
	     */
	    addOtherDegree:function(eventName){
	    	
	    	  var id = eventName.target.id;
	    	  console.log($('#'+id).val());
	    	  if($('#'+id).val()== "Other")
	    	  {
	    		  $('#otherDegree').show();
	    	  }
	    	  else
	    	  {
	    		  $('#otherDegree').hide();
	    	  }
	    	  
	    	  
	    },
	    
	    /**
	     * to display 'degree expected' or 'date' field
	     */
	    showGraduateType:function(eventName){
	    	var id = eventName.target.id;
	    	var dat='#'+id;
	    	var value = $('#graduate').val();
	    	if(value == "attending" || value == "no")
	    	{
				$('#graduationDate-set').hide();
				$('#degreeExpected-set').show();
	    	}
	    	else if(value == "yes")
	    	{
				$('#degreeExpected-set').hide();
				$('#graduationDate-set').show();
				$('.datepicker').datepicker();
	    	}
	    	else
	    	{
				$('#degreeExpected-set').hide();
				$('#graduationDate-set').hide();
	    	}
	    },
	    
		
	})
	return RegistrationView;
});
