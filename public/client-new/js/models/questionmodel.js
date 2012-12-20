
/***
	 * BeamStream  @TODO
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 12/November/2012
	 * Description           : Backbone model for questions
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * @TODO
     */
	BS.Question = Backbone.Model.extend({
		idAttribute: "_id",
		
		defaults: {
	    	
	//		id:null,
	//		question:null,
	//		options:null,
			question:null,
			streamId:null,
			access:null,
	//		pollsOptions:null
			
	         
	    },
	});
