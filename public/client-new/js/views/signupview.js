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
			    'click #registeration':'register',
			    'click .menu-pic':'getUserTypeValue',
			    'focusout .home_reg':'valdation'
		    },
	
			initialize : function() {		
			    console.log('Initializing Basic Registration View');
			    this.source = $("#tpl-userregistration_home").html();
			
			    this.template = Handlebars.compile(this.source);              
			    this.model.on("error", this.onerror,this);                
		    },
				
			render : function(eventName) {			
			    $(this.el).html(this.template);
			    return this;	
		    },
	
		    /**
		    * Method to register the details (save the details to backend)
		    */
			register: function(eventName){
				
			    eventName.preventDefault();
			    $(".sign-tick").show();
			    var password= $('#userpassword').val();
			    var confirmPassword =  $('#confirmpassword').val();    
			    
			    if(password===confirmPassword && password!=''){          //validation :- compare the password and confirmPassword
			
			        var response=this.model.set({                      
			            iam:$('input#usertype').val(),
			            mailid:$('#mailid').val(),
			            userpassword:password,
			            confirmpassword:confirmPassword                   
			        });
			        
			        var self = this;
			        if(response !=false){
			        	this.model.save();
			//	                        this.model.save(this.model, {type:'POST', url: 'http://localhost/client/api.php'}, {
			//	                            success : function(model, response) {								
			////	                            	self.model.set({
			////	                            		id : response
			////	                                });
			//	                            	console.log(response);
			////	                                BS.AppRouter.navigate("registration");						
			//	                            },
			//	                            error : function(model, response) {
			//	                                console.log("error ");
			//	                            }
			//	                        });    
			//	                    	BS.AppRouter.navigate("registration", {trigger: true});
			        }
			    }
			    else{
			        console.log(" 'confirmPassword' is not match with 'Password' ")
			        $('#userpassword').next().hide();
			        $('#confirmpassword').next().hide();
		        }
		    },
	
	
		    /**
		    * Method to set the value of "i am"
		    */
		    getUserTypeValue:function(eventName){
			    eventName.preventDefault();
			    console.log(eventName.currentTarget);
			    $('.menu-pic div.active').removeClass('active');
			    $(eventName.currentTarget).find('div').addClass('active');
			    $("#usertype").val(eventName.currentTarget.id);
			    
		    },
	
	
		    /**
		    * Method for validation (validation done in out of focus of the field)
		    */
			valdation:function(eventName){
			    console.log("test");
			    eventName.preventDefault();
			    var id=eventName.currentTarget.id
			    var value=$('#'+id).val();   
			    $(".sign-tick").show();
			    var map = {};                  //create json variable
			    map[id] = value;
			    this.model.set(map);
			    var regDetails = JSON.stringify( this.model);
		    },
	    
		    /**
		    * Method to handle error from model
		    */
			onerror: function( model, error ) {
			    _.each( error, function( fieldName ) {
			        
				    console.log(fieldName.name);
				    $('#'+fieldName.name).next().hide();
			    });
		    }
 
	});
