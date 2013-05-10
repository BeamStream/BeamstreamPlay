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
    	 	var extensionpattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
            var self = this,extension ='';
        	
        	if(this.fileType == "documents"){
    		 	extension= (this.model.documentURL).match(extensionpattern);
        		if(extension){
	        		extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
	                    return letter.toUpperCase();
	            	});
        		}
        	}
        	
    		console.log(extension);
        	var datas = {
			 	 "data" : this.model,
			 	 "fileType" :this.fileType,
			 	 "extension":extension
			 	 
		    }
        	compiledTemplate = Handlebars.compile(FileItemTpl);
        	$(this.el).html(compiledTemplate(datas));
        	
    		return this;
        },
        
       
         
       
	})
	return FileItemView;
});