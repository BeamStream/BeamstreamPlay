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
define(['view/formView'], function(FormView){
	var RegistrationView;
	RegistrationView = FormView.extend({
		objName: 'RegistrationView',
                
        events : {
			'click #done_step1' : 'completeFirstStep',
			'click #done_step2' : 'comepleteSecondStep',
			'click #step2-reset' : 'resetStep2Form',
			'click .browse' : 'uploadProfilePic',
			'change #uploadProfilePic' :'changePicture',
			 
		},
		
		onAfterInit: function(){
			
			this.data.reset();

			/* set style for select boxes */
//			$('.selectpicker-info').selectpicker({
//		       style: 'register-select'
//			});
//			$('.location-toolip').tooltip({template:'<div class="tooltip loactionblue"><div class="tooltip-inner"></div></div>'});
		},
		

		/**
		 * complete step1 registration process
		 */
        completeFirstStep: function(e){
        	
        	e.preventDefault();
            console.log("Complete first step ...")
            
            /* disable first step and enable step 2 block */
            $('#step_1').hide(500);
            $('#step1_block').removeClass('active-border');
            $('#step2_block').removeClass('box-active');
            $('#step2_block').addClass('active-border');
            $('#step_2').show(500);
            
        },
                
        /**
		 * complete step2 registration process - user details form
		 */
		comepleteSecondStep: function(e){
			
			e.preventDefault();
            var t = this.saveForm();
            console.log(t);
            
            $('#step_2').hide(500);
			$('#step2_block').removeClass('active-border');
			
//			var upload_block = '<div id="step3_block" class="round-block upload-photo"> <a class="browse" href="#">'
//								+'<div class="upload-box">'
//								+'<div class="upload-plus">Upload</div>'
//								+'</div>'
//								+'</a> </div>';
//			
			var upload_block = '<div id="step3_block" class="round-block upload-photo step-3-photo">'
			    +'<a class="browse" href="#"> <img src="" id="profile-photo"> <div class="upload-box"><div class="upload-plus">Upload</div></div></a>'
                +'</div>';
			$('#upload-step').html(upload_block);
			$('#step_3').show(500);
			
		},
		
		/**
		 * step 2 registration success
		 */
		success: function(model, data){
			
			/* disable second step and enable step 3 block */
			$('#step_2').hide(500);
			$('#step2_block').removeClass('active-border');
			
//			var upload_block = '<div id="step3_block" class="round-block upload-photo"> <a class="browse" href="#">'
//								+'<div class="upload-box">'
//								+'<div class="upload-plus">Upload</div>'
//								+'</div>'
//								+'</a> </div>';
			var upload_block = '<div id="step3_block" class="round-block upload-photo step-3-photo">'
			    +'<a class="browse" href="#"> <img src="" id="profile-photo"> <div class="upload-box"><div class="upload-plus">Upload</div></div></a>'
                +'</div>';
			$('#upload-step').html(upload_block);
			$('#step_3').show(500);

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
		changePicture: function(e){
			
//	    	 $('#profile-photo').attr("src","");
//	    	 $('#profile-photo').attr("src","images/loading1.gif");
	    	 
	    	 var self = this;;
	    	 file = e.target.files[0]; 
	         
	         var reader = new FileReader();
	         
	         /* Only process image files. */
	         if (!file.type.match('image.*') && !file.type.match('video.*')) {
	        	 
	        	 console.log("Error: file type not allowed");
//	        	 $('#profile-photo').attr("src","images/no-photo.png");
//			     $('#profile-photo').attr("name", "profile-photo");
//			     $('.delete-image').hide();
//			     $('#image-info').html('File type not allowed');
	 
	         }
	         else
	         {
	                    	 
	        	 /* capture the file informations */
	             reader.onload = (function(f){
	            	 
	            	 self.image = file;
	            	 return function(e){
	            		
	        		     $('#profile-photo').attr("src",e.target.result);
	        		
	        		 };
	            })(file);
	            
	            // read the image file as data URL
	            reader.readAsDataURL(file);   
	         }
		}
	})
	return RegistrationView;
});
