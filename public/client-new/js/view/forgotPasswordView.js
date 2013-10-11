/***
* BeamStream
*
* Author                : Cuckoo Anna(cuckoo@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 27/March/2013
* Description           : Backbone view for recover password page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView'], function(FormView){
	var RecoverPassword;
	RecoverPassword = FormView.extend({
		objName: 'RecoverPassword',
		
		events:{
			'click .menu-pic':'getUserTypeValue',
			'click #recover' : "postEmailId",
			'click .register-cancel' : "cancel"
		},

		onAfterInit: function(){	
            this.data.reset();
        },
        
        /**
         * post email address to recover the password
         */
        postEmailId : function(eventName){        	
        	eventName.preventDefault(); 

        	if($('#mailid').val()){
        		this.data.url ="/forgotPassword";
                this.saveForm();
        		
        	}else{
        		this.data.models[0].set({'mailId': ''});
        	}
        },
        
        /**
         * on success
         */
        success: function(model, data){
        	var self = this;
        	$('#mailid').val('');
		    	
        	if(data.status == "Success") 
    		{
    			 $('#forgot-pwd-loader').css("display","none");
    			 alert("Password has been sent to your emailId");    			 
    			 window.location = "/login";
    		}
    		else 
    		{
    			$('#forgot-pwd-loader').css("display","none");
    			alert("No User Found with this emailId");
    							
    		}
        	
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
         * redirected to login page on cancel button click
         */
        cancel : function(){	
        	 window.location = "/login";
        }
 
	})
	return RecoverPassword;
});