/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone sign up page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView'], function(FormView){
	var signupView;
	signupView = FormView.extend({
		objName: 'signupView',
		
		events:{
            'click .menu-pic':'getUserTypeValue',
            'click #registeration': 'registration',
            'click .lastblock a' : 'socialMediaSignup',
            'keypress #password' : 'clearConfirmPasswordField',
            'click .register-cancel' : 'clearAllFields',
            'blur .home_reg' : 'validationsymbol',
            'blur #mailid':'chekemail',
		},

		onAfterInit: function(){	
            this.data.reset();
            $('.sign-tick').hide(); 
            $('.sign-close').hide(); 
            $('#mailid').prop('disabled',false);
            $('#password').prop('disabled',false);
            $('#confirmPassword').prop('disabled',false);
            
            
        },
        
        validationsymbol : function(e){
        	
        	var target = $(e.currentTarget).parent('fieldset').find('div.field-error');        	
        	if(target.length == 0 && $(e.currentTarget).val()){
        		$(e.currentTarget).parent('fieldset').find('div.sign-close').hide();
        		$(e.currentTarget).parent('fieldset').find('div.sign-tick').show();
        		
        	}else if($(e.currentTarget).val()){
        		$(e.currentTarget).parent('fieldset').find('div.sign-tick').hide();
        		$(e.currentTarget).parent('fieldset').find('div.sign-close').show();
        	}
        },
              
        
        chekemail: function(e){
        	
        	 var self = this;
				  var mailId = $("input#mailid").val();
				  var iam = "8080";
				  var password = '12345a';
				  var confirmPassword = '12345a';
				 $.ajax ({
					 type : 'POST',
					 url : "/signup",
					 dataType : "json",
				     contentType : "application/json",
					 data : JSON.stringify({
						 mailId : mailId,
						 iam : iam,
						 password : password,
						 confirmPassword : confirmPassword,
						 }),
						 
					 success : function(data){
						 if(data.status == "Failure")
						 alert(data.message);
					 }
				 });
			 
        },
        
        /**
        * @TODO  user registration 
        */
        registration:function(e){	
            e.preventDefault();
            this.data.url ="/signup";
            this.data.models[0].set('iam',$("#usertype").val());
            this.saveForm( );
        },

          
        /**
        * on form save success
        */
		success: function(model, data){
            var self = this;
            if(data.status == 'Success')
            {
            	$('.sign-tick').hide();
            	$('.sign-close').hide();
                alert('Signup successful \n\nPlease Check your Email for your \nSignup Confirmation Link.');
            }
            else
            {
                alert(data.message);
            }	
            
            /* clear the fields and model */
            $('#signup-form').find("input[type=text], input[type=password]").val("");
            this.data.models[0].set({mailId:'',password :'' , confirmPassword : ''});
            $('span.error').remove();
            $('.sign-tick').hide();
        	$('.sign-close').hide();

		},
                
        /**
        * Method to set the value of "iam"
        */
        getUserTypeValue:function(eventName){
            eventName.preventDefault();

            $('.menu-pic div.active').removeClass('active');
            $(eventName.currentTarget).find('div').addClass('active');

            $("#usertype").val(eventName.currentTarget.id);	
		},
		
        /**
         *  sign up via social media 
         */
		socialMediaSignup: function(e){
            e.preventDefault();
		},
		
		
        /**
        * clear confirm password field when we change the password
        */
		clearConfirmPasswordField: function(){
            $('#confirmPassword').val('');
		},
		
		/**
	        * clear all fields when we click cancel button
	        */
		clearAllFields : function(e){
			e.preventDefault();
			$('#signup-form').find("input[type=text], input[type=password]").val("");
			$('span.error').remove();
			$('.sign-tick').hide();
        	$('.sign-close').hide();
			
		}
 
	})
	return signupView;
});