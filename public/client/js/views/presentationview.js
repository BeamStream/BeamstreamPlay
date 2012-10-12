BS.PresentationView = Backbone.View.extend({ 
    events:{
                "click .presentationpopup" : "presentationpopup"
             },
    
  initialize:function(){
            this.source = $("#tpl-docsview").html();
            this.template = Handlebars.compile(this.source);
            this.presentation();
          
        },
        render:function (eventName) {
            $(this.el).html(this.template);
            return this;
            },
            
            
              presentation :function(eventName){
//            $('.coveraud').html('content');
            var i = 1;
            var self = this;
            var content='';
            $.ajax({
                        type : 'GET',
                        url :  BS.getAllPPTFilesForAUser,
                        dataType : "json",
                        success : function(ppts) {
//                            if(docs.length != 0)  {
                              _.each(ppts, function(ppt) {                                
//                             var datVal = self.formatDateVal(audio.creationDate);     
                                                              
                                content +='<li id="file-docs-'+i+'" data-key="[datVal]"> <div class="image-wrapper hovereffect" >'                  
                                +' <div class="hover-div"><img src="images/presentations_image.png"/><div class="hover-text"> '  //code for hover over effect
                                +'<div class="comment-wrapper comment-wrapper2">'
                                +' <a href="#" class="tag-icon" data-original-title="Search by Users"></a>'
                                +'<a href="#" class="hand-icon" ></a>'
                                +'<a href="#" class="message-icon"></a>'
                                +'<a href="#" class="share-icon"></a>'
                                +'</div>'
                                +'<div><h4> '+ppt.documentName+'</h4>'
                                +' <p class="doc-description presentationpopup" id="'+ppt.id.id+'" >'
                                +'<input type="hidden" id="id-'+ppt.id.id+'" value="'+ppt.documentURL+'">'
                                +''+ppt.documentDescription+' <audio src="'+ppt.documentURL+'"> </p> </div>'
                                +'<h5 class="doctitle" id="'+ppt.id.id+'"> Title & Description</h5>'           //'id' to edit the title and description
                                +'<span>State</span>'
                                +' <span class="date">+datVal+</span>' 
                                +'</div> </div></div>'                                                       //two closing <div> for hover over effect
                                +'<div class="comment-wrapper comment-wrapper1"> '
                                +' <a class="common-icon presentation" href="#">'
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
            
                                 
        },
        
        /*
         *   To show the presentation view in popup        
         *
         */ 
        presentationpopup :function(eventName){
            
            var docId = eventName.currentTarget.id;
            var docUrl = $('input#id-'+docId).val();  
//            console.log(docUrl);
//            newwindow=window.open(docUrl,'','height=500,width=500');    
            BS.presentationpopupview = new BS.PresentationPopupView();
            BS.presentationpopupview.render(docUrl);
            
            $('#gdocedit').html(BS.presentationpopupview.el);
            
            
        }
            
})