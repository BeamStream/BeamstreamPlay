        /***
        * BeamStream
        *
        * Author                : Cuckoo Anna (cuckoo@toobler.com)
        * Company               : Toobler
        * Email:                : info@toobler.com
        * Web site              : http://www.toobler.com
        * Created               : 17/January/2013
        * Description           : Backbone view for registration
        * ==============================================================================================
        * Change History:
        * ----------------------------------------------------------------------------------------------
        * Sl.No.  Date   Author   Description
        * ----------------------------------------------------------------------------------------------
        *
        * 
        */
	BS.SignUpView = Backbone.View.extend({
	
            events : {
                "click #registeration":"register",
                "click .menu-pic":"getValue",
                "focusout .home_reg":"valdation"
                },
                
            initialize : function() {		
                console.log('Initializing Basic Registration View');
                this.source = $("#tpl-userregistration_home").html();
                this.template = Handlebars.compile(this.source);	
                
                this.model.on("error", function(model, error) {                 
                    console.log(error);
 
                    });
		},
		
            render : function(eventName) {			
                $(this.el).html(this.template);
                return this;	
		},
                
                /**
                * Method to register the details 
                */
            register: function(eventName){
                eventName.preventDefault();
                var password= $('#userpassword').val();
                var confirmPassword =  $('#confirmpassword').val();                
                if(password===confirmPassword){                        //validation :- compare the password and confirmPassword
                   var t =  this.model.set({
                	   iam:$('input#usertype').val(),
                       mailid:$('#mailid').val(),
                       userpassword:password,
                       confirmpassword:confirmPassword
                        });
                   console.log(t);
                   if(t == false)
                	 {
                	   console.log("error");
                	 }
                   else
                	  {
                	   this.model.save();
                	  }
//                    this.model.save();
                    }
                else{
                    console.log(" 'confirmPassword' is not match with 'Password' ")
                    }
             

                },
                
                /**
                * Method to set the value of "i am"
                */
            getValue:function(eventName){
                eventName.preventDefault();
                $("#usertype").val(eventName.currentTarget.id);
                },
                
                /**
                * Method for validation (validation done in out of focus of the field)
                */
            valdation:function(eventName,param){
                eventName.preventDefault();
                var id=eventName.currentTarget.id
                var value=$('#'+id).val();   
                
                var map = {};                  //create json variable
                map[id] = value;
//                this.model.on("error", function(model, error) {                 
//                    console.log('error');
////                  _.each(error, function(eror) {
//////                     console.log(eror);
////                       console.log(eror.error);
////                      })
//                    });
                this.model.set(map);
                
//                var regDetails = JSON.stringify( this.model);
//                console.log("modeo -"+regDetails);
                      
                }
	});
