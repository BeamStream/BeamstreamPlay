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
			'click .ediTitle': 'editTilteDescription'

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
        	
        	var datas = {
			 	 "data" : this.model,
			 	 "fileType" :this.fileType,
			 	 "extension":extension
			 	 
		    }
        	compiledTemplate = Handlebars.compile(FileItemTpl);
        	$(this.el).html(compiledTemplate(datas));
        	
    		return this;
        },

        /**
        * Edit title and description
        */
        editTilteDescription: function(eventName){
        	/* show the doc details in the popupa */
        	var mediaId = eventName.currentTarget.id; 
        	$('#docId').val(mediaId);
        	$('#docType').val($('#fileType-'+mediaId).attr('value'));
        	$('#edit-file-name').html('Edit '+ $('#name-'+mediaId).text()) ;  
        	$('#docName').val($('#name-'+mediaId).text()) ;  
        	$('#docDescription').val($('#description-'+mediaId).text()) ;   

			$('#editMedia').modal("show");

        }
        
       
         
       
	})
	return FileItemView;
});