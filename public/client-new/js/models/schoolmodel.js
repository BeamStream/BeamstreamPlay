 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/August/2012
	 * Description           : Backbone model for school
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.School = Backbone.Model.extend({
	     
		 idAttribute: "_id",
	        defaults: {
	        	id: null,
	            schoolName: null,
	            year: null,
	            degreeExpected: null,
	            major: null,
	            degree: null,
	            graduated: null,
	            graduationDate: null
	            
	        }
	        
	});
	
	 BS.SchoolCollection = Backbone.Collection.extend({
	 
	    model:BS.School,
	    url: BS.schoolJson,
	 
	
	});    
 

 
