 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/November/2012
	 * Description           : Backbone model for user details 
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.SingleUser = Backbone.Model.extend({
	     
		 idAttribute: "_id",
		 
	        defaults: {
	        	
	        	id:null,
	        	userType:null,
	        	email:null,
	        	firstName:null,
	        	lastName:null,
	        	userName:null,
	        	alias:null,
	        	password:null,
	        	orgName:null,
	        	location:null,
	        	streams:null,
	        	schoolId:null,
	        	classId:null
	        },
	        url :BS.loggedInUserJson,
	        
	        authenticate: function() {
	        	 
	        	 $.ajax({
				    	type : 'GET',
				    	url : BS.loggedInUserJson,
				    	dataType : "json",
				    	success : function(data) {
				    		    BS.loggedUserId = data.id.id;
					    		if(data == "Session Has Been Expired") 
					    		{
					    			
					    			BS.user.set('loggedin', false);
					    		}
					    		else 
					    		{
					    			BS.user.set('loggedin', true);
					    		 
					    		}
					    		 
				    	 },
				    	 error : function(error){
				    			 console.log("error");
				    	 }
				    });
	    	}
	 
	        
	       
	});
 
 
