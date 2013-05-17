/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/April/2013
* Description           : View google odcs list on browse media
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['baseView',
		'text!templates/fileItem.tpl',
        ],function(BaseView,FileItemTpl){
	
	var GoogleDocListView;
	GoogleDocListView = BaseView.extend({
		objName: 'GoogleDocListView',

		events:{
			'click .ediTitle': 'editTilteDescription',
            'click .documents-popup': 'showFile',
            'click .rock_docs' : 'rockDocuments',

		},


		
		onAfterInit: function(){	
			this.data.reset();
			 
        },

        /**
         * display file buckets
         */
        displayPage: function(callback){

			/* render file items */
        	_.each(this.data.models[0].attributes.documents, function(model) {

        		var datas = {
			 	 "data" : model,
			 	 "fileType" :"googleDoc",
		    	}

        		var compiledTemplate = Handlebars.compile(FileItemTpl);
        		$('#grid div.content').append(compiledTemplate(datas));
				// var fileItemView  = new FileItemView({model : model,fileType:"googleDoc"});
				// $('#grid div.content').append(fileItemView.render().el);
				
        	});
		},

	 	displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
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
                }

            });
            
        },
       
		
       
	})
	return GoogleDocListView;
});