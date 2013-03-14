/***
* BeamStream
*
* Author                : Aswathy .P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/March/2013
* Description           : Backbone view for discussion tab
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['view/formView',
        'model/discussion',
        'text!templates/discussionMessage.tpl',
        ], function(FormView, DiscussionModel ,DiscussionMessage){
	var Discussions;
	Discussions = FormView.extend({
		objName: 'Discussion',
		
		events:{
			 'click #post-button' : 'postMessage',
			 'click #share-discussions li a' : 'actvateShareIcon',
			 'click #private-to' : 'checkPrivateAccess',
		 },

		 
		 onAfterInit: function(){	
            this.data.reset();
            this.pagenum = 1;
            this.pageLimit = 10;
            this.discussion = new DiscussionModel();
		 },
        
        
		 /**
         * after render 
         */
		 onAfterRender: function(){
        	 
        	
        	/* @TODO display all messages of a stream  on message feed */
        	var streamId =  $('#myStream').attr('data-value');
        	this.discussion.url = "/allMessagesForAStream/"+streamId+"/"+this.pageLimit+"/"+this.pagenum;
        	this.discussion.fetch();
        	
        	 _.each(this.discussion, function(message) {
	    		var compiledTemplate = Handlebars.compile(DiscussionMessage);
	    		$('#all-messages').prepend( compiledTemplate({data:message}));
		    		
    		 });
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
		    
		    this.discussion.url = "/newMessage";
		    // set values to model
		    this.discussion.save({streamId : streamId, message :message, messageAccess:messageAccess},{
		    	success : function(model, response) {
		    		
		    		   $('#msg-area').val("");
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
        		
//        		BS.selected_medias.remove($(eventName.target).parents('li').attr('name'));
        		$(eventName.target).parents('li').removeClass('active');
        		 
        	}
        	else
        	{
        		
//        		BS.selected_medias.push($(eventName.target).parents('li').attr('name'));
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
 
	})
	return Discussions;
});
