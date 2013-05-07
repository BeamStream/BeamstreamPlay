/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/May/2013
* Description           : View for File bucket 
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView',
        ],function(FormView){
	
	var FileItemView;
	FileItemView = FormView.extend({
		objName: 'FileItemView',
		events:{
			
		},
		
		onAfterInit: function(){	
			this.data.reset();
		
        },
        
        /**
         * render the message item
         */
        render: function(){
        	
			
			// render the template
        	// compiledTemplate = Handlebars.compile(DiscussionMessage);
        	// $(this.el).html(compiledTemplate(datas));
        	
    		return this;
        },
        
        
        
       
	})
	return FileItemView;
});