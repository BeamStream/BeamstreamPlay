

define(['baseModel',
				'model/comment',
				'model/answer',
				
				], function(BaseModel, Comment, Answer) {
	var Question = BaseModel.extend({ 
		objName: 'Question',
		defaults:{
		},
		
		validation: {
			
		}, 

		init: function(){
			this.set('editStatus', false);
			this.set('deleted', false);
		},

		// this rocks or unrocks it
		rockQuestion: function(){
			var questionId = this.get('question').id.id;
			var ownerId = localStorage["loggedUserId"];
			if (this.get('onlineUserRocked')){
				this.set({'onlineUserRocked': false}, {silent: true});
				for (var i = 0; i < this.get('question').rockers.length; i++){
					if (this.get('question').rockers[i].id === this.get('onlineUser')){
						this.get('question').rockers.splice(i, 1);
					}
				}
			} else {
				this.set({'onlineUserRocked': true}, {silent: true})
				this.get('question').rockers.push({id: this.get('onlineUser')});
			}
			
			this.urlRoot = 'rock/question';
			this.save({id: this.get('question').id.id}, {
				success : function(model, response){
				
				PUBNUB.publish({
						channel : "questionRockfromSidetoMainStream",
	                    message : { pagePushUid: self.pagePushUid ,ownerId:ownerId,data:response,quesId:questionId}
	                })
	           PUBNUB.publish({
						channel : "questionRockfromSidetoSideStream",
	                    message : { pagePushUid: self.pagePushUid ,data:response,quesId:questionId}
	                })

			}
			});
			this.trigger('change:questionRock');
		}, 

		postComment: function(commentText,parent,commentAmt){
			var questionId = parent;
			var cmtCount = commentAmt;
			var comment = new Comment();

			//var exmp = this.get('comments');
			//this.get('comments').push(comment);
			this.get('question').comments.push(comment);
			comment.urlRoot = '/newComment';
			comment.save({comment: commentText, questionId: this.get('question').id.id},{
				success : function(model, response) {
				
					
				
					/* pubnum auto push */
						PUBNUB.publish({
		                	channel : "sideCommentPushMainStream",
                        message : { pagePushUid: self.pagePushUid ,data:response,questionId :questionId,cmtCount:cmtCount}
		                })
		                
		             	
					/* pubnum auto push */
						PUBNUB.publish({
		                	channel : "sideCommentPushSideStream",
                        message : { pagePushUid: self.pagePushUid ,data:response,questionId :questionId,cmtCount:cmtCount}
		                })
			}
				
			}
				
			);
			this.trigger('commentPost');
		}, 

		postAnswer: function(answerText,parent,answerAmt){
			var questionId = parent;
			var ansCount = answerAmt;
			var answer = new Answer();
			this.get('question').answers.push(answer);
			answer.urlRoot = '/answer';
			answer.save({answerText: answerText, questionId: this.get('question').id.id},{
				success : function(model, response) {
					
					/* pubnum auto push */
						PUBNUB.publish({
				        	channel : "sideAnswerPushMainStream",
				        message : { pagePushUid: self.pagePushUid ,data:response,questionId :questionId,ansCount:ansCount}
				        })
				        
				     	
					/* pubnum auto push */
						PUBNUB.publish({
				        	channel : "sideAnswerPushSideStream",
				        message : { pagePushUid: self.pagePushUid ,data:response,questionId :questionId,ansCount:ansCount}
				        })
				}
				
				});
			this.trigger('answerPost');
		}, 

		updateEditStatus: function(){
			this.set('editStatus', !this.get('editStatus'), {silent: true});
			this.trigger('statusChangeModel', {editStatus: this.get('editStatus')});
		}, 

		followQuestion: function(){
			this.urlRoot = '/follow/question';
			this.save({id: this.get('question').id.id});
		}, 

		markAnswered: function(){
			
			this.urlRoot = '/markAsAnswered/';
			this.save({id: this.get('question').id.id}, {success:function(model,data){
							
				if (data.response == false){
					alert("Question is not answered.");
				}
				if (data.response == true){					
					model.get('question').answered = true;
					model.trigger('questionAnsweredModel');
					var countUnansweredQues = $("#number-new-questions").text();
					countUnansweredQues--;
					$("#number-new-questions").text(countUnansweredQues);
				}				
			}});
			
		}, 

		deleteQuestion: function(){
			this.urlRoot = '/remove/question/';
			this.save({id: this.get('question').id.id}, {silent: true});
			this.clear({silent: true});
			this.set({'deleted': true}, {silent: true});
			this.trigger('questionModelDelete');
		},
		

		// this was the attempted implementation with pubnub
		// rockQuestion: function(){
	 //    this.urlRoot = 'rock/question';
	 //    var that = this;
	 //    this.save({id: this.get('question').id.id}, {success: function(model, response){
	 //    	console.log('question save to db', model);
	 //    	// PUBNUB.publish({
	 //    	// 	channel: 'questionRock', 
	 //    	// 	message: {pagePushUid: that.pagePushUid, streamId: that.get('question').streamId.id, data: response, quesId: that.get('question').id.id}
	 //    	// })
	 //    }
	 //    })
		// }

	});
				
	
	return Question;
});
