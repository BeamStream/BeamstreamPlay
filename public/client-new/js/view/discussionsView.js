define(['view/formView',
        'model/discussion',
        'model/comment',
        'view/messageListView',
//        '../../lib/jquery.preview.full.min',
        '../../lib/extralib/jquery.embedly.min',
        'text!templates/discussionMessage.tpl',
        'text!templates/discussionComment.tpl',
        'text!templates/privateToList.tpl',
        ], function(FormView, DiscussionModel, CommentModel ,MessageListView, JqueryEmbedly , DiscussionMessage ,DiscussionComment,PrivateToList){
	var Discussions;
	Discussions = FormView.extend({
		objName: 'Discussion',
		
		events:{
			 'click #post-button' : 'postMessage',
			 'click #share-discussions li a' : 'actvateShareIcon',
			 'click #private-to' : 'checkPrivateAccess',
			 'click #sortBy-list' : 'sortMessages',
			 'click #date-sort-list' : 'sortMessagesWithinAPeriod',
			 'click #discussion-file-upload li' : 'uploadFiles',
			 'click #private-to-list li' :'selectPrivateToList',
			 'click .add-comment' : 'showCommentTextArea',
			 'keypress .add-message-comment' : 'addMessageComments',
			 'keypress #msg-area' : 'postMessageOnEnterKey',
			 'click .show-all-comments' : 'showAllCommentList',
			 'click .show-all' : 'showAllList',
		 },

		 messagesPerPage: 10,
		 pageNo: 0,
			
		 init: function(){
			this.addView(new MessageListView({el: $('#messageListView')}));
		 },
			
		 onAfterInit: function(){	
            this.data.reset();
            this.pagenum = 1;
            this.pageLimit = 10;
            
            this.urlRegex2 =  /^((http|https|ftp):\/\/)/,
            this.urlRegex1 = /(https?:\/\/[^\s]+)/g,
            this.urlRegex = /(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\./]*$/i ;
		    
            this.setupPushConnection();
            this.comment = new CommentModel();
		 },
		 
		
        /**
         * post messages 
         */
        postMessage: function(){
        	
        	var self = this;
 	        var streamId =  $('.sortable li.active').attr('id');
 	        var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
 	        var message = $('#msg-area').val();
 	        if(message){
 	        	//get message access private ? / public ?
 		        var messageAccess;
 		        var msgAccess =  $('#private-to').attr('checked');
 		        var privateTo = $('#select-privateTo').text();
 			    if(msgAccess == "checked")
 			    {
 			    	if(privateTo == "My School")
 			    	{
 			    		messageAccess = "PrivateToSchool";
 			    	}
 			    	else
 			    	{
 			    		messageAccess = "PrivateToClass";
 			    	}
 			    	 
 			    }
 			    else
 			    {
 			  	    messageAccess = "Public";
 			    }
 			    
 			    this.data.url = "/newMessage";
 			    // set values to model
 			    this.data.models[0].save({streamId : streamId, message :message, messageAccess:messageAccess},{
 			    	success : function(model, response) {
 			    		
 			    		   
 		    		  	/* PUBNUB -- AUTO AJAX PUSH */ 
 			    		PUBNUB.publish({
 			    			channel : "stream",
 			    			message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:response}
 			    		}) 
 	                       
 			    		var msgBody = response[0].message.messageBody;
 			    		var msgUrl=  msgBody.replace(self.urlRegex1, function(msgUrlw) {
 			    			trueurl= msgUrlw;                                                                  
 			    			return msgUrlw;
 			    		});
 	                             
 			    		//to get the extension of the uploaded file
// 			    		var extension = (trueurl).match(pattern);  
 			    		
 			    		var linkTag =  msgBody.replace(self.urlRegex1, function(url) {
 	           			 	return '<a target="_blank" href="' + url + '">' + url + '</a>';
 	           		 	});
 	                             
 			    		/* display the posted message on feed */
 			    		var compiledTemplate = Handlebars.compile(DiscussionMessage);
 			    		$('#messageListView div.content').prepend(compiledTemplate(response));
 			    		
 			    		 if(linkTag)
 			    			 $('p#'+response[0].message.id.id+'-id').html(linkTag);
 			    		
 			    		 // embedly
 			    		$('p#'+response[0].message.id.id+'-id').embedly({
 	               		 	maxWidth: 200,
 	               		 	wmode: 'transparent',
 	               		 	method: 'after',
 	               		 	key:'4d205b6a796b11e1871a4040d3dc5c07'
 					 	 });
 	               	 
 			    		/* delete default embedly preview */
 			    		$('div.selector').attr('display','none');
 			    		$('div.selector').parents('form.ask-disccution').find('input[type="hidden"].preview_input').remove();
 			    		$('div.selector').remove();
 			    		$('.preview_input').remove();
 			    		$('#msg-area').val("");
 			    		
 			    	},
 			    	error : function(model, response) {
 			    		$('#msg-area').val("");
 	                    console.log("error");
 			    	}

 			    });
 	        }
 	       
		    
        },
        
        
        /**
         * actvate share icon on selection
         */
        actvateShareIcon: function(eventName){
        	
        	eventName.preventDefault();
        	
        	$('#private-to').attr('checked',false);
        	$('#select-privateTo').text("Public");
        	if($(eventName.target).parents('li').hasClass('active'))
        	{
        		$(eventName.target).parents('li').removeClass('active');
        	}
        	else
        	{
        		$(eventName.target).parents('li').addClass('active');
        	}
        	
        },
        
        /**
         *select Private / Public ( social share ) options 
         */
        checkPrivateAccess: function (eventName) {
        	var streamName = $('.sortable li.active').attr('name');
        	
        	if($('#private-to').attr('checked')!= 'checked')
        	{
        		$('#select-privateTo').text("Public");
        	}
        	else
        	{
        		$('#select-privateTo').text(streamName);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },
        
        /**
         *  Sort Messages/Discussions
         */
        sortMessages: function(eventName){
        	
        	eventName.preventDefault();
        	var self = this;
        	var streamId = $('.sortable li.active').attr('id');
        	var sortKey = $(eventName.target).attr('value');
        	
        	/* render the message list */
        	view = this.getViewById('messageListView');
    		if(view){
    			view.fetch({'streamId': streamId, 'sortBy': sortKey, 'messagesPerPage': this.messagesPerPage, 'pageNo': this.pageNo});

    		}

			$('#sortBy-select').text($(eventName.target).text());
        },
        
        /**
         * sort messages within a period 
         */
        sortMessagesWithinAPeriod: function(eventName){
        	
        	eventName.preventDefault();
        	$('#date-sort-select').text($(eventName.target).text());
        },
        
        /**
   	  	* show  Upload files option when we select category
   	  	*/
   	 	uploadFiles: function(eventName){
   	 		
   	 		eventName.preventDefault();
   	 		$('#upload-files-area').click();
	   		  
   	 	},
   	 	
   	 	/**
         * select private to class options
         */
        selectPrivateToList: function(eventName){
        	
        	eventName.preventDefault();
        	$('#select-privateTo').text($(eventName.target).text());
        	
        	//uncheck private check box when select Public
        	if($(eventName.target).text() == "Public")
        	{
        		$('#private-to').attr('checked',false);
        	}
        	else
        	{
        		$('#private-to').attr('checked',true);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
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
   			 			this.comment.save({comment : commentText, messageId :parent},{
	   			    	success : function(model, response) {
		   			    		
	   			    		$('#'+parent+'-msgComment').val('');
	   				  		$('#'+parent+'-addComments').slideUp(200);
	   				  		
	   	   				    /* display the posted comment  */
		   			    			 
	   				    		var compiledTemplate = Handlebars.compile(DiscussionComment);
	   				    		$('#'+parent+'-allComments').prepend(compiledTemplate(response));
	   				    		
	   				    		if(!$('#'+parent+'-allComments').is(':visible'))
	   							{  
	   								
	   								$('#'+parent+'-msgRockers').slideUp(1);
	   								$('#'+parent+'-newCommentList').slideDown(1);

	   								var newComments = $("#tpl-discussion-messages-newComment").html();
	   								$('#'+parent+'-newCommentList').prepend(compiledTemplate(response));
	   								
	   							}
	   				    		totalComments++; 
	   				    		$('#'+parent+'-show-hide').text("Hide All");
	   							$('#'+parent+'-totalComment').text(totalComments);
	   			    	},
	   			    	error : function(model, response) {
	   			    		
	   	                    console.log("error");
	   			    	}
	
	   			    });

   			 	}
   			 	
	        }
        },
        
        
        /**
	     * post message on enter key
	     */
	    postMessageOnEnterKey: function(eventName){
	    	
	    	var self = this;
	    	
			if(eventName.which == 13) {
				self.postMessage(); 
			}
			if(eventName.which == 32){
				var text = $('#msg-area').val();
				var links =  text.match(this.urlRegex); 
				 /* create bitly for each url in text */
				if(links)
				{
					if(!self.urlRegex2.test(links[0])) {
						urlLink = "http://" + links[0];
				  	}
			     	else
			     	{
			    		urlLink =links[0];
			     	}
						 
					//To check whether it is google docs or not
					if(!urlLink.match(/^(https:\/\/docs.google.com\/)/))  
		            { 
						/* don't create bitly for shortened  url */
						if(!urlLink.match(/^(http:\/\/bstre.am\/)/))
						{
							/* create bitly  */
							$.ajax({
				    			type : 'POST',
				    			url : "bitly",
				    			data : {
				    				 link : urlLink 
				    			},
				    			dataType : "json",
				    			success : function(data) {
				    				 var msg = $('#msg-area').val();
				    				 message = msg.replace(links[0],data.data.url);
				    				 $('#msg-area').val(message);
						    				
				    			}
				    		});
                                                    
                            var preview = {
                                // Instead of posting to the server, send the object to display for
                                // rendering to the feed.
                                submit : function(e, data){
                                  e.preventDefault();
//                                  this.display.create(data);
                                  
                                }
                            }

//							$('#msg-area').preview({key:'4d205b6a796b11e1871a4040d3dc5c07'});
						          
				        }
		            }
			    }
			}
    	},
    	
    	
    	 /**
	     * PUBNUB real time push
	     */
		 setupPushConnection: function() {
			 var self = this;
			 self.pagePushUid = Math.floor(Math.random()*16777215).toString(16);
			 var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
			 var trueurl='';
			
			 /* for message posting */
			 PUBNUB.subscribe({
				 channel : "stream",
				 restore : false,
				 callback : function(message) {
					 var streamId = $('.sortable li.active').attr('id');
					 if (message.pagePushUid != self.pagePushUid)
					 { 
						 if(message.streamId==streamId)
			       		 	{
							 /* display the posted message on feed */
		  		    		 _.each(message.data, function(message) {
		  			    		var compiledTemplate = Handlebars.compile(DiscussionMessage);
		  			    		$('#all-messages').prepend( compiledTemplate({data:message}));
		  			    		
		  		    		 });
			       		 	}
				 	   }
			 
			 	   }
		 	   })
	    		   		
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
        
	})
	return Discussions;
});
