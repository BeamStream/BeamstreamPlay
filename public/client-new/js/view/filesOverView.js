/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/April/2013
* Description           : View for files overview
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView',
        ],function(FormView ){
	
	var FilesOverView;
	FilesOverView = FormView.extend({
		objName: 'FilesOverView',
		filesPerPage: 10,
		pageNo: 1,

	 
		onAfterInit: function(){	
			this.data.reset();
			
        },

        /**
         * display file buckets
         */
        displayPage: function(callback){
             
			/* render messages */
        	_.each(this.data.models, function(model) {
				var messageItemView  = new MessageItemView({model : model});
				$('#messageListView div.content').append(messageItemView.render().el);
				
        	});
		},
        
       
		
       
	})
	return FilesOverView;
});