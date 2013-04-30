/***
* BeamStream
*
* Author                : Cuckoo Anna(cuckoo@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/March/2013
* Description           : Backbone login template
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['view/formView'], function(FormView ){
	var LoginView;
	LoginView = FormView.extend({
		objName: 'LoginView',
		
		events:{
	        'click #login': 'login',
	        'keyup #password' : 'loginOnEnterKeyPress',
	        'click .register-cancel' : 'clearAllFields',
	        'blur .home_reg' : 'validationsymbol'
		},

		onAfterInit: function(){	
            this.data.reset();
            localStorage["logged"] = '';
            $('.sign-tick').hide(); 
            $('.sign-close').hide(); 
            
        },
        
        /**         
         * tick and cross mark handling
         */
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
        login:function(e){	
            e.preventDefault();
            this.data.url = "/login";            
            this.saveForm();
 
        },
        
        /**
        * on form save success
        */
		success: function(model, data){
    	   
            var self = this;
            
            // On login success redirect to stream page
            if(data.result.status == 'Success')
            {	
            	$('.sign-tick').hide();
            	$('.sign-close').hide();
            	// set the logged users profile picture and Id
            	localStorage["loggedUserProfileUrl"] =  data.profilePicOfUser;
            	localStorage["loggedUserId"] =  data.user.id.id;
            	
            	window.location = "/stream";
            }
            else
            {
                alert(data.result.message);
                
            }	
            
            /* clear the fields and model */
            $('#login-form').find("input[type=text], input[type=password]").val("");
            this.data.models[0].set({mailId:'',password :''});
            $('span.error').remove();
            $('.sign-tick').hide();
        	$('.sign-close').hide();
            

		},
		
		/**
		 * login on enter key press on password field
		 */
		loginOnEnterKeyPress: function(eventName){
			var self = this;
			if(eventName.which == 13) {
				self.login(eventName); 
			}
		},
		
		/**
	        * clear all fields when we click cancel button
	        */
		clearAllFields : function(e){
		    e.preventDefault();
		    $('#login-form').find("input[type=text], input[type=password]").val("");
		    $('span.error').remove();
		    $('.sign-tick').hide();
        	$('.sign-close').hide();
		}
 
	})
	return LoginView;
});
