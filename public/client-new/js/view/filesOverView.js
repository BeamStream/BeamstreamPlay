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

define(['baseView',
		'view/imageListView',
		'view/videoListView',
		'view/documentListView',
		'view/pdfListView',
		'view/presentationListView',
		'view/googleDocListView',
		'../../lib/bootstrap-modal',
		'../../lib/extralib/jquery.shuffle',
		'../../lib/bootstrap',
		'text!templates/fileItem.tpl',
		'text!templates/browseMedia.tpl',
        ],function(BaseView,ImageListView,VideoListView,DocumentListView,PdfListView,PresentationListView,GoogleDocListView,BootstrapModal,Shuffle,Bootstrap,FileItemTpl,BrowseMedia){
	
	var FilesOverView;
	FilesOverView = BaseView.extend({
		objName: 'FilesOverView',

		events:{
			'click .image-list' : 'showImageList',
			'click .video-list' : 'showVideoList',
			'click .document-list' : 'showDocumentList',
			'click .pdf-list' : 'showPdfList',
			'click .ppt-list' : 'showPresentationList',
			'click .doctitle': 'editMediaTitle',
			'click .googleDocs-list': 'showGoogleDocList',
			'click .rock_doc' : 'rocksDocument',
            'click .rock-media': 'rocksMedia',


            'click .ediTitle': 'editMediaTitle',
            'click .documents-popup': 'showFile',
            'click .rock_docs' : 'rockDocuments',
            'click .rock-medias': 'rockMedia',

		},
	 
		onAfterInit: function(){	
			this.data.reset();
			shufflingOnSorting();
			
        },

        displayPage: function(callback){
        	if($('#grid').attr('name') == 'allFiles'){
	        	var extensionpattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
				if(this.data.models[0].attributes.documents){
					_.each(this.data.models[0].attributes.documents, function(model) {

						var extension ='',fileType='';

		        		extension= (model.documentURL).match(extensionpattern);
		        		if(extension){
			        		extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
			                    return letter.toUpperCase();
			            	});
		        		}

		        		if(model.documentType.name == 'GoogleDocs'){
		        			fileType = 'googleDoc';
		        		}
		        		else{
		        			if(extension == 'Pdf'){
		        				fileType = 'pdf';
		        			}
		        			else if(extension == 'Ppt'){
		        				fileType = 'ppt';
		        			} 
		        			else{
		        				fileType = 'documents';
		        			}

		        		}
						var datas = {
					 	 "data" : model,
					 	 "extension":extension,
					 	 "fileType" : fileType,
				    	}

						var compiledTemplate = Handlebars.compile(FileItemTpl);
	        			$('#grid div.content').append(compiledTemplate(datas));
					});
				}

				if(this.data.models[0].attributes.media){

					_.each(this.data.models[0].attributes.media, function(model) {

						fileType='';
						if(model.contentType.name == "Image"){
							fileType = "image";
						}
						else{
							fileType = "video";
						}

						var datas = {
					 	 "data" : model,
					 	 "fileType" :fileType,
				    	}

						var compiledTemplate = Handlebars.compile(FileItemTpl);
	        			$('#grid div.content').append(compiledTemplate(datas));

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
						});

						

				}
			}
			else{

				var template = Handlebars.compile(BrowseMedia);
    			$('#grid div.content').append(template(JSON.parse(JSON.stringify(this.data))));


			}



			
		},


	 	displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
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
                }

            });
            
        },

		/**
		* shows image list view
		*/
		showImageList: function(){

			imageListView = new ImageListView({el: $('#grid')});
			imageListView.data.url = '/allPicsForAuser';
			$('#grid').attr('name','imageList');

		},

		/**
		* shows video list view
		*/
		showVideoList: function(){

			videoListView = new VideoListView({el: $('#grid')});
			videoListView.data.url = '/allVideosForAuser';
			$('#grid').attr('name','videoList');

		},

		/**
		* shows documents list view
		*/
		showDocumentList: function(){

			documentListView = new DocumentListView({el: $('#grid')});
			documentListView.data.url = '/allDOCSFilesForAUser';
			$('#grid').attr('name','documentList');
			
		},

		/**
		* shows documents list view
		*/
		showPdfList: function(){
			
			pdfListView = new PdfListView({el: $('#grid')});
			pdfListView.data.url = '/allPDFFilesForAUser';
			$('#grid').attr('name','pdfList');

		},

		/**
		* shows presentation list view
		*/
		showPresentationList: function(){

			presentationListView = new PresentationListView({el: $('#grid')});
			presentationListView.data.url = '/allPPTFilesForAUser';
			$('#grid').attr('name','presentationList');
			
		},


		/**
		* shows google docs list view
		*/
		showGoogleDocList: function(){

			googleDocListView = new GoogleDocListView({el: $('#grid')});
			googleDocListView.data.url = '/getAllGoogleDocs';
			$('#grid').attr('name','googleDocList');

			
		},

		

		/**
         *  Show the popup for editing title and description of uploaded files
         */
        editMediaTitle: function(eventName){
        	
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
        * Rockds Documents 
        */
        rocksDocument: function(eventName){
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

        /**
        * Rockds media 
        */
        rocksMedia: function(eventName){
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
                }

            });
            
        }
        
       
		
       
	})
	return FilesOverView;
});