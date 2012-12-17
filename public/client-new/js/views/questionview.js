/***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/November/2012
	 * Description           : Backbone view for stream Questions page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.QuestionView = Backbone.View.extend({
	
		events : {
			 "click #post-question" : "postQuestion",
//			 "click .follow-button" : "followMessage",
//			 "click .rock-message" : "rockMessage",
//			 "click .rocks" : "rockMessage",
//			 "click .rocks-up" : "rockMessage",
//			 "click .add-comment" : "showCommentTextArea",
//			 "click .show-all" : "showAllList",
//			 "click .show-all-comments" : "showAllCommentList",
//			 "keypress .add-message-comment" : "addMessageComments",
//			 "keyup .add-message-comment" : "deleteCommentText",
//			 "focusout .add-message-comment" : "removeCommentTextArea",
//			 "click .rock-comments" : "rockComment",
//			 "click .rocks-small a" : "rockComment",
//			 "keypress #msg-area" : "postMessageOnEnterKey",
//			 "click #upload-files" : "showUploadSection",
//			 "change #upload-files-area" : "getUploadedData",
//			 "click #private-to-list li" :"selectPrivateToList",
//			 "click #private-to" : "checkPrivateAccess",
//			 "click #share-discussions li a" : "actvateShareIcon",
			 "click #sortBy-list" : "sortQuestions",
			 "click #date-sort-list" : "sortQuestionsWithinAPeriod",
//			 "keypress #sort_by_key" : "sortMessagesByKey",
			 
			 
			 "click .add-poll " : "addPollOptionsArea",
			 "click .add-option" : "addMorePollOptions",
			 "click #private-to" : "checkPrivateAccess",
			 "click #private-to-list li" :"selectPrivateToList",
			 "click #share-discussions li a" : "actvateShareIcon",
			 "click #question-file-upload li " : "uploadFiles"
		},
	
		initialize : function() {
			
			console.log('Initializing QuestionView');
			this.source = $("#tpl-questions-middle-contents").html();
			this.template = Handlebars.compile(this.source);
			 
		},
		
		/**
		 * render class Info screen
		 */
		render : function(eventName) {
		    
			$(this.el).html(this.template);
			return this;
		},
		/**
		 * function for post questions 
		 */
		postQuestion: function(eventName){
			eventName.preventDefault();
			var question = $('#Q-area').val();
			console.log(question);
			var streamId =  $('.sortable li.active').attr('id');
			
			var question = new BS.Question();
			question.set({question:question ,streamId:streamId ,access:"public"});
			var questionInfo = JSON.stringify(question);
			
			console.log(questionInfo);
//			var data = {"streamId" : streamId,"question": question};
//			console.log(JSON.stringify(data));
			/* post profile page details */
	         $.ajax({
	             type: 'POST',
	             data: {
	            	 question : question,
					 streamId : streamId,
					 access :"Publlic"
	             },
	             url: BS.newQuestion,
	             cache: false,
	             dataType : "json",
	             success: function(data){
	            	 
	             }
	         }); 
	         
		},
		
		
		/**
         * NEW THEME - select Private / Public ( social share ) options 
         */
        checkPrivateAccess: function (eventName) {
        	var streamName = $('.sortable li.active').text();
        	
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
         * NEW THEME - select private to class options
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
         * NEW THEME - actvate share icon on selection
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
         * NEW THEME -show  Upload files option when we select category
         */
   		 uploadFiles: function(eventName){
   			 eventName.preventDefault();
   			 $('#upload-files-area').click();
   		 },
   	 
   	 
   	 
		/**
		 * click to view areas for adding poll options
		 */
		addPollOptionsArea: function(eventName){
			eventName.preventDefault();
			BS.options = 2;
			$('.answer').slideToggle(700); 
		},
		
		/**
		 * function  to add more poll options
		 */
		addMorePollOptions : function(eventName){
			
			eventName.preventDefault();
			BS.options++;
			if(BS.options == 3)
				var options ='<li><input type="text"   id="option'+BS.options+'" placeholder="Add 3rd Poll Option" name="Add Option"> </li>';
			else
				var options ='<li><input type="text"   id="option'+BS.options+'" placeholder="Add '+BS.options+'th Poll Option" name="Add Option"> </li>';

			var parent = $('#add_more_options').parents('li');
			$('.answer li').last().after(options);
			
			 
			 
		 },
			
			
		/**
         *  NEW THEME - Sort questions
         */
		sortQuestions: function(eventName){
        	
        	eventName.preventDefault();
        	var self = this;
        	var streamId = $('.sortable li.active').attr('id');
        	$('#sortBy-select').text($(eventName.target).text());
        	
//        	var sortBy = $(eventName.target).attr('name');
//        	if(sortBy == "most-recent")
//        	{
//        		BS.msgSortedType = "date";
//        		$('#all-messages').html('');
//        		BS.pageForDate = 1;
//        		self.sortByMostRecent(streamId,BS.pageForDate,BS.pageLimit);
//        		
//        	}
//        	else if(sortBy == "highest-rated")
//        	{
//        		BS.msgSortedType = "vote";
//        		$('#all-messages').html('');
//        		BS.pageForVotes = 1;
//        		self.sortByHighestRated(streamId,BS.pageForVotes,BS.pageLimit)
//        	}
        		
        },
        
        /**
         * NEW THEME - sort questions within a period 
         */
        sortQuestionsWithinAPeriod: function(eventName){
        	eventName.preventDefault();
        	$('#date-sort-select').text($(eventName.target).text());
        },
	 
	  
	});
