BS.ImageListView = Backbone.View.extend({
    
        events:{
                "click a#file-type" : "showFilesTypes",
                "click ul.file-type li a" : "hideList"
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
         * function to load pictures
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
                        data : {
                        'userId': e.attributes.id.id
                                },
                        dataType : "json",
                        success : function(docs) {
                                _.each(docs, function(doc) {  
                                content += '<li id="file-docs-'+i+'">'
                                +'<div class="image-wrapper" id="google-docs"><a class="google-docs-image" href="#"><img src="'+doc+'"></a></div>'
                                +'<div class="comment-wrapper comment-wrapper1"> <a class="common-icon data" href="#"><span class="right-arrow"></span></a>'
                                +'<ul class="comment-list">'
                                +'<li><a class="eye-icon" href="#">87</a></li>'
                                +'<li><a class="hand-icon" href="#">5</a></li>'
                                +'<li><a class="message-icon" href="#">10</a></li>'
                                +'</ul>'
                                +'</div>'
                                +'</li>';                 
                        i++;
                        });                  
                        $('#grid').html(content);         
                            
                        }
               });

            }});

           // $('#content').html(BS.listDocsView.el);
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
    	    } 
        
            
})


