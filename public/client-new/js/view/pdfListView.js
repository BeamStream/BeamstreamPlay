/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/April/2013
* Description           : View for PDF list on browse media
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['baseView',
		'view/fileItemView'
        ],function(BaseView,FileItemView){
	
	var PdfListView;
	PdfListView = BaseView.extend({
		objName: 'PdfListView',

		
		onAfterInit: function(){	
			this.data.reset();
			 
        },

        /**
         * display file buckets
         */
        displayPage: function(callback){
            
			//* render file items */
        	_.each(this.data.models[0].attributes.documents, function(model) {
        		
				var fileItemView  = new FileItemView({model : model,fileType:"pdf"});
				$('#grid div.content').append(fileItemView.render().el);
				
        	});
		},

	 	displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
		},
        
       
		
       
	})
	return PdfListView;
});