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
	BS.RegistrationView = Backbone.View.extend({
	
		events : {
			"click #registeration":"register"
		},
//	
		initialize : function() {
//			 
			console.log('Initializing Basic Registration View');
			this.source = $("#tpl-userregistration_home").html();
			this.template = Handlebars.compile(this.source);
//			
//			// for edit user details
//			BS.regBack = false;
//	
		},
//	 
		render : function(eventName) {
//			 
//			//get mail informations
//			 this.iam = eventName.iam;
//			 this.mailId = eventName.mail;
//			 
			 $(this.el).html(this.template);
			 return this;
//			
		},
                register: function(eventName){
                    eventName.preventDefault();
                    console.log("registre");
                    var usermodel = new BS.UserModel();
                    console.log("mail- "+$('#mailid').val()+", pass- "+$('#userpassword').val()+", confrm-"+$('#confirmpassword').val());
                    
                    usermodel.set({
                        
                        /*
			id : id,
			iam : this.iam,
			email : this.mailId,
			schoolName : $('#school-name').val(),
			userName : $('#user-name').val(),
			alias :"" ,
			password : $('#password1').val(),
			confirmPassword :  $('#password_again').val(),
			firstName : $('#first-name').val(),
			lastName : $('#last-name').val(),
			location : $('#location').val(),
			profile :"",
			useCurrentLocation : useCurrentLocation,
                        
                         
  */

                        
                       
//                iam:null,
                email:$('#mailid').val(),
                password:$('#userpassword').val(),
                confirmPassword:$('#confirmpassword').val()
                /*
//                firstName:null,
//                lastName:null,
//                schoolName:null,
//                major:null,
//                aboutYourself:null,
//                gradeLevel:null,
//                degreeProgram:null,
//                graduate:null,
//                cellNumber:null,
//                location:null
    */
		}); 
                var regDetails = JSON.stringify(usermodel);
                console.log(regDetails);
                
                 usermodel.save();

                }
//
            
            
            
            
            
            
	});
