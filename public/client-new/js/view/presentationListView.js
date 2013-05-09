/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/April/2013
* Description           : View presentation list on browse media
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
	
	var PresentationListView;
	PresentationListView = BaseView.extend({
		objName: 'PresentationListView',

		
		onAfterInit: function(){	
			this.data.reset();
			 
        },

        /**
         * display file buckets
         */
        displayPage: function(callback){
            
			/* render file items */
        	_.each(this.data.models[0].attributes.documents, function(model) {
        		
				var fileItemView  = new FileItemView({model : model,fileType:"ppt"});
				$('#grid div.content').append(fileItemView.render().el);
				
        	});
		},

	 	displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
		},
        
       
		
       
	})
	return PresentationListView;
});