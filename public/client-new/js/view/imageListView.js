/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/April/2013
* Description           : View image list on browse media
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
	
	var ImageListView;
	ImageListView = BaseView.extend({
		objName: 'ImageListView',

		events:{
			'click .ediTitle': 'editTilteDescription',
            'click .rock-medias': 'rockMedia',
           
		},
		
		onAfterInit: function(){	
			this.data.reset();
			shufflingOnSorting(); 
			 
        },

        /**
         * display file buckets
         */
        displayPage: function(callback){
            
			/* render file items */
        	_.each(this.data.models[0].attributes.photos, function(model) {

        		var datas = {
			 	 "data" : model,
			 	 "fileType" :"image",
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
        		
				// var fileItemView  = new FileItemView({model : model,fileType:"image"});
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
            
        }
        
       
		
       
	})
	return ImageListView;
});