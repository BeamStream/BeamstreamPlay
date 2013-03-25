define(['view/formView',
        'model/discussion',
        'model/comment',
        'text!templates/discussionMessage.tpl',
        'text!templates/discussionComment.tpl',
        ], function(FormView, DiscussionModel, CommentModel , DiscussionMessage ,DiscussionComment){
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
		 },

		 
		 onAfterInit: function(){	
            this.data.reset();
            this.pagenum = 1;
            this.pageLimit = 10;
            this.setupPushConnection();
            this.comment = new CommentModel();
		 },
        
        
		 /**
         * after render 
         */
		 onAfterRender: function(){
        	 
        	/* @TODO display all messages of a stream  on message feed */
        	var streamId =  $('#myStream').attr('data-value');
//        	this.discussion.url = "/allMessagesForAStream/"+streamId+"/"+this.pageLimit+"/"+this.pagenum;
//        	this.discussion.fetch();
//        	
//        	 _.each(this.discussion, function(message) {
//	    		var compiledTemplate = Handlebars.compile(DiscussionMessage);
//	    		$('#all-messages').prepend( compiledTemplate({data:message}));
//		    		
//    		 });
		},
		
		
		
        /**
         * post messages 
         */
        postMessage: function(){
        	
        	var self = this;
 	        var streamId =  $('.sortable li.active').attr('id');
 	        var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
 	        var message = $('#msg-area').val();
 	        
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
		    
		    this.discussion = new DiscussionModel();
		    this.discussion.url = "/newMessage";
		    // set values to model
		    this.discussion.save({streamId : streamId, message :message, messageAccess:messageAccess},{
		    	success : function(model, response) {
		    		
		    		   $('#msg-area').val("");
		    		   
		    		   /* PUBNUB -- AUTO AJAX PUSH */ 
                       PUBNUB.publish({
                      	 channel : "stream",
	                         message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:response}
                       }) 
                       
                       
		    		  /* display the posted message on feed */
		    		 _.each(response, function(message) {
		    			 
			    		var compiledTemplate = Handlebars.compile(DiscussionMessage);
			    		$('#all-messages').prepend( compiledTemplate({data:message}));
			    		
		    		 });
		    	},
		    	error : function(model, response) {
		    		
                    console.log("error");
		    	}

		    });
		    
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
   			 		this.comment.save({comment : commentText, messageId :parent},{
	   			    	success : function(model, response) {
		   			    		
	   			    		$('#'+parent+'-msgComment').val('');
	   				  		$('#'+parent+'-addComments').slideUp(200);
	   				  		
	   	   				    /* display the posted comment  */
	   			    		_.each(response, function(comment) {
		   			    			 
	   				    		var compiledTemplate = Handlebars.compile(DiscussionComment);
	   				    		$('#'+parent+'-allComments').prepend( compiledTemplate({data:comment}));
		   				    		
	   			    		 });
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
 
	})
	return Discussions;
});
