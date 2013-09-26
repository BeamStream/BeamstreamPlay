define([
	'baseView', 
	'text!templates/questionStreamItem.tpl'
], 
function(BaseView, questionStreamItemTPL){
	var QuestionStreamItem = BaseView.extend({
		objName: 'questionStreamItem', 

		events: {
			'click .rock-icon': 'rockQuestion', 
			'click .already-rocked': 'rockQuestion',
			'click .qs-comment-link': 'toggleCommentText',
			'click .qs-answer-link': 'toggleQuestionText', 
			'keypress .qs-answer': 'submitAnswer', 
			'keypress .qs-comment': 'submitComment',
			'click .follow-question': 'followQuestion'
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
			// the code below is only toggling for unrocking a q, but probably need to rerender view anyway
			// if (e.currentTarget.className === 'rock-icon') {
			// 	this.$el.find('.rock-icon').toggleClass('rock-icon already-rocked');
			// }
			// if (e.currentTarget.className === 'already-rocked') {
			// 	this.$el.find('.already-rocked').toggleClass('already-rocked rock-icon');
			// }
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

		followQuestion: function(){
			this.model.followQuestion();
		}

	});

	return QuestionStreamItem;
});