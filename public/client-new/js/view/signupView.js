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
            'blur .home_reg' : 'validationsymbol'
		},

		onAfterInit: function(){	
            this.data.reset();
            $('.sign-tick').hide(); 
            $('.sign-close').hide(); 	        
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
                  
        /**
        * @TODO  user registration 
        */
        registration:function(e){	
            e.preventDefault();
            this.data.url ="/signup";
            $('.sign-tick').hide(); 
            $('.sign-close').hide(); 
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
                alert('Signup successful \n\nPlease check your mail.');
            }
            else
            {
                alert(data.message);
            }	
            
            /* clear the fields and model */
            $('#signup-form').find("input[type=text], input[type=password]").val("");
            this.data.models[0].set({mailId:'',password :'' , confirmPassword : ''});
            $('span.error').remove();

		},
                
        /**
        * Method to set the value of "iam"
        */
        getUserTypeValue:function(eventName){
            eventName.preventDefault();

            $('.menu-pic div.active').removeClass('active');
            $(eventName.currentTarget).find('div').addClass('active');

            $("#usertype").val(eventName.currentTarget.id);	
            console.log($(eventName.currentTarget).attr('value'));
		},
		
        /**
         *  sign up via social media 
         */
		socialMediaSignup: function(e){
            e.preventDefault();
            console.log($(e.target).parents('a').attr('id'));
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
		}
 
	})
	return signupView;
});