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
	        'click .lastblock a' : 'socialMediaSignup'
		},

		onAfterInit: function(){	
			this.data.reset({'password':'','mailId':'','confirmPassword':''});
	        $('.sign-tick').hide(); 
	        $('.sign-close').hide(); 
	        
        },
            
                            
        /**
        * @TODO  user registration 
        */
		registration:function(e){	
            e.preventDefault();
            
            // @TODO validation - save only when user enter mailid ,password, confirmPassword


            if($('#mailid').val()&&$('#password').val()&&$('#confirmPassword').val()){  
                this.data.models[0].set({'iam':$("#usertype").val()});
                this.saveForm( );
            }  

            $('#mailid').val('');   
            $('#password').val('');
            $('#confirmPassword').val('');        
        },

          
        /**
        * on form save success
        */
		success: function(model, data){
    	   
	        var self = this;
	        $('#mailId').val('');
	
	        if(data.status == 'Success')
	        {
	        	alert('Signup successfull \n\nPlease check your mail.');
	        }
	        else
	        {
	        	alert(data.message);
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
		 *  sign up via social media 
		 */
		socialMediaSignup: function(e){
			e.preventDefault();
			console.log($(e.target).parents('a').attr('id'));
		}
 
	})
	return signupView;
});