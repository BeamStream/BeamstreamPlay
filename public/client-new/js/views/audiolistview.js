BS.AudioListView = Backbone.View.extend({ 
    
            events:{
                "click .audiotitle" : "editAudioTitle",
                "click #prevslid" : "previous",
                "click #nextslid" : "next"
                },
             
            initialize:function(){
                this.source = $("#tpl-docsview").html();
                this.template = Handlebars.compile(this.source);
                this.audio();         
                },
            render:function (eventName) {
                $(this.el).html(this.template);
                return this;
                },
            
            audio :function(eventName){                 //to list the audio files 
//              $('.coveraud').html('content');
                var i = 1;
                var self = this;
                var content='';
                $.ajax({
                        type : 'GET',
                        url :  BS.getaudioFilesOfAUser,
                        dataType : "json",
                        success : function(data) {
//                            if(docs.length != 0)  {
                              _.each(data, function(audio) {                                
//                                   var datVal =  self.formatDateVal(audio.creationDate);                                                                 
                             content +='<li id="file-docs-'+i+'" data-groups="[datVal]"> <div class="image-wrapper hovereffect" >'                       
                                +' <div class="hover-div"><img src="images/audio_image.png"/><div class="hover-text"> '  //code for hover over effec                          
                                +'<div class="comment-wrapper comment-wrapper2">'
                                +' <a href="#" class="tag-icon" data-original-title="Search by Users"></a>'
                                +'<a href="#" class="hand-icon" ></a>'
                                +'<a href="#" class="message-icon"></a>'
                                +'<a href="#" class="share-icon"></a>'
                                +'</div>'
                                +'<div><h4> '+audio.documentName+'</h4>'
                                +' <p class="doc-description" id="'+audio.id.id+'" >'
                                +'<input type="hidden" id="id-'+audio.id.id+'" value="'+audio.documentURL+'">'
                                +''+audio.documentDescription+' </p> </div>'
                                +'<h5 class="audiotitle" id="'+audio.id.id+'"> Title & Description</h5>'           //'id' to edit the title and description
                                +'<span>State</span>'
                                +' <span class="date">Date</span>' 
                                +'</div> </div></div>'                                                       //two closing <div> for hover over effect
                                +'<div class="comment-wrapper comment-wrapper1"> '
                                +' <a class="common-icon music" href="#">'
                                +'<span class="right-arrow"></span>'
                                +' </a>'
                                +'<ul class="comment-list">'
                                +'<li><a class="eye-icon" href="#"></a></li>'
                                +'  <li><a class="hand-icon" href="#"></a></li>'
                                +'   <li><a class="message-icon" href="#"></a></li>'
                                +' </ul>'
                                +'</div> </li>'; 
                            
                                i++;
     
                              });
                        $('#grid').html(content); 
                        self.pagination();
//                        }
                        }
               });
            
                                 
                },
        
               /*
                * pagination for audiolistview
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
           

        
                /*
                *   To edit the title and description of the Audio      
                *
                */ 
                editAudioTitle :function(eventName){  
//                  var docId = eventName.currentTarget.id;             // id to get corresponding Audio   
                    var datas = {
				"type" : 'Audio',
				"title" : '',
                                "description" :''
			  }
                    BS.mediaeditview = new  BS.MediaEditView();
                    BS.mediaeditview.render(datas);
                    $('#gdocedit').html(BS.mediaeditview.el);
                    }
})
