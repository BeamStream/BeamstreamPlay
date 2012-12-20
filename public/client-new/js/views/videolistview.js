BS.VideoListView = Backbone.View.extend({
            events:{
                "click .videotitle" : "editVideoTitle",
                "click .rock_docs" : "rocksVideos",
                "click .show_rockers" : "showDocRockers",
                "click .then-by li a" : "filterDocs",
                "click #view-files-byrock-list" : "selectViewByRock",
                "click #by-class-list li" :"sortByClass",
                "click #category-list li" :"sortBycategory",
                "click #view-by-date-list" : "selectViewByDate",
                "mouseenter .photo-popup": "showCursorMessage",
                "mouseout  .photo-popup": "hideCursorMessage",
                },
    
            initialize:function(){
                this.source = $("#tpl-docsview").html();
                this.template = Handlebars.compile(this.source);
                this.videolisting();
                },
                
            render:function (eventName) {
                $(this.el).html(this.template);
                return this;
                },
                
                /**
                * NEW THEM - filter docs.. and prevent default action
                */
            filterDocs :function (eventName){
                eventName.preventDefault();
                },
                
                /**
                * NEW THEME - view files 
                */
            selectViewByRock: function(eventName){
                eventName.preventDefault();
                $('#view-files-byrock-select').text($(eventName.target).text());
                },
                
                /**
                * NEW THEME - sort files by class/School
                */
            sortByClass: function(eventName){               	
                eventName.preventDefault();
                $('#by-class-select').text("by "+$(eventName.target).text());
                },
                
                /**
                * NEW THEME - view files by date 
                */
            selectViewByDate: function(eventName){
                eventName.preventDefault();
                $('#view-by-date-select').text($(eventName.target).text());
                },
                               
                /**
                * NEW THEME - sort files by category
                */
            sortBycategory: function(eventName){
                eventName.preventDefault();
                $('#category-list-select').text($(eventName.target).text());
                },
            
                /**
                * list all videos in seperate view
                */
            videolisting:function(){
                $('#content').children().detach();
                var i = 1;
                var self = this;
                var arrayvideos = new Array();
                var content='';
                var coverpicture; 
                BS.user.fetch({ success:function(e) {
                /* get videos for user */
                $.ajax({
                    type : 'GET',
                    url : BS.allProfileVideos,
                    dataType : "json",                                                               
                success : function(videos) {
                    $('#grid').html("");    
                    _.each(videos, function(video) {                        	
                            BS.filesMediaView = new BS.FilesMediaView(); 
                            var datVal =  BS.filesMediaView.formatDateVal(video.dateCreated);                          
                            var datas = {
                                "video" : video,
                                "datVal" :datVal,
                                "videoCount" : i
                                }	
                            var source = $("#tpl-single-video").html();
                            var template = Handlebars.compile(source);				    
                            $('#grid').append(template(datas));                
                            i++;
                        });                  
                        // Call common Shuffling function         
                        shufflingOnSorting();                        
                            /* for video popups */
                        $("area[rel^='prettyPhoto']").prettyPhoto();
                        $(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: true});
                        $(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});   
                    }
                    });

                }});
            }, 
       
            
            /*Edit the Video title
            * 
            */  
        editVideoTitle :function(eventName){  
                var videoId = eventName.currentTarget.id;             
                $.ajax({                                       
                type : 'POST',
                url :  BS.getMedia,
                data : {
                    userMediaId: videoId  
                    },
                dataType : "json",
                success : function(videos) {                          
                    var imagedatas = {
                        "id" : videos[0].id.id,
                        "url" : videos[0].mediaUrl,
                        "type" : 'UserMedia',
                        "title" : videos[0].name,
                        "description" : videos[0].description
                        }
                        BS.mediaeditview = new  BS.MediaEditView();
                        BS.mediaeditview.render(imagedatas);
                        $('#gdocedit').html(BS.mediaeditview.el);
                        $('#edit-bootstrap_popup').modal('show');
                        }
                    });
            
                },
            
                /**
                * Rocks Google docs
                */
            rocksVideos:function(eventName){   
                eventName.preventDefault();
                var element = eventName.target.parentElement;
                var videoId =$(element).attr('id');
                // post documentId and get Rockcount 
                $.ajax({
                    type: 'POST',
                    url:BS.rockTheUsermedia,
                    data:{
                       userMediaId:videoId
                    },
                    dataType:"json",
                success:function(data){	              	 
     	              	// display the rocks count  
                    $('#'+videoId+'-activities li a.hand-icon').html(data);	   
                    }
                    });
                },
                /**
                * show document Rockers list 
                */
            showDocRockers :function(eventName){
                eventName.preventDefault();
                var element = eventName.target.parentElement; 
                var videoId =$(element).closest('div').parent('div').attr('id');
                $.ajax({
                   type: 'POST',
                   url:BS.giveMeRockersOfUserMedia,
                   data:{
                	   userMediaId:videoId
                   },
                   dataType:"json",
                success:function(data){               	 
                    // prepair rockers list
                    var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">Who Rocked it ?</div><ul class="rock-list">';
                    _.each(data, function(rocker) { 					 
                            ul+= '<li>'+rocker+'</li>';
                            });
                    ul+='</ul>';   
                    $('#'+videoId+'-docRockers-list').fadeIn("fast").delay(1000).fadeOut('fast'); 
                    $('#'+videoId+'-docRockers-list').html(ul);
                    }
                });     	   
            },
          
                /**
                * NEW THEME - show a cursor message on files-media preview
                */
            showCursorMessage: function(){
                $.cursorMessage('Click to view ', {hideTimeout:0});
		},
		
		/**
		 * NEW THEME - show a cursor message on files-media preview
		 */
            hideCursorMessage: function(){
                $.hideCursorMessage();
		}
            
})


