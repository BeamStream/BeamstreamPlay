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
		'view/fileItemView',
		'view/imageListView',
		'view/videoListView',
		'view/documentListView',
		'view/pdfListView',
		'view/presentationListView',
		'view/googleDocListView',
		'../../lib/bootstrap-modal',
        ],function(BaseView,FileItemView,ImageListView,VideoListView,DocumentListView,PdfListView,PresentationListView,GoogleDocListView,BootstrapModal){
	
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

			

			
		},
	 
		onAfterInit: function(){	
			this.data.reset();
			
        },


	 	displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
		},

		/**
		* shows image list view
		*/
		showImageList: function(){

			imageListView = new ImageListView({el: $('#grid')});
			imageListView.data.url = '/allPicsForAuser';
			// imageListView.fetch();

		},

		/**
		* shows video list view
		*/
		showVideoList: function(){

			videoListView = new VideoListView({el: $('#grid')});
			videoListView.data.url = '/allVideosForAuser';

		},

		/**
		* shows documents list view
		*/
		showDocumentList: function(){

			documentListView = new DocumentListView({el: $('#grid')});
			documentListView.data.url = '/allDOCSFilesForAUser';
			
		},

		/**
		* shows documents list view
		*/
		showPdfList: function(){
			
			pdfListView = new PdfListView({el: $('#grid')});
			pdfListView.data.url = '/allPDFFilesForAUser';

		},

		/**
		* shows presentation list view
		*/
		showPresentationList: function(){

			presentationListView = new PresentationListView({el: $('#grid')});
			presentationListView.data.url = '/allPPTFilesForAUser';
			
		},


		/**
		* shows google docs list view
		*/
		showGoogleDocList: function(){

			googleDocListView = new GoogleDocListView({el: $('#grid')});
			googleDocListView.data.url = '/getAllGoogleDocs';
			
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
                    console.log("error");
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
                    console.log("error");
                }

            });
            
        }
        
       
		
       
	})
	return FilesOverView;
});