BS.VideoListView = Backbone.View.extend({
         events:{
                "click a#file-type" : "showFilesTypes",
                "click ul.file-type li a" : "hideList",
                 "click .videotitle" : "editVideoTitle"
//                 "hover .videotitle" : "editVideoTitle"              //#345 should only hover over, not click
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
//                        data : {
//                           'userId': e.attributes.id.id
//                                },
                        dataType : "json",
                                                                //------------------------------------------------------------
                        success : function(videos) {
                        	
                                _.each(videos, function(video) {  
//                                	 
                                content += '<li id="file-docs-'+i+'">'
                                +'<div class="image-wrapper hovereffect"><div class="hover-div"><img class="videoimage" src="'+video.frameURL+'"/><div class="hover-text">'
                                +'<div class="comment-wrapper comment-wrapper2">'
                                +' <a href="#" class="tag-icon" data-original-title="Search by Users"></a>'
                                +'<a href="#" class="hand-icon"></a>'
                                +'<a href="#" class="message-icon"></a>'
                                +'<a href="#" class="share-icon"></a>'
                                +'</div>'
                                +'<h4> video name</h4> ' 
                                +'<div class="gallery clearfix"></div><div class="gallery clearfix"><a href="'+video.mediaUrl+'" rel="prettyPhoto" style="text-decoration: none" >'
                                +' <p class="google_doc doc-description" id="+doc.id.id+">'
                                +'<input type="hidden" id="id-doc.id.id" value="doc.url">'
                                +'Description of Video </p></a>'
                                 +'<h5 class="videotitle"> Title & Description</h5>'           //'id' to edit the title and description
                                +'<span>State</span>'
                                +' <span class="date">datVal</span>'    
                                +'</div></div></div>'         
                                +'<div class="comment-wrapper comment-wrapper1"> <a class="common-icon video" href="#"><span class="right-arrow"></span></a>'
                                +'<ul class="comment-list">'
                                +'<li><a class="eye-icon" href="#">87</a></li>'
                                +'<li><a class="hand-icon" href="#">5</a></li>'
                                +'<li><a class="message-icon" href="#">10</a></li>'
                                +'</ul></div></li>';                                       
                        i++;
                        });                  
                        $('#grid').html(content);         
                        
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
            pagination: function(){
                    var show_per_page = 16;                                     //number of <li> listed in the page
                    var number_of_items = $('#grid').children().size();  
                    var number_of_pages = Math.ceil(number_of_items/show_per_page);  
                    var navigation_count='';
                    $('#current_page').val(0);  
                    $('#show_per_page').val(show_per_page);  
                    var navigation_Prev = '<div class="previous_link" ></div>';  
                    var current_link = 0;  
                    while(number_of_pages > current_link){  
                        navigation_count += '<a class="page_link" href="javascript:go_to_page(' + current_link +')" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';  
                        current_link++;  
                    }  
                    var navigation_next = '<div class="next_link" ></div>';  
                    $('#prevslid').html(navigation_Prev);                       //previous slider icon
                    $('#page_navigation-count').html(navigation_count);  
                    $('#nextslid').html(navigation_next);                       //next slider icon   
                    $('#page_navigation-count .page_link:first').addClass('active_page');  

                    $('#grid').children().css('display', 'none');  

                    $('#grid').children().slice(0, show_per_page).css('display', 'block');  
            },
            
            /*
            * Part of pagination and is used to show previous page
            *
            */
           previous: function (){  
               new_page = parseInt($('#current_page').val()) - 1;  
                    if($('.active_page').prev('.page_link').length==true){  
                        this.go_to_page(new_page);  
                    }  
  
            },  
            
            /*
            * Part of pagination and is used to show next page
            *
            */
            next:function (){  
          console.log("next");      
                new_page = parseInt($('#current_page').val()) + 1;  
                if($('.active_page').next('.page_link').length==true){  
                    console.log("inside if");
                    this.go_to_page(new_page);  
                }  
            },
            
            /*
            * Part of pagination and is used to page setting
            *
            */
            go_to_page:function (page_num){  
                var show_per_page = parseInt($('#show_per_page').val());  

                start_from = page_num * show_per_page;  

                end_on = start_from + show_per_page;  

                $('#grid').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');  

                   $('.page_link[longdesc=' + page_num +']').addClass('active_page').siblings('.active_page').removeClass('active_page');  

                $('#current_page').val(page_num);  
            }, 
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
//          var docId = eventName.currentTarget.id;             // id to get corresponding docs   
            var datas = {
				"type" : 'Video',
				"title" : 'My first video',
                                "description" :'This is my first video and very nice'
			  }
            BS.mediaeditview = new  BS.MediaEditView();
            BS.mediaeditview.render(datas);
            $('#gdocedit').html(BS.mediaeditview.el);
            }
            
})


