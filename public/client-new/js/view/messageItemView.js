/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/February/2013
* Description           : View for Message List on discussion page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView',
        'view/mediaEditView',
        'model/comment',
        'model/discussion',
        'model/usermedia',
        'text!templates/discussionMessage.tpl',
        'text!templates/discussionComment.tpl',
        '../../lib/extralib/jquery.embedly.min',
        '../../lib/extralib/jquery.prettyPhoto'
        ],function(FormView , MediaEditView ,CommentModel,DiscussionModel, UserMediaModel, DiscussionMessage ,DiscussionComment ,JqueryEmbedly, PrettyPhoto){
	
	var MessageItemView;
	MessageItemView = FormView.extend({
		objName: 'MessageItemView',
		events:{
			 'click .editMediaTitle': 'editMediaTitle',
			 'keypress .add-message-comment' : 'addMessageComments',
			 'click .rocks-message' : 'rockMessage',
			 'click .rock-message' : 'rockMessage',
			 'click .add-comment' : 'showCommentTextArea',
			 'click .show-all-comments' : 'showAllCommentList',
			 'click .show-all' : 'showAllList',
			 'click .follow-message' : 'followMessage',
			 'click .rock-comments': 'rockComment',
			 'click .rocks-small a' : 'rockComment',
			 
		},
		
		onAfterInit: function(){	
			this.data.reset();
			
			this.urlRegex2 =  /^((http|https|ftp):\/\/)/,
            this.urlRegex1 = /(https?:\/\/[^\s]+)/g,
            this.urlRegex = /(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\./]*$/i ;
        },
        
        /**
         * render the message item
         */
        render: function(){
        	
        	var self = this;
            var trueurl='';
            var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
            
        	var model = this.model.attributes;
    		
			var messageType ='';
			var msgBody = model.message.messageBody;
                                            
            var msgUrl=  msgBody.replace(self.urlRegex1, function(msgUrlw) {
            	trueurl= msgUrlw;    
                return msgUrlw;
            });
            
            //to get the extension of the uploaded file 
            if(trueurl)
            	var extension = (trueurl).match(pattern);  
            
            if(model.message.messageType.name == "Text")
            {    
                	 
                 //to check whether the url is a google doc url or not
                 if(msgBody.match(/^(https:\/\/docs.google.com\/)/)) 
                 {
                	 messageType = "googleDocs";
                 }
                 else
                 {
                	 messageType = "messageOnly";
                     var linkTag =  msgBody.replace(self.urlRegex1, function(url) {
                           return '<a target="_blank" href="' + url + '">' + url + '</a>';
                     });
                 }
            }
            else
            {          
                 // set first letter of extension in capital letter  
            	  if(extension)
            	  {
            		  extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
            			  return letter.toUpperCase();
                	  }); 
            	  }
            }
            
            var datVal =  formatDateVal(model.message.timeCreated);
            
			var datas = {
			 	 "data" : model,
			 	 "datVal":datVal,
		    }
           
			if(messageType == "googleDocs")
			{
				var datas = {
				    "data" : model,
                    "datVal" :datVal,
                    "previewImage" : "/beamstream-new/images/google_docs_image.png",
                    "type" : "googleDoc",
                	
				}	
			}
			else if(messageType == "messageOnly")
			{
				var datas = {
					 	 "data" : model,
					 	 "datVal":datVal,
			    }
			}
			else
			{
				if(model.message.messageType.name == "Image" || model.message.messageType.name == "Video" )
				{
					var datas = {
					 	 "data" : model,
					 	 "datVal":datVal,
				    }  						
				}
				else
				{
					var previewImage = '';
					var commenImage ="";
					var type = "";
					 
					if(extension == 'Ppt')
					{
                        previewImage= "/beamstream-new/images/presentations_image.png";
                        type = "ppt";
                        
					}
					else if(extension == 'Doc')
					{
						previewImage= "/beamstream-new/images/docs_image.png";
						type = "doc";
						 	
					}
					else if(extension == 'Pdf')
					{
						 
						previewImage= model.anyPreviewImageUrl;
						type = "pdf";
					}
					else
					{
						previewImage= "/beamstream-new/images/textimage.png";
						commenImage = "true";
						type = "doc";
						
					}
					
					var datas = {
						    "data" : model,
                            "datVal" :datVal,
                            "previewImage" :previewImage,
                            "extension" : extension,
                            "commenImage" : commenImage,
                            "type" : type,
                            
			        }	
			  }
					
			}
			
			
        	compiledTemplate = Handlebars.compile(DiscussionMessage);
        	$(this.el).html(compiledTemplate(datas));
        	
        	if(linkTag)
            	$('p#'+model.message.id.id+'-id').html(linkTag);
    		
            // embedly
    		$('p#'+model.message.id.id+'-id').embedly({
    		 	maxWidth: 200,
    		 	wmode: 'transparent',
    		 	method: 'after',
    		 	key:'4d205b6a796b11e1871a4040d3dc5c07'
		 	 });
    		
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
			$('.commentList').hide();
			
    		return this;
        },
        
        editMediaTitle: function(eventName){
        	
        	var mediaId = eventName.currentTarget.id; 
        	/* get user media details and set to usermedia model */ 
        	userMediaModel = new UserMediaModel();
        	userMediaModel.set({id:this.model.get('message').docIdIfAny.id ,
				        		docName : this.model.get('docName'),
				        		docDescription :this.model.get('docDescription')});
				        		
        	
        	var mediaEditView  = new MediaEditView({el: '#editMediaView' , model : userMediaModel});
			mediaEditView.render();
			
			$('#editMedia').modal("show");
			
			
//            view = new MediaEditView({el: $('#editMediaView')});
//        	if(view){
//        		view.data.url = "/getMediafromPost/"+mediaId;
//        		view.fetch();
//        	}
//        	$('#editMedia').modal("show");
        },
        
        /**
         *   post new comments on enter key press
         */
        addMessageComments: function(eventName){
        	
        	var element = eventName.target.parentElement;
        	var parent =$(element).parents('div.follow-container').attr('id');
        	var totalComments =  $('#'+parent+'-totalComment').text();
        	var commentText = $('#'+parent+'-msgComment').val();
        	 
        	var self =this;
        
        	/* post comments on enter key press */
        	if(eventName.which == 13) {
        		
	    		eventName.preventDefault(); 
	   			 	
   			 	if(!commentText.match(/^[\s]*$/))
   			 	{
//   			 		this.data.url = "/newComment";
   			 			var comment = new CommentModel();
   			 			comment.urlRoot = "/newComment";
   			 			comment.save({comment : commentText, messageId :parent},{
	   			    	success : function(model, response) {
		   			    		
	   			    		$('#'+parent+'-msgComment').val('');
	   							
   			    			// shows the posted comment
   			    		    self.showPostedComment(response,parent,totalComments);
   			    		    
   							/* pubnum auto push */
   							PUBNUB.publish({
   			                	channel : "comment",
		                        message : { pagePushUid: self.pagePushUid ,data:response,parent:parent,cmtCount:totalComments}
   			                })
	   			                
	   			    	},
	   			    	error : function(model, response) {
	   			    		
	   	                    console.log("error");
	   			    	}
	
	   			    });

   			 	}
   			 	
	        }
        },
        
        /**
         * show posted comment
         */
        showPostedComment: function(response,parent,totalComments){
        	
	  		$('#'+parent+'-addComments').slideUp(200);
	  		
		    /* display the posted comment  */
    		var compiledTemplate = Handlebars.compile(DiscussionComment);
    		$('#'+parent+'-allComments').prepend(compiledTemplate(response));
    		
    		if(!$('#'+parent+'-allComments').is(':visible'))
			{  
				$('#'+parent+'-msgRockers').slideUp(1);
				$('#'+parent+'-newCommentList').slideDown(1);
				$('#'+parent+'-newCommentList').prepend(compiledTemplate(response));
				
			}
    		totalComments++; 
    		$('#'+parent+'-show-hide').text("Hide All");
			$('#'+parent+'-totalComment').text(totalComments);
        },
       
        /**
	     *  Rocking messages
	     */
	    rockMessage: function(eventName){
	    	
	    	eventName.preventDefault();
			var element = eventName.target.parentElement;
			var messageId =$(element).parents('div.follow-container').attr('id');
			var streamId =  $('.sortable li.active').attr('id');
			
			// set values to model
			var Discussion = new DiscussionModel();
			Discussion.urlRoot = "/rockedIt";
			Discussion.save({id : messageId},{
		    	success : function(model, response) {
		    		
		    		if($('#'+messageId+'-msgRockCount').hasClass('downrocks-message'))
	            	{
	            		$('#'+messageId+'-msgRockCount').removeClass('downrocks-message');
	            		$('#'+messageId+'-msgRockCount').addClass('uprocks-message');
	            	}
	            	else
	            	{
	            		$('#'+messageId+'-msgRockCount').removeClass('uprocks-message');
	            		$('#'+messageId+'-msgRockCount').addClass('downrocks-message');
	            	}
	            	
	            	// display the count in icon
	                $('#'+messageId+'-msgRockCount').find('span').html(response);
	                
	                /* ajax auto push for message rock */
	                PUBNUB.publish({
						channel : "msgRock",
	                    message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:response,msgId:messageId}
	                })
		    		
		    	},
		    	error : function(model, response) {
                    console.log("error");
		    	}

		    });
		    
			var self = this;
			
        },
        
        
        /**
         * Show comment text area on click
         */
        showCommentTextArea: function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
			var messageId =$(element).parents('div.follow-container').attr('id');
			
			// show / hide commet text area 
			if($('#'+messageId+'-addComments').is(":visible"))
			{
				$('#'+messageId+'-msgComment').val('');
				$('#'+messageId+'-addComments').slideToggle(300); 
			}
			else
			{
				$('#'+messageId+'-msgComment').val('');
				$('#'+messageId+'-addComments').slideToggle(200); 
				
			}
			
        },
        
        /**
         * Show / hide all comments of a message
         */
        showAllCommentList: function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
        	var parentUl = $(eventName.target).parent('ul');
        	
			var messageId =$(element).parents('div.follow-container').attr('id');
			
			$(parentUl).find('a.active').removeClass('active');
			
			if($('#'+messageId+'-allComments').is(":visible"))
			{
				$(eventName.target).removeClass('active');
				$('#'+messageId+'-msgRockers').slideUp(1);
				$('#'+messageId+'-newCommentList').html('');
				$('#'+messageId+'-allComments').slideUp(600); 
				$('#'+messageId+'-show-hide').text("Show All");
			}
			else
			{
				$(eventName.target).addClass('active');
				$('#'+messageId+'-msgRockers').slideUp(1);
				$('#'+messageId+'-newCommentList').html('');
				$('#'+messageId+'-allComments').slideDown(600); 
				$('#'+messageId+'-show-hide').text("Hide All");
			}
        },
        
        /**
         * show / hide all comments ..
         */
        showAllList: function(eventName){
        	eventName.preventDefault();
        	
        	var element = eventName.target.parentElement;
        	var parentUl = $(eventName.target).parents('ul');
        	$(parentUl).find('a.active').removeClass('active');
			var messageId =$(element).parents('div.follow-container').attr('id');
			if($('#'+messageId+'-show-hide').text() == "Hide All")
            {
				$('#'+messageId+'-msgRockers').slideUp(1);
				$('#'+messageId+'-newCommentList').html('');
				$('#'+messageId+'-allComments').slideUp(600); 
				$(eventName.target).removeClass('active');
				$(eventName.target).text("Show All");
            }
			else
			{
				$('#'+messageId+'-msgRockers').slideUp(1);
				$('#'+messageId+'-newCommentList').html('');
				$('#'+messageId+'-allComments').slideDown(600);
				$(eventName.target).addClass('active');
				$(eventName.target).text("Hide All");
			}
			
        },
        
        /**
		  * Follow a message
		  */
		followMessage: function(eventName){
			eventName.preventDefault();
			 
			var element = eventName.target.parentElement;
			var messageId =$(element).parents('div.follow-container').attr('id');
			
			var text = $('#'+eventName.target.id).text();
			
//			this.data.url = "/followMessage";
			
			// set values to model
			var Discussion = new DiscussionModel();
			Discussion.urlRoot = "/follow/message";
			Discussion.save({id : messageId},{
		    	success : function(model, response) {
		    		//set display
		        	if(text == "Unfollow")
		    		{
		        		 $('#'+eventName.target.id).text("Follow");
		    		}
		        	else
		        	{
		        		$('#'+eventName.target.id).text("Unfollow");
		        	}
		        	 
		    		
		    	},
		    	error : function(model, response) {
                   console.log("error");
		    	}

		    });

	    },
        
	    /**
         *  Rock comments
         */
        rockComment: function(eventName){
        	
        	eventName.preventDefault();
        	var commentId = $(eventName.target).parents('div.answer-description').attr('id');
        	var messageId = $(eventName.target).parents('div.follow-container').attr('id');
        	var streamId =  $('.sortable li.active').attr('id');
        	var self = this;
        	
//        	this.data.url = "/rockingTheComment";
        	var comment = new CommentModel();
        	comment.urlRoot = "/rockingTheComment";
			// set values to model
        	comment.save({id : commentId },{
		    	success : function(model, response) {
		    		
		    		// display the count in icon
                	$('#'+commentId+'-rockCount').html(response);
                	$('#'+commentId+'-mrockCount').html(response);
                	
                	/* pubnub auto push for rock message */
                	PUBNUB.publish({
                        channel : "commentRock",
                        message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:response,commentId:commentId }
                	})
		        	 
		    	},
		    	error : function(model, response) {
                    console.log("error");
		    	}

		    });
        },
        
        
	})
	return MessageItemView;
});