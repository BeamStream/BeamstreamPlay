/***
	 * BeamStream
	 *
	 * Author                : Cuckoo Anna (cuckoo@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 20/September/2012
	 * Description           : Backbone model for uploaded documents
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
BS.Document = Backbone.Model.extend({
        defaults: {
        id: null,
        name: null, 
        url: null, 
        docType: null, 
        userId: null, 
        access: null, 
        streamId: null,
        docDescription:null,
        creationDate: null, 
        lastUpdateDate: null, 
        rocks: null, 
        rockers: null,
        comments : null
        }
        
});

BS.DocumentCollection = Backbone.Collection.extend({

    model:BS.Document 
	
});
