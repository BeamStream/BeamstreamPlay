BS.VideoListView = Backbone.View.extend({
            events:{
                "click a#file-type" : "showFilesTypes",
                "click ul.file-type li a" : "hideList",
                "click .videotitle" : "editVideoTitle",
                "click .rock_docs" : "rocksVideos",
                "click .show_rockers" : "showDocRockers",
//                 "hover .videotitle" : "editVideoTitle"              //#345 should only hover over, not click
                "click .then-by li a" : "filterDocs",
                "click #view-files-byrock-list" : "selectViewByRock",
                "click #by-class-list li" :"sortByClass",
                "click #category-list li" :"sortBycategory",
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
       
                             
                   /*
            * pagination for docsview 
            *
            */
//            pagination: function(){
//                    var show_per_page = 16;                                     //number of <li> listed in the page
//                    var number_of_items = $('#grid').children().size();  
//                    var number_of_pages = Math.ceil(number_of_items/show_per_page);  
//                    var navigation_count='';
//                    $('#current_page').val(0);  
//                    $('#show_per_page').val(show_per_page);  
//                    var navigation_Prev = '<div class="previous_link" ></div>';  
//                    var current_link = 0;  
//                    while(number_of_pages > current_link){  
//                        navigation_count += '<a class="page_link" href="javascript:go_to_page(' + current_link +')" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';  
//                        current_link++;  
//                    }  
//                    var navigation_next = '<div class="next_link" ></div>';  
//                    $('#prevslid').html(navigation_Prev);                       //previous slider icon
//                    $('#page_navigation-count').html(navigation_count);  
//                    $('#nextslid').html(navigation_next);                       //next slider icon   
//                    $('#page_navigation-count .page_link:first').addClass('active_page');  
//
//                    $('#grid').children().css('display', 'none');  
//
//                    $('#grid').children().slice(0, show_per_page).css('display', 'block');  
//            },
//            
//            /*
//            * Part of pagination and is used to show previous page
//            *
//            */
//           previous: function (){  
//               new_page = parseInt($('#current_page').val()) - 1;  
//               if($('.active_page').prev('.page_link').length==true){  
//               this.go_to_page(new_page);  
//               }  
//  
//            },  
//            
//            /*
//            * Part of pagination and is used to show next page
//            *
//            */
//            next:function (){      
//                new_page = parseInt($('#current_page').val()) + 1;  
//                if($('.active_page').next('.page_link').length==true){  
//                this.go_to_page(new_page);  
//                }  
//            },
//            
//            /*
//            * Part of pagination and is used to page setting
//            *
//            */
//            go_to_page:function (page_num){  
//                var show_per_page = parseInt($('#show_per_page').val());  
//
//                start_from = page_num * show_per_page;  
//
//                end_on = start_from + show_per_page;  
//
//                $('#grid').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');  
//
//                   $('.page_link[longdesc=' + page_num +']').addClass('active_page').siblings('.active_page').removeClass('active_page');  
//
//                $('#current_page').val(page_num);  
//            }, 
             /**
            * show file types
            */
        showFilesTypes :function(eventName){
    	    eventName.preventDefault();
            $('.file-type').slideDown();
    	    }, 
            
            /**
             * hide file types
            */
        hideList : function(eventName){
            eventName.preventDefault();
            $('.file-type').slideUp();
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
                                     $('#bootstrap_popup').modal('show');
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
       	   
          }
            
})


