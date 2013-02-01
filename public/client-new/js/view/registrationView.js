/***
* BeamStream
*
* Author                : Cuckoo Anna (cuckoo@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone model for user details 
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/
define(['view/formView','model/user'], function(FormView,UserModel){
	var RegistrationView;
	RegistrationView = FormView.extend({
		objName: 'RegistrationView',
                
                events : {
			"click #done_step1" : "completeFirstStep",
			"click #done_step2" : "comepleteSecondStep"
			 
		},
                 onAfterInit: function(){
//                     var user = new UserModel();
//                    console.log("registration..")
			this.data.reset();
//                        this.saveForm();
		},
                
                completeFirstStep: function(){
                    console.log(" first step ...")
                    $('#step_1').hide(500);
                    $('#step1_block').removeClass('active-border');
                    $('#step2_block').removeClass('box-active');
                    $('#step2_block').addClass('active-border');
                    $('#step_2').show(500);
                },
                
                /**
		 *  second step registration 
		 */
		comepleteSecondStep: function(eventName){
			
			eventName.preventDefault();
			
			var firstName = $('#firstName').val();
			var lastName = $('#lastName').val();
			var schoolName = $('#schoolName').val();
			var major = $('#major').val();
			var aboutYourself = $('#aboutYourself').val();
			var gradeLevel = $('#gradeLevel').val();
			var degreeProgram = $('#degreeProgram').val();
			var graduate = $('#graduate').val();
			var cellNumber = $('#cellNumber').val();
			var location = $('#location').val();
			
			
			console.log("gradeLevel" + gradeLevel);
			console.log("degreeProgram" + degreeProgram);
			console.log("graduate" + graduate);
			console.log("cellNumber" + cellNumber);
			console.log("location" + location);
                       this.saveForm();
			
			
			
			
			/* disable second step and enable step 3 block */
			$('#step_2').hide(500);
			$('#step2_block').removeClass('active-border');
			
			var upload_block = '<div id="step3_block" class="round-block upload-photo"> <a href="#">'
								+'<div class="upload-box">'
								+'<div class="upload-plus">Upload</div>'
								+'</div>'
								+'</a> </div>';
			$('#upload-step').html(upload_block);
			$('#step_3').show(500);
			
		}
		
	})
	return RegistrationView;
});
