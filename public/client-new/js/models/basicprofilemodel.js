/***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 12/september/2012
	 * Description           : Backbone MODEL for basic profile information of user
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.BasicProfile = Backbone.Model.extend({
     
	    defaults: {
	    	id:null,
	    	iam:null,
	    	email:null,
	        schoolName:null,
	        userName:null,
	        alias:null,
	        password:null,
	        confirmPassword:null,
	        firstName:null,
	        lastName:null,
	        location:null,
	        profile:null,
	        useCurrentLocation:null,
	    },
        
	});

 
