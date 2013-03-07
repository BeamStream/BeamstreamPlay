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


define(['view/formView'], function(FormView){
	var LoginView;
	LoginView = FormView.extend({
		objName: 'LoginView',
		
		events:{
                'click #login': 'login'
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
    
            // @TODO validation - save only when user enter mailid ,password
            if($('#mailid').val()&&$('#password').val()){  
                this.saveForm( );
            }  

            $('#mailid').val('');   
            $('#password').val('');
        },

          
        /**
        * on form save success
        */
		success: function(model, data){
    	   
            var self = this;
            $('#mailId').val('');

            if(data.status == 'Success')
            {
                alert('Login successfull');
            }
            else
            {
                alert(data.message);
            }		

		}
                
      
 
	})
	return LoginView;
});
