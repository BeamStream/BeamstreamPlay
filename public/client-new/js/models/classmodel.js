/***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 12/september/2012
	 * Description           : Backbone MODEL for class
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.Class = Backbone.Model.extend({
		
		
	        defaults: {
	        	
	        	schoolId:null,
	        	id:null,
	            classCode:null,
	            classTime:null,
	            className:null,
	            startingDate:null,
	            classType:null,
	
	        },
	        
	});

	BS.ClassCollection = Backbone.Collection.extend({
	
	    model:BS.Class, 
		
	});