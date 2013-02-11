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
	        'click #registeration': 'registration'
                        
		},

		onAfterInit: function(){
			this.data.reset({'iam':'0'});
		},
		
		
		/**
		 * @TODO  user registration 
		 */
		registration:function(e){
			
	        e.preventDefault();
	        this.saveForm();
	        $('#mailid').val('');   
	        $('#password').val('');
	        $('#confirmPassword').val('');
	        
		},

		onBlur: function(e){
           e.preventDefault();
		},
          
		/**
		 * on form save success
		 */
		success: function(model, data){
    	   
			var self = this;
			$('#mailId').val('');
			if(!data.status == "Failure")
			{
				alert('Signup successfull');
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
	        this.data.reset({'iam' : eventName.currentTarget.id});	
               
		}
		
 
	})
	return signupView;
});