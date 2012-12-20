/***
	 * BeamStream @TODO
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 12/November/2012
	 * Description           : Backbone MODEL for question options 
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 *  @TODO
     */


BS.Option = Backbone.Model.extend({
 
	idAttribute: "_id",
	defaults: {
    	
		optionId:null,
		optionData:null,
         
    },
});

BS.OptionCollection = Backbone.Collection.extend({
    model: BS.Option,
});
