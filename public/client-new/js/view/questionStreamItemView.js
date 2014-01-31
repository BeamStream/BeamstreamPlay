define([
	'baseView', 
	'../handlebar_helpers/pluralize_helper',
	'text!templates/questionStreamItem.tpl',
	'view/questionItemView',
    'model/question',
], 
function(BaseView, Pluralize, questionStreamItemTPL,QuestionItemView,QuestionModel){
	var QuestionStreamItem = BaseView.extend({
		objName: 'questionStreamItem', 

		events: {
			'click .rock-icon': 'rockQuestion', 
			'click .already-rocked': 'rockQuestion',
			'click .qs-comment-link': 'toggleCommentText',
			'click .qs-answer-link': 'toggleQuestionText', 
			'keypress .qs-answer': 'submitAnswer', 
			'keypress .qs-comment': 'submitComment',
			'click .follow-question': 'followQuestion', 
			'click .mark-answered': 'markAnswered', 
			'click .delete-question': 'deleteQuestion',
			'click .question-dropdown': 'toggleDropdown'
		
		}, 
		
		
		onAfterInit: function(){
			this.receiveCommentThroughPubNub();
		},
		

		initialize: function(){
			BaseView.prototype.initialize.apply(this, arguments);
			this.model.on('answerPost', this.render, this);
			this.model.on('commentPost', this.render, this);
		},

		render: function(){
			var compiledTemplate = Handlebars.compile(questionStreamItemTPL);
			this.$el.html(compiledTemplate(this.model.attributes));
			return this;
		}, 

		rockQuestion: function(e){
			this.model.rockQuestion();
			
		}, 

		toggleCommentText: function(){
			this.$el.find('.qs-comment').toggleClass('question-stream-hide', 'question-stream-show');
			this.model.updateEditStatus();
		}, 

		toggleQuestionText: function(){
			this.$el.find('.qs-answer').toggleClass('question-stream-hide', 'question-stream-show');
			this.model.updateEditStatus();
		}, 

		submitAnswer: function(e){
			if (e.keyCode === 13) {
				var answerSubmission = this.$el.find('.qs-answer').val();
				this.model.postAnswer(answerSubmission);
				this.$el.find('.qs-answer').val('');
				this.model.updateEditStatus();
			}
		}, 

		submitComment: function(e){
			if (e.keyCode === 13) {
				var commentSubmission = this.$el.find('.qs-comment').val();
				this.model.postComment(commentSubmission);
				this.$el.find('.qs-comment').val('');
				this.model.updateEditStatus();
			}
		},
		
		
		receiveCommentThroughPubNub: function() {
                 var self = this;
                 self.pagePushUid = Math.floor(Math.random()*16777215).toString(16);
                 var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
                 var trueUrl='';

                 // Trigger the change pagePushUid event
                 this.trigger('change:pagePushUid', {
                         pagePushUid: self.pagePushUid
                 });
                 
                  PUBNUB.subscribe({                		
                	  	    channel : "questioncommentSideStream",
                	  		restore : false,
                	  			callback : function(question) {                 	  		
                	  			if(question.pagePushUid != self.pagePushUid)
                	  				{   				
                	  						
                	  						question.cmtCount++; 
                	  					              	  						
                	  						$('#'+question.parent+"-totalcommentsidebar").text(question.cmtCount);
                	  				}
                  				}
                  })
                  
                  PUBNUB.subscribe({
		
 	   			   channel : "delete_ques_CommentSideBar",
 	   			   restore : false,
 	   			   callback : function(question) {                	  	
 	   				   if(question.pagePushUid != self.pagePushUid)
 	   				   {    	   				   	   
   					  		var commentCountSideBar = $('#'+question.questionId+"-totalcommentsidebar").text();   					  		
	                		$('#'+question.questionId+"-totalcommentsidebar").text(commentCountSideBar-1);
 	   				   }
		   		   }
	   		   })
                  
                 
			},

		followQuestion: function(){
			this.model.followQuestion();
		}, 

		markAnswered: function(){
			this.model.markAnswered();
		},

		deleteQuestion: function(){
			this.model.deleteQuestion();
		},

		toggleDropdown: function(){
			this.model.updateEditStatus();
		}


	});

	return QuestionStreamItem;
});