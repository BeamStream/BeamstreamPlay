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
            'blur #mailid':'chekemail',
            'blur #password' : 'validatePassword',
            'blur #confirmPassword' : 'validateConfirmPassword',
            'blur #systemCode' : 'checkSystemCode'
		},

		onAfterInit: function(){	
            this.data.reset();
            $('.sign-tick').hide(); 
            $('.sign-close').hide(); 
            $('#mailid').prop('disabled',false);
            $('#password').prop('disabled',false);
            $('#confirmPassword').prop('disabled',false);
            
            
        },
        
        
        chekemail: function(e){
        	
        	var emailID = $("#mailid").val();
        	if(emailID.length != 0){
				var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
		        var checkStatus = pattern.test(emailID);
				if(checkStatus && emailID){
					$("#email-sign-tick").show();
					$("#email-sign-close").hide();
					$("#mailError").hide();
					
					
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
					
					
				}else{
					$("#email-sign-close").show();
					$("#mailError").show();
					$("#email-sign-tick").hide();
				}
        	}
        },
        
        
        validatePassword : function(e){
			var password = $("#password").val();
			var Len =password.length;
			if(Len != 0){
				if(Len > 5){
					$("#password-sign-tick").show();
					$("#password-sign-close").hide();
					$("#passwordError").hide();
				}else{
					$("#password-sign-tick").hide();
					$("#password-sign-close").show();
					$("#passwordError").show();
				}
			}
		},
		
		validateConfirmPassword : function(e){
			var confirmpassword = $("#confirmPassword").val();
			var password = $("#password").val();
			var Len =confirmpassword.length;
			
			$("#field-error").hide();
			$("#confirmpasswordError").hide();
			$("#confirmPassword-sign-tick").hide();
			$("#confirmPassword-sign-close").hide();
			
			if(Len != 0){
				if(Len > 5){
					$("#confirmPassword-sign-tick").show();
					$("#confirmPassword-sign-close").hide(); 
					$("#confirmpasswordError").hide(); 
					if(password != confirmpassword){
						$("#field-error").show();
						$("#confirmpasswordError").hide();
						$("#confirmPassword-sign-tick").hide();
						$("#confirmPassword-sign-close").show();
						 
					}else{
						$("#field-error").hide();
					}
				}else{
					$("#confirmPassword-sign-tick").hide();
					$("#confirmPassword-sign-close").show();
					$("#confirmpasswordError").show(); 
				}
			}
		},
		
		checkSystemCode : function(e){
			
			var systemCode = $("#systemCode").val();
			var length = systemCode.length;
			if(length != 0){
				if(length>5){
					$("#systemCode-sign-tick").show();
					$("#systemCode-sign-close").hide();
					$("#systemCodeError").hide();
				}else{
					$("#systemCode-sign-close").show();
					$("#systemCode-sign-tick").hide();
					$("#systemCodeError").show();
				}
			}
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