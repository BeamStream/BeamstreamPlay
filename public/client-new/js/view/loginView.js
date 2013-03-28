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
		},

		onAfterInit: function(){	
            this.data.reset();
            $('.sign-tick').hide(); 
            $('.sign-close').hide(); 
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
            $('#mailId').val('');
            
            // On login success redirect to stream page
            if(data.status == 'Success')
            {
            	window.location = "/stream";
            }
            else
            {
            	$('#password').val('');
                alert(data.message);
            }		

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

 
	})
	return LoginView;
});
