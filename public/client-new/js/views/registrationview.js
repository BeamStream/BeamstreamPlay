 /***
	 * BeamStream
	 *
	 * Author                : Aswathy P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 18/January/2013
	 * Description           : Backbone view for registration
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.RegistrationView = Backbone.View.extend({
	
		events : {
			"click #done_step1" : "completeFirstStep",
			"click #done_step2" : "comepleteSecondStep",
			 
		},
		
		initialize : function() {
			
			console.log('Initializing Basic Registrationdf View');
			this.source = $("#tpl-registration").html();
			this.template = Handlebars.compile(this.source);
	
		},
		
		render : function(eventName) {
			
			//detach body contents inorder to fill it with new view
			$('#body-content').children().detach(); 
			
//			/* @TODO   render top menu */  
//	    	this.navView = new BS.NavView({ model: BS.user});
//	    	$('#topheader').html(this.navView.render().el);
			
			var source = $("#header-for-registration").html();
			var template = Handlebars.compile(source);
			$('#topheader').html(template);
			
	    	/*render middle content */
			$(this.el).html(this.template);
			$('#body-content').html(this.el);
		    	
	    	/* for drop down box style*/
	    	$('.selectpicker').selectpicker();
	    	$('.selectpicker-info').selectpicker({
	           style: 'register-select'
	    	});
	    	
	    	/*for tool tip */
//	    	$('.location-toolip').tooltip({template:'<div class="tooltip loactionblue"><div class="tooltip-inner"></div></div>'})
//			$('.register-toolip-outer').tooltip({template:'<div class="tooltip register-right-toolip"><div class="tooltip-inner"></div></div>'})
			
		    	
		},
		
		/**
		 * first step registration - janRain 
		 */
		completeFirstStep: function(eventName){
			
			eventName.preventDefault();
			
			/* disable first step and enable step 2 block */
			$('#step_1').hide(500);
			$('#step1_block').removeClass('active-border');
			$('#step2_block').removeClass('box-active');
			$('#step2_block').addClass('active-border');
			$('#step_2').show(500);
			
			
//			var newUser = new BS.UserModel();
//			newUser.url = "/user/" + 12;
//			newUser.fetch();
//			console.log(BS.usermodel.get('mailid'));
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
			
			
			
			
			/* disable second step and enable step 3 block */
			$('#step_2').hide(500);
			$('#step2_block').removeClass('active-border');
			
//			var upload_block = '<div id="step3_block" class="round-block upload-photo step-3-photo"> <a href="#">'
//								+'<div class="upload-box">'
//								+'<div class="upload-plus">Upload</div>'
//								+'</div>'
//								+'</a> </div>';\\
//			<div class="round-block upload-photo step-one-photo" id="step3_block"> 
//            <a href="#"> </a> 
//            </div>
			
			var upload_block = '<div id="step3_block" class="round-block upload-photo step-3-photo">'
							    +'<a href="#"><div class="upload-box"><div class="upload-plus">Upload</div></div></a>'
				                +'</div>';
			$('#upload-step').html(upload_block);
			$('#step_3').show(500);
			
		}
       
            

	});
