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
             //   iam:null,
            //    mailid:null,
             //   userpassword:null,
             //   confirmpassword:null
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
                
//                 BS.email= "/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i";
                
                validate: function(attrs, options) {
                             var email_filter    = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                             var errors=new Array();
//                    if (attrs.userpassword != attrs.confirmpassword) {
////                    return "passwors ia not same as confirmPassword";
//                        errors.push({name: 'password', error: 'error in password'});
//                    }
                   if (!email_filter.test(attrs.mailid)) 
                       {
                        errors.push({name: 'email', error: 'Please enter a valid email address'});
//                        return "passwors ia not same as confirmPassword";

                    }
                     return errors;
                    }
                    
    
});