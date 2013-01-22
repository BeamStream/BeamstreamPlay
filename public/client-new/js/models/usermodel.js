        /***
        * BeamStream
        *
        * Author                : Cuckoo Anna (cuckoo@toobler.com)
        * Company               : Toobler
        * Email:                : info@toobler.com
        * Web site              : http://www.toobler.com
        * Created               : 17/January/2013
        * Description           : Backbone model for user details 
        * ==============================================================================================
        * Change History:
        * ----------------------------------------------------------------------------------------------
        * Sl.No.  Date   Author   Description
        * ----------------------------------------------------------------------------------------------
        *
        * 
        */

        BS.UserModel = Backbone.Model.extend({
    
            defaults: {	        	
//                iam:0
//                mailid:null,
//                userpassword:null,
//                confirmpassword:null
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
	        },
                
                url:BS.verifyEmail,      
                
                    /**
                    * model side validation
                    */
                validate: function(attrs, options) {

                    var email_filter    = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;                         
//                                       var errors =[];
                                       

//                       
//                                                         
//                    var errors=new Array();


                    if (!email_filter.test(attrs.mailid)) 
                       {
//                        errors.push({name: 'email', error: 'Please enter a valid email address'});
                        return "No";

                        }
//                        
                        if (!attrs.userpassword){
                        return "No";  
                                }
//                     errors.push({name: 'no inputs', error: 'Please enter correct inputs'});

                        if(!attrs.confirmpassword) {
                            return "No";
                        }
                     
                    
//                    if (attrs.userpassword == '') {
////                        errors.push({name: 'userpassword', error: 'Please enter a valid password'});
//                        return "userpassword";             
//                        }
//                    if (attrs.confirmpassword == '') {
////                        errors.push({name: 'confirmpassword', error: 'Please enter a valid confirmpassword'});
//                        return "confirmpassword";        
//                        }
//                    return errors;

                    }
                    
    
});