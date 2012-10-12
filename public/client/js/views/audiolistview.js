BS.AudioListView = Backbone.View.extend({ 
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
//            $('.coveraud').html('content');
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
                             content +='<li id="file-docs-'+i+'" data-key="[datVal]"> <div class="image-wrapper hovereffect" >'                       
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
                                +'<h5 class="doctitle" id="'+audio.id.id+'"> Title & Description</h5>'           //'id' to edit the title and description
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
//                        }
                        }
               });
            
                                 
        }
})
