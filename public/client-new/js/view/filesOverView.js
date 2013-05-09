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
		'text!templates/browseMedia.tpl',
        ],function(BaseView,FileItemView,ImageListView,VideoListView,DocumentListView,PdfListView,PresentationListView,BrowseMediaTpl){
	
	var FilesOverView;
	FilesOverView = BaseView.extend({
		objName: 'FilesOverView',

		events:{
			'click .image-list' : 'showImageList',
			'click .video-list' : 'showVideoList',
			'click .document-list' : 'showDocumentList',
			'click .pdf-list' : 'showPdfList',
			'click .ppt-list' : 'showPresentationList',
			
			

			
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
			console.log(33);
			presentationListView = new PresentationListView({el: $('#grid')});
			presentationListView.data.url = '/allPPTFilesForAUser';
			

		}
        
        
       
		
       
	})
	return FilesOverView;
});