define([ 'baseModel', 'model/comment', 'model/answer',

], function(BaseModel, Comment, Answer) {
	var Question = BaseModel.extend({
		objName : 'Question',
		defaults : {},

		validation : {

		},

		init : function() {
			this.set('editStatus', false);
			this.set('deleted', false);
		},

		// this rocks or unrocks it
		rockQuestion : function() {
			var questionId = this.get('question').id.id;
			var ownerId = localStorage["loggedUserId"];
			if (this.get('onlineUserRocked')) {
				this.set({
					'onlineUserRocked' : false
				}, {
					silent : true
				});
				for (var i = 0; i < this.get('question').rockers.length; i++) {
					if (this.get('question').rockers[i].id === this
							.get('onlineUser')) {
						this.get('question').rockers.splice(i, 1);
					}
				}
			} else {
				this.set({
					'onlineUserRocked' : true
				}, {
					silent : true
				})
				this.get('question').rockers.push({
					id : this.get('onlineUser')
				});
			}

			this.urlRoot = 'rock/question';
			this.save({
				id : this.get('question').id.id
			}, {
				success : function(model, response) {

					PUBNUB.publish({
						channel : "questionRockfromSidetoMainStream",
						message : {
							pagePushUid : self.pagePushUid,
							ownerId : ownerId,
							data : response,
							quesId : questionId
						}
					})
					PUBNUB.publish({
						channel : "questionRockfromSidetoSideStream",
						message : {
							pagePushUid : self.pagePushUid,
							data : response,
							quesId : questionId
						}
					})

				}
			});
			this.trigger('change:questionRock');
			
			
			var selector = questionId+"-"+"rockicon"
			var currentClassName = $("#"+selector).attr("class");
			if(currentClassName == "rock-icon"){
				$("#"+selector).attr("class", "already-rocked");
			}else{
				$("#"+selector).attr("class", "rock-icon");
			}
			
			
		},

		postComment : function(commentText, parent, commentAmt, streamId) {
			var questionId = parent;
			var cmtCount = commentAmt;
			var comment = new Comment();

			// var exmp = this.get('comments');
			// this.get('comments').push(comment);
			this.get('question').comments.push(comment);
			comment.urlRoot = '/newComment';
			comment.save({
				comment : commentText,
				questionId : this.get('question').id.id,
				stream_id : streamId
			}, {
				success : function(model, response) {

					/* pubnum auto push */
					PUBNUB.publish({
						channel : "sideCommentPushMainStream",
						message : {
							pagePushUid : self.pagePushUid,
							data : response,
							questionId : questionId,
							cmtCount : cmtCount
						}
					})

					/* pubnum auto push */
					PUBNUB.publish({
						channel : "sideCommentPushSideStream",
						message : {
							pagePushUid : self.pagePushUid,
							data : response,
							questionId : questionId,
							cmtCount : cmtCount
						}
					})
				}

			}

			);
			this.trigger('commentPost');
		},

		postAnswer : function(answerText, parent, answerAmt, streamId) {
			var questionId = parent;
			var ansCount = answerAmt;
			var answer = new Answer();
			this.get('question').answers.push(answer);
			answer.urlRoot = '/answer';
			answer.save({
				answerText : answerText,
				questionId : this.get('question').id.id,
				streamId : streamId
			}, {
				success : function(model, response) {

					/* pubnum auto push */
					PUBNUB.publish({
						channel : "sideAnswerPushMainStream",
						message : {
							pagePushUid : self.pagePushUid,
							data : response,
							questionId : questionId,
							ansCount : ansCount
						}
					})

					/* pubnum auto push */
					PUBNUB.publish({
						channel : "sideAnswerPushSideStream",
						message : {
							pagePushUid : self.pagePushUid,
							data : response,
							questionId : questionId,
							ansCount : ansCount
						}
					})
				}

			});
			this.trigger('answerPost');
		},

		updateEditStatus : function() {
			this.set('editStatus', !this.get('editStatus'), {
				silent : true
			});
			this.trigger('statusChangeModel', {
				editStatus : this.get('editStatus')
			});
		},

		followQuestion : function() {
			this.urlRoot = '/follow/question';
			this.save({
				id : this.get('question').id.id
			});
		},

		markAnswered : function() {
			var questionId = this.get('question').id.id;
			var streamID = this.get('question').streamId.id;
			this.urlRoot = '/markAsAnswered/';
			this.save({
				id : this.get('question').id.id
			}, {
				success : function(model, data) {
					if (data.response == false) {
						alert("Question is not answered.");
					}
					if (data.response == true) {
						model.get('question').answered = true;
						model.trigger('questionAnsweredModel');
						
						PUBNUB.publish({
							channel : "markedAnswer",
							message : {
								pagePushUid : self.pagePushUid,
								questionId : questionId,
								streamID : streamID
							}
						})
					}
				}
			});

		},

		deleteQuestion : function() {
			var questionId = this.get('question').id.id;
			var streamID = this.get('question').streamId.id;
			this.urlRoot = '/remove/question/';
			this.save({
				id : this.get('question').id.id
			}, {
				success : function(model, data) {
					PUBNUB.publish({
						channel : "sideQuestionDelete",
						message : {
							pagePushUid : self.pagePushUid,
							questionId : questionId,
							streamID : streamID
						}
					})
				}
			});
			this.clear({
				silent : true
			});
			this.set({
				'deleted' : true
			}, {
				silent : true
			});
			this.trigger('questionModelDelete');
		},

	// this was the attempted implementation with pubnub
	// rockQuestion: function(){
	// this.urlRoot = 'rock/question';
	// var that = this;
	// this.save({id: this.get('question').id.id}, {success: function(model,
	// response){
	// console.log('question save to db', model);
	// // PUBNUB.publish({
	// // channel: 'questionRock',
	// // message: {pagePushUid: that.pagePushUid, streamId:
	// that.get('question').streamId.id, data: response, quesId:
	// that.get('question').id.id}
	// // })
	// }
	// })
	// }

	});

	return Question;
});
