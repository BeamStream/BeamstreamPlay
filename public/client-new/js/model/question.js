/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 18/March/2013
* Description           : Backbone model for question
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['baseModel',
				'model/comment',
				'model/answer'
				], function(BaseModel, Comment, Answer) {
	var Question = BaseModel.extend({ 
		objName: 'Question',
		defaults:{
		},
		
		validation: {
			
		}, 

		init: function(){
			this.set('editStatus', false);
		},

		// this rocks or unrocks it
		rockQuestion: function(){
			this.urlRoot = 'rock/question';
			this.save({id: this.get('question').id.id});
		}, 

		postComment: function(commentText){
			var comment = new Comment();
			comment.urlRoot = '/newComment';
			comment.save({comment: commentText, questionId: this.get('question').id.id});
		}, 

		postAnswer: function(answerText){
			var answer = new Answer();
			answer.urlRoot = '/answer';
			answer.save({answer: answerText, questionId: this.get('question').id.id});
		}, 

		updateEditStatus: function(){
			var editStatus = this.get('editStatus');
			this.set('editStatus', !editStatus);
			console.log(this.get('editStatus'));
			console.log(this.collection);
		}, 

		followQuestion: function(){
			this.urlRoot = '/follow/question';
			this.save({id: this.get('question').id.id});
		}

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
