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
		'text!templates/fileItem.tpl',
        ],function(FormView,FileItemTpl){
	
	var FileItemView;
	FileItemView = FormView.extend({
		objName: 'FileItemView',
		events:{
			// 'click .imageList': 'showImageList'

		},
		
		onAfterInit: function(){	
			this.data.reset();
		
        },
        
        /**
         * render the file item
         */
        render: function(){
        	
        	
        	var datas = {
			 	 "data" : this.model,
			 	 "fileType" :this.fileType
			 	 
		    }
        	compiledTemplate = Handlebars.compile(FileItemTpl);
        	$(this.el).html(compiledTemplate(datas));
        	
    		return this;
        },
        
       
         
       
	})
	return FileItemView;
});