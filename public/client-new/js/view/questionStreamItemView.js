define([
	'baseView', 
	'../handlebar_helpers/pluralize_helper',
	'text!templates/questionStreamItem.tpl',
	'view/questionItemView',
    'model/question',
    'model/questionStream',
], 
function(BaseView, Pluralize, questionStreamItemTPL,QuestionItemView,QuestionModel,QuestionStreamModel){
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
			this.receiveThroughPubNub();
		},
		

		initialize: function(){
			BaseView.prototype.initialize.apply(this, arguments);
			//this.model.on('answerPost', this.render, this);
			//this.model.on('commentPost', this.render, this);
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
				
				var element = e.target.parentElement;
				var parent =$(element).parents('div.side-question').attr('id');
				var answerAmt = $('div#'+parent+'-totalanswersidebar').text();
				
				
				var answerSubmission = this.$el.find('.qs-answer').val();
				this.model.postAnswer(answerSubmission,parent,answerAmt);
				this.$el.find('.qs-answer').val('');
				
				var QuestionStream = new QuestionStreamModel();
				
				QuestionStream.createQuestionList();
				var countUnansweredQues = $("#number-new-questions").text();
				countUnansweredQues--;
				$("#number-new-questions").text(countUnansweredQues);
				
				
				
			}
			
		}, 

		submitComment: function(e){
				var element = e.target.parentElement;
				var parent =$(element).parents('div.side-question').attr('id');
				var commentAmt = $('div#'+parent+'-totalcommentsidebar').text();
			      if (e.keyCode === 13) {
				var commentSubmission = this.$el.find('.qs-comment').val();
				//var commentCount = $()
				this.model.postComment(commentSubmission,parent,commentAmt);
				this.$el.find('.qs-comment').val('');
				this.model.updateEditStatus();
			}
		},
		
		
		receiveThroughPubNub: function() { 
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
	   		   
	   		      PUBNUB.subscribe({                		
                	  	    channel : "questionanswerSideStream",
                	  		restore : false,
                	  			callback : function(question) {      
	   		    	 
                	  			if(question.pagePushUid != self.pagePushUid)
                	  				{   				
                	  						
                	  						question.cmtCount++; 
                	  					              	  						
                	  						$('#'+question.parent+"-totalanswersidebar").text(question.cmtCount);
                	  				}
                  				}
                  })
                  
                    PUBNUB.subscribe({
		
 	   			   channel : "delete_ques_AnswerSide",
 	   			   restore : false,
 	   			   callback : function(question) {    
                    	
 	   				   if(question.pagePushUid != self.pagePushUid)
 	   				   {    
   					  		var answerCountSideBar = $('#'+question.questionId+"-totalanswersidebar").text();   					  		
	                		$('#'+question.questionId+"-totalanswersidebar").text(answerCountSideBar-1);
	                		
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
			var countUnansweredQues = $("#number-new-questions").text();
			countUnansweredQues--;
			$("#number-new-questions").text(countUnansweredQues);
		},

		toggleDropdown: function(){
			this.model.updateEditStatus();
		}


	});

	return QuestionStreamItem;
});