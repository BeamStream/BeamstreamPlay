BS.ImageListView = Backbone.View.extend({
            
            events:{
                "click a#file-type" : "showFilesTypes",
                "click ul.file-type li a" : "hideList",
                "click #prevslid" : "previous",
                "click #nextslid" : "next",
                "click .imgtitle" : "editImgTitle",
                "click .rock_docs" : "rocksImages",
                "click .show_rockers" : "showImageRockers"
             },
    
            initialize:function(){
                this.source = $("#tpl-docsview").html();
                this.template = Handlebars.compile(this.source);
                this.pictres();
            },
    
            render:function (eventName) {
                $(this.el).html(this.template);
                return this;
                },
            
            /*
            * function to display all pictures
            */               
            pictres : function()
                {       
                var i = 1;
                $('#content').children().detach();
                var self = this;
                var arraypictures = new Array();
                var content='';
                var coverpicture;            
                BS.user.fetch({ success:function(e) {                   
                                  /* get profile images for user */
                    $.ajax({
                        type : 'GET',
                        url :  BS.allProfileImages,
                        dataType : "json",
                        success : function(images) {
                        	     $('#grid').html("");    
                                _.each(images, function(image) {  
                                	

                                	var datas = {
                                            "image" : image,
//                                            "datVal" :datVal,
                                            "imageCount" : i
                                	}	

                                	var source = $("#tpl-single-image").html();
                                    var template = Handlebars.compile(source);				    
                                    $('#grid').append(template(datas));   	
                                            
                        i++;
                        });                  
                            
                        // Call common Shuffling function         
                        shufflingOnSorting();
                        
                        
                        /* for image view popups */
                        $("area[rel^='prettyPhoto']").prettyPhoto();
                        $(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:1000, autoplay_slideshow: true});
                        $(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
                        self.pagination();
                        
                        
                        
                      }
               });

            }});
            },
            
            /*
            * pagination for Imagelistview
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
                new_page = parseInt($('#current_page').val()) + 1;  
                if($('.active_page').next('.page_link').length==true){  
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
            
            /*Edit the Image title
            * 
            */  
            editImgTitle :function(eventName){  
              var imageId = eventName.currentTarget.id;             // id to get corresponding docs   
                var datas = {
                    "type" : 'Image',
                    "title" : '',
                    "description" :''
			  }
                BS.mediaeditview = new  BS.MediaEditView();
                BS.mediaeditview.render(datas);
                $('#gdocedit').html(BS.mediaeditview.el);
                console.log(imageId);

            
            
            /*
             var imageId = eventName.currentTarget.id;             // id to get corresponding image   
           $.ajax({                                       
                        type : 'POST',
                        url :  BS.getOneDocs,
                        data : {
                                documentId: imageId  
                                },
                        dataType : "json",
                        success : function(imagess) {                          
                             var imagedatas = {
                             "id" : imagess[0].id.id,
                             "url" : imagess[0].documentURL,
                             "type" : 'Docs',
                             "title" : imagess[0].documentName,
                             "description" : imagess[0].documentDescription
			  }
            BS.mediaeditview = new  BS.MediaEditView();
            BS.mediaeditview.render(imagedatas);
            $('#gdocedit').html(BS.mediaeditview.el);
                        }
           });
             */

            },
            
           /**
            * Rock profile Images
            */
            rocksImages:function(eventName){      	   
                eventName.preventDefault();
                var element = eventName.target.parentElement;
                var imageId =$(element).attr('id');
                var parent = $('div#'+imageId).parent('li');
               
    	  	// post documentId and get Rockcount 
                $.ajax({
                    type: 'POST',
                    url:BS.rockTheUsermedia,
                    data:{
    	            userMediaId:imageId
                    },
                    dataType:"json",
                    success:function(data){	              	 
    	              	// display the rocks count  
                    $('#'+imageId+'-activities li a.hand-icon').html(data);	   
                    $(parent).attr('data-rock',data);
                 
    	            }
                });
            },
         
            /**
            * show profile image Rockers list 
            */
            showImageRockers :function(eventName){
                eventName.preventDefault();
                var element = eventName.target.parentElement; 
                var imageId =$(element).closest('div').parent('div').attr('id');
            
                $.ajax({
                    type: 'POST',
                    url:BS.giveMeRockersOfUserMedia,
                    data:{
                        userMediaId:imageId
                    },
                    dataType:"json",
                success:function(data){ 
                	  // prepair rockers list
                var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">Who Rocked it ?</div><ul class="rock-list">';
                _.each(data, function(rocker) { 					 
                ul+= '<li>'+rocker+'</li>';
                });
                ul+='</ul>';   
                $('#'+imageId+'-docRockers-list').fadeIn("fast").delay(1000).fadeOut('fast'); 
                $('#'+imageId+'-docRockers-list').html(ul);
                 }
              });
      	   
         }

        
            
})


