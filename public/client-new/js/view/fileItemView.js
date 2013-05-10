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
        '../../lib/extralib/jquery.prettyPhoto'
        ],function(FormView,FileItemTpl,PrettyPhoto){
	
	var FileItemView;
	FileItemView = FormView.extend({
		objName: 'FileItemView',
		events:{
			'click .ediTitle': 'editTilteDescription',
            'click .documents-popup': 'showFile',
            'click .rock_docs' : 'rockDocuments',
            'click .rock-medias': 'rockMedia',
           

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

                // //to check whether the url is a google doc url or not
                //  if(msgBody.match(/^(https:\/\/docs.google.com\/)/)) 
                //  {
                //      contentType = "googleDoc";
                //  }

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


            /* pretty photo functionality for video /image popups */
            $("area[rel^='prettyPhoto']").prettyPhoto();
            $(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({
                animation_speed:'normal',
                theme:'light_square',
                slideshow:3000, 
                autoplay_slideshow: true
            });
            $(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({
                animation_speed:'fast',
                slideshow:10000,
                hideflash: true
            });
        	
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

        },

        /**
        * show files in a popup
        */
        showFile: function(e){
            var docId = e.currentTarget.id, docUrl='';
            var fileType = $(e.currentTarget).attr('name');

            // /* show document is a popup */ 
            if(fileType == "googleDoc")
            {
                docUrl = $('input#id-'+docId).val();
                
            }
            else
            {
                docUrl = "http://docs.google.com/gview?url="+$('input#id-'+docId).val()+"&embedded=true"; 
                
            
            }
            $('#doc-title').html();
            $('#document-url').attr('src',docUrl);
            $('#doc_popup').modal("show");
        },

        /**
        * Rockds Documents 
        */
        rockDocuments: function(eventName){
            eventName.preventDefault();
            var element = eventName.target.parentElement;
            var docId =$(element).attr('id');
           
            this.data.url = "/rock/document/";
            // set values to model
            this.data.models[0].save({id : docId },{
                success : function(model, response) {
                   
                     $('#'+docId+'-activities li a.hand-icon').html(response);
                },
                error : function(model, response) {
                    console.log("error");
                }

            });
            
        },

        /**
        * Rockds media 
        */
        rockMedia: function(eventName){
            eventName.preventDefault();
            var element = eventName.target.parentElement;
            var docId =$(element).attr('id');
           
            this.data.url = "/rock/media";
            // set values to model
            this.data.models[0].save({id : docId },{
                success : function(model, response) {
                   
                     $('#'+docId+'-activities li a.hand-icon').html(response);
                },
                error : function(model, response) {
                    console.log("error");
                }

            });
            
        }

       
         
       
	})
	return FileItemView;
});